import {
  Router,
  type IRouter,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { ChatCompletionBody, ChatCompletionResponse } from "@workspace/api-zod";
import {
  chatCompletion,
  type ChatMessage,
} from "@workspace/integrations-openai-ai-server";
import { getAgentById } from "@workspace/agents";

// Voice mode replies are user-perceptible — we want them snappy. The same
// shape as /transcribe so the limits stay predictable across the app.
const PER_IP_LIMIT = 30;
const PER_IP_WINDOW_MS = 60_000;
const GLOBAL_MAX_CONCURRENT = 8;
// Trim the conversation we send to the model so spoken sessions don't
// balloon over time. Keep the system prompt + the most recent N turns.
const MAX_HISTORY_MESSAGES = 20;

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
    req.log.warn({ key, count: bucket.count }, "Chat rate limit exceeded");
    res
      .status(429)
      .set("Retry-After", String(retryAfterSec))
      .json({ error: `Rate limit exceeded. Try again in ${retryAfterSec}s.` });
    return;
  }

  if (inFlight >= GLOBAL_MAX_CONCURRENT) {
    req.log.warn({ inFlight }, "Chat concurrency cap reached");
    res
      .status(429)
      .set("Retry-After", "1")
      .json({ error: "Server is busy. Please retry shortly." });
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

const router: IRouter = Router();

router.post(
  "/chat/completions",
  rateLimit,
  async (req, res): Promise<void> => {
    const startedAt = Date.now();
    try {
      const parsed = ChatCompletionBody.safeParse(req.body);
      if (!parsed.success) {
        req.log.warn(
          { issues: parsed.error.issues },
          "Invalid chat completion body",
        );
        res
          .status(400)
          .json({ error: `Invalid request: ${parsed.error.message}` });
        return;
      }

      const { messages, language, agentId } = parsed.data;
      const last = messages[messages.length - 1];
      if (last.role !== "user") {
        res
          .status(400)
          .json({ error: "The last message must be from the user." });
        return;
      }

      const agent = agentId ? getAgentById(agentId) : undefined;
      if (agentId && !agent) {
        req.log.warn({ agentId }, "Unknown chat agent requested");
        res.status(400).json({ error: `Unknown agentId: ${agentId}` });
        return;
      }

      // Keep the conversation bounded. Always preserve a leading `system`
      // message if present, otherwise just the most recent N turns.
      const systemHead =
        messages[0].role === "system" ? [messages[0]] : [];
      const tail = systemHead.length > 0 ? messages.slice(1) : messages;
      const trimmedTail = tail.slice(-MAX_HISTORY_MESSAGES);
      const trimmed: ChatMessage[] = [...systemHead, ...trimmedTail];

      const reply = await chatCompletion(trimmed, {
        language: language || undefined,
        systemPrompt: agent?.systemPrompt,
      });
      const durationMs = Date.now() - startedAt;

      req.log.info(
        {
          durationMs,
          historyLength: messages.length,
          trimmedLength: trimmed.length,
          language: language || undefined,
          agentId: agent?.id,
          replyLength: reply.length,
        },
        "Chat completion succeeded",
      );

      res.json(ChatCompletionResponse.parse({ reply, durationMs }));
    } catch (err) {
      req.log.error({ err }, "Chat completion failed");
      res
        .status(500)
        .json({ error: "Chat completion failed. Please try again." });
    }
  },
);

export default router;
