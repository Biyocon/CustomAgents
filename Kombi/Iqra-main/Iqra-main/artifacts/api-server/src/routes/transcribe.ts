import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import multer, { MulterError } from "multer";
import { Buffer } from "node:buffer";
import { spawnSync } from "node:child_process";
import { TranscribeAudioResponse } from "@workspace/api-zod";
import {
  detectAudioFormat,
  ensureCompatibleFormat,
  speechToText,
} from "@workspace/integrations-openai-ai-server/audio";

const MAX_AUDIO_BYTES = 25 * 1024 * 1024;
const PER_IP_LIMIT = 30;
const PER_IP_WINDOW_MS = 60_000;
const GLOBAL_MAX_CONCURRENT = 8;

// Probe synchronously at module load so the very first request sees the
// correct availability flag (no cold-start race between probe + handler).
const ffmpegProbe = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
const ffmpegAvailable = ffmpegProbe.status === 0 && !ffmpegProbe.error;
const ffmpegProbeError: string | null = ffmpegAvailable
  ? null
  : ffmpegProbe.error
    ? ffmpegProbe.error.message
    : `ffmpeg -version exited with code ${ffmpegProbe.status ?? "unknown"}`;

interface IpBucket {
  count: number;
  windowStartedAt: number;
}

const ipBuckets = new Map<string, IpBucket>();
let inFlight = 0;

function getClientKey(req: Request): string {
  return (req.ip ?? req.socket.remoteAddress ?? "unknown").toString();
}

function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  const key = getClientKey(req);
  let bucket = ipBuckets.get(key);
  if (!bucket || now - bucket.windowStartedAt >= PER_IP_WINDOW_MS) {
    bucket = { count: 0, windowStartedAt: now };
    ipBuckets.set(key, bucket);
  }
  bucket.count += 1;

  if (bucket.count > PER_IP_LIMIT) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((PER_IP_WINDOW_MS - (now - bucket.windowStartedAt)) / 1000),
    );
    req.log.warn({ key, count: bucket.count }, "Transcription rate limit exceeded");
    res
      .status(429)
      .set("Retry-After", String(retryAfterSec))
      .json({ error: `Rate limit exceeded. Try again in ${retryAfterSec}s.` });
    return;
  }

  if (inFlight >= GLOBAL_MAX_CONCURRENT) {
    req.log.warn({ inFlight }, "Transcription concurrency cap reached");
    res
      .status(429)
      .set("Retry-After", "1")
      .json({ error: "Server is busy transcribing. Please retry shortly." });
    return;
  }
  inFlight += 1;
  let released = false;
  res.on("close", () => {
    if (released) return;
    released = true;
    inFlight = Math.max(0, inFlight - 1);
  });

  next();
}

setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of ipBuckets) {
    if (now - bucket.windowStartedAt > PER_IP_WINDOW_MS * 5) {
      ipBuckets.delete(key);
    }
  }
}, PER_IP_WINDOW_MS).unref();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_AUDIO_BYTES, files: 1, fields: 4 },
});

const audioUpload: RequestHandler = (req, res, next) => {
  upload.single("audio")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof MulterError) {
      const status = err.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? `Audio file is too large. Maximum is ${MAX_AUDIO_BYTES} bytes.`
          : `Invalid upload: ${err.message}`;
      req.log.warn({ code: err.code }, "Multer rejected upload");
      res.status(status).json({ error: message });
      return;
    }
    req.log.error({ err }, "Unexpected upload error");
    res.status(400).json({ error: "Invalid upload." });
  });
};

const router: IRouter = Router();

router.post(
  "/transcribe",
  rateLimit,
  audioUpload,
  async (req, res): Promise<void> => {
    const startedAt = Date.now();
    try {
      if (!req.file) {
        res.status(400).json({ error: "Audio file is required (field 'audio')." });
        return;
      }

      const language =
        typeof req.body?.language === "string" ? req.body.language.trim() : "";
      const audioBuffer = req.file.buffer as Buffer;

      if (audioBuffer.length === 0) {
        res.status(400).json({ error: "Audio file is empty." });
        return;
      }

      // Only block on missing ffmpeg if we actually need to transcode.
      const detected = detectAudioFormat(audioBuffer);
      const needsConversion = detected !== "wav" && detected !== "mp3";
      if (needsConversion && !ffmpegAvailable) {
        req.log.error({ ffmpegProbeError, detected }, "ffmpeg unavailable");
        res
          .status(503)
          .set("Retry-After", "30")
          .json({
            error:
              "Transcription is temporarily unavailable: required audio tooling is missing on the server.",
          });
        return;
      }

      const { buffer, format } = await ensureCompatibleFormat(audioBuffer);
      const text = await speechToText(buffer, format, {
        language: language || undefined,
      });
      const durationMs = Date.now() - startedAt;

      req.log.info(
        {
          durationMs,
          inputBytes: audioBuffer.length,
          format,
          language: language || undefined,
          textLength: text.length,
        },
        "Transcription completed",
      );

      res.json(TranscribeAudioResponse.parse({ text, durationMs }));
    } catch (err) {
      req.log.error({ err }, "Transcription failed");
      res.status(500).json({ error: "Transcription failed. Please try again." });
    }
  },
);

export default router;
