import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechErrorCode =
  | 'unsupported'
  | 'permission-denied'
  | 'no-device'
  | 'audio-capture'
  | 'network'
  | 'no-speech'
  | 'aborted'
  | 'unknown';

export interface SpeechError {
  code: SpeechErrorCode;
  message: string;
}

export type SpeechBackend = 'browser' | 'server';

export interface UseSpeechCaptureOptions {
  enabled: boolean;
  /** Which transcription backend to use. Defaults to 'browser' (Web Speech API). */
  backend?: SpeechBackend;
  /** Endpoint for the 'server' backend. Defaults to '/api/transcribe'. */
  serverEndpoint?: string;
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onFinalTranscript?: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
  onError?: (err: SpeechError) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface UseSpeechCaptureResult {
  supported: boolean;
  listening: boolean;
  amplitude: number;
  interimTranscript: string;
  error: SpeechError | null;
  clearError: () => void;
  /**
   * Number of transcription requests currently waiting on the server. Always
   * `0` for the browser backend (Web Speech API resolves locally and has no
   * pending phase to surface).
   */
  pendingRequests: number;
  /** Convenience: `pendingRequests > 0`. Drives the "Transkriberer…" UI. */
  transcribing: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function hasMediaRecorder(): boolean {
  return typeof window !== 'undefined' && typeof window.MediaRecorder !== 'undefined';
}

function hasUserMedia(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function'
  );
}

export function isSpeechCaptureSupported(backend: SpeechBackend = 'browser'): boolean {
  if (typeof window === 'undefined') return false;
  if (!hasUserMedia()) return false;
  if (backend === 'server') {
    return hasMediaRecorder();
  }
  return !!getSpeechRecognitionCtor();
}

function mapRecognitionError(code: string): SpeechError {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return { code: 'permission-denied', message: 'Adgang til mikrofonen blev nægtet. Tillad mikrofonen i din browser for at fortsætte.' };
    case 'audio-capture':
      return { code: 'no-device', message: 'Ingen mikrofon blev fundet. Tilslut en mikrofon og prøv igen.' };
    case 'network':
      return { code: 'network', message: 'Netværksfejl under transskription. Tjek din internetforbindelse.' };
    case 'no-speech':
      return { code: 'no-speech', message: 'Jeg kunne ikke høre dig. Prøv at tale lidt højere.' };
    case 'aborted':
      return { code: 'aborted', message: 'Optagelsen blev afbrudt.' };
    default:
      return { code: 'unknown', message: `Talegenkendelsesfejl: ${code}` };
  }
}

function mapGetUserMediaError(err: unknown): SpeechError {
  const e = err as { name?: string; message?: string };
  const name = e?.name ?? '';
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return { code: 'permission-denied', message: 'Adgang til mikrofonen blev nægtet. Tillad mikrofonen i din browser for at fortsætte.' };
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return { code: 'no-device', message: 'Ingen mikrofon blev fundet. Tilslut en mikrofon og prøv igen.' };
  }
  if (name === 'NotReadableError') {
    return { code: 'audio-capture', message: 'Kunne ikke læse fra mikrofonen. Et andet program bruger den måske.' };
  }
  return { code: 'unknown', message: e?.message || 'Ukendt mikrofonfejl.' };
}

// ──────────────────────────────────────────────────────────
// Browser backend (Web Speech API)
// ──────────────────────────────────────────────────────────
function useBrowserSpeechCapture(opts: UseSpeechCaptureOptions): UseSpeechCaptureResult {
  const {
    enabled,
    lang = 'da-DK',
    continuous = true,
    interimResults = true,
    onFinalTranscript,
    onInterimTranscript,
    onError,
    onStart,
    onEnd,
  } = opts;

  const [supported] = useState<boolean>(() => isSpeechCaptureSupported('browser'));
  const [listening, setListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<SpeechError | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const stoppedManuallyRef = useRef(false);
  const restartTimerRef = useRef<number | null>(null);

  const onFinalRef = useRef(onFinalTranscript);
  const onInterimRef = useRef(onInterimTranscript);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  useEffect(() => { onFinalRef.current = onFinalTranscript; }, [onFinalTranscript]);
  useEffect(() => { onInterimRef.current = onInterimTranscript; }, [onInterimTranscript]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  const clearError = useCallback(() => setError(null), []);

  const teardown = useCallback(() => {
    stoppedManuallyRef.current = true;
    if (restartTimerRef.current != null) {
      window.clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.onresult = null; } catch { /* noop */ }
      try { recognitionRef.current.onerror = null; } catch { /* noop */ }
      try { recognitionRef.current.onend = null; } catch { /* noop */ }
      try { recognitionRef.current.onstart = null; } catch { /* noop */ }
      try { recognitionRef.current.abort(); } catch { /* noop */ }
      recognitionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch { /* noop */ }
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setListening(false);
    setAmplitude(0);
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    if (!enabled) {
      teardown();
      return;
    }
    if (!supported) {
      const err: SpeechError = {
        code: 'unsupported',
        message: 'Talegenkendelse understøttes ikke i denne browser. Brug en moderne Chromium-baseret browser (Chrome, Edge, Brave) — eller skift til server-transskription i indstillingerne.',
      };
      setError(err);
      onErrorRef.current?.(err);
      return;
    }

    let cancelled = false;
    stoppedManuallyRef.current = false;
    setError(null);

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx: typeof AudioContext =
          window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        analyserRef.current = analyser;

        const buffer = new Uint8Array(analyser.fftSize);
        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(buffer);
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) {
            const v = (buffer[i] - 128) / 128;
            sumSquares += v * v;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);
          const normalised = Math.min(1, rms * 3);
          setAmplitude(normalised);
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        const Ctor = getSpeechRecognitionCtor();
        if (!Ctor) throw new Error('SpeechRecognition disappeared');
        const recognition = new Ctor();
        recognition.lang = lang;
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          if (cancelled) return;
          setListening(true);
          onStartRef.current?.();
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          if (cancelled) return;
          let finalChunk = '';
          let interimChunk = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            const text = res[0]?.transcript ?? '';
            if (res.isFinal) finalChunk += text;
            else interimChunk += text;
          }
          if (finalChunk.trim()) {
            setInterimTranscript('');
            onFinalRef.current?.(finalChunk.trim());
          }
          if (interimChunk) {
            setInterimTranscript(interimChunk);
            onInterimRef.current?.(interimChunk);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (cancelled) return;
          const mapped = mapRecognitionError(event.error || 'unknown');
          if (mapped.code === 'no-speech' || mapped.code === 'aborted') {
            return;
          }
          stoppedManuallyRef.current = true;
          setError(mapped);
          onErrorRef.current?.(mapped);
        };

        recognition.onend = () => {
          if (cancelled) return;
          setListening(false);
          onEndRef.current?.();
          if (
            continuous &&
            !stoppedManuallyRef.current &&
            recognitionRef.current === recognition &&
            streamRef.current
          ) {
            restartTimerRef.current = window.setTimeout(() => {
              restartTimerRef.current = null;
              if (cancelled || stoppedManuallyRef.current) return;
              try {
                recognition.start();
              } catch {
                // already-started: ignore
              }
            }, 250);
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          void e;
        }
      } catch (e) {
        if (cancelled) return;
        const mapped = mapGetUserMediaError(e);
        setError(mapped);
        onErrorRef.current?.(mapped);
        teardown();
      }
    };

    start();

    return () => {
      cancelled = true;
      teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, supported, lang, continuous, interimResults, teardown]);

  return {
    supported,
    listening,
    amplitude,
    interimTranscript,
    error,
    clearError,
    // Browser backend resolves recognition locally — no server round-trip.
    pendingRequests: 0,
    transcribing: false,
  };
}

// Server backend: MediaRecorder + AnalyserNode VAD; uploads each utterance
// to /api/transcribe and emits results in capture order.

const SERVER_VAD_SILENCE_MS = 700;
const SERVER_VAD_MIN_UTTERANCE_MS = 350;
const SERVER_VAD_RMS_THRESHOLD = 0.04;
const SERVER_MAX_RECORDER_MS = 30_000;

function pickRecorderMimeType(): string | undefined {
  if (typeof window === 'undefined' || typeof window.MediaRecorder === 'undefined') {
    return undefined;
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4;codecs=mp4a.40.2',
    'audio/mp4',
    'audio/ogg;codecs=opus',
  ];
  for (const c of candidates) {
    try {
      if (window.MediaRecorder.isTypeSupported(c)) return c;
    } catch {
      // some Safari builds throw on unknown types
    }
  }
  return undefined;
}

function useServerSpeechCapture(opts: UseSpeechCaptureOptions): UseSpeechCaptureResult {
  const {
    enabled,
    lang = 'da-DK',
    serverEndpoint = '/api/transcribe',
    onFinalTranscript,
    onError,
    onStart,
    onEnd,
  } = opts;

  const [supported] = useState<boolean>(() => isSpeechCaptureSupported('server'));
  const [listening, setListening] = useState(false);
  const [amplitude, setAmplitude] = useState(0);
  const [error, setError] = useState<SpeechError | null>(null);
  // Number of /api/transcribe uploads currently in flight. Surfaced as
  // `transcribing` so the composer can show a "Transkriberer…" indicator
  // between the user finishing an utterance and the result coming back.
  const [pendingRequests, setPendingRequests] = useState(0);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const utteranceStartedAtRef = useRef<number | null>(null);
  const lastVoiceAtRef = useRef<number | null>(null);
  const recorderStartedAtRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const mimeTypeRef = useRef<string | undefined>(undefined);

  // Sequence uploads so out-of-order responses don't scramble dictation.
  const nextUtteranceIdRef = useRef(0);
  const nextEmitIndexRef = useRef(0);
  const pendingResultsRef = useRef<Map<number, string | null>>(new Map());
  const sessionStartedRef = useRef(false);
  // Bumped on teardown; uploads from a stale session are discarded.
  const sessionGenerationRef = useRef(0);

  const onFinalRef = useRef(onFinalTranscript);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  useEffect(() => { onFinalRef.current = onFinalTranscript; }, [onFinalTranscript]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);
  useEffect(() => { onStartRef.current = onStart; }, [onStart]);
  useEffect(() => { onEndRef.current = onEnd; }, [onEnd]);

  const clearError = useCallback(() => setError(null), []);

  const flushPending = useCallback(() => {
    const pending = pendingResultsRef.current;
    while (pending.has(nextEmitIndexRef.current)) {
      const text = pending.get(nextEmitIndexRef.current);
      pending.delete(nextEmitIndexRef.current);
      nextEmitIndexRef.current += 1;
      if (text && !cancelledRef.current) {
        onFinalRef.current?.(text);
      }
    }
  }, []);

  const recordResult = useCallback(
    (utteranceId: number, generation: number, text: string | null) => {
      if (generation !== sessionGenerationRef.current) return;
      pendingResultsRef.current.set(utteranceId, text);
      flushPending();
    },
    [flushPending],
  );

  const sendForTranscription = useCallback(
    async (blob: Blob, utteranceId: number, generation: number) => {
      if (!blob || blob.size === 0) {
        recordResult(utteranceId, generation, null);
        return;
      }
      const form = new FormData();
      const mt = blob.type || mimeTypeRef.current || '';
      let ext = 'webm';
      if (mt.includes('mp4') || mt.includes('m4a')) ext = 'mp4';
      else if (mt.includes('ogg')) ext = 'ogg';
      else if (mt.includes('wav')) ext = 'wav';
      form.append('audio', blob, `utterance.${ext}`);
      if (lang) form.append('language', lang);

      const stillCurrent = (): boolean =>
        !cancelledRef.current && generation === sessionGenerationRef.current;

      // Track in-flight requests so the composer can show "Transkriberer…".
      // The decrement happens in the `finally` so we cover network errors,
      // HTTP errors, JSON parse errors and the success path uniformly.
      setPendingRequests(n => n + 1);
      try {
        const res = await fetch(serverEndpoint, { method: 'POST', body: form });
        if (!res.ok) {
          let detail = '';
          try {
            const body = await res.json();
            if (body && typeof body.error === 'string') detail = body.error;
          } catch { /* noop */ }
          const err: SpeechError = {
            code: res.status >= 500 ? 'unknown' : 'network',
            message: detail || `Serverfejl under transskription (HTTP ${res.status}).`,
          };
          if (stillCurrent()) {
            setError(err);
            onErrorRef.current?.(err);
          }
          recordResult(utteranceId, generation, null);
          return;
        }
        const json = (await res.json()) as { text?: string };
        const text = (json.text ?? '').trim();
        recordResult(utteranceId, generation, text || null);
      } catch (e) {
        if (stillCurrent()) {
          const err: SpeechError = {
            code: 'network',
            message: e instanceof Error
              ? `Netværksfejl: ${e.message}`
              : 'Netværksfejl under transskription.',
          };
          setError(err);
          onErrorRef.current?.(err);
        }
        recordResult(utteranceId, generation, null);
      } finally {
        setPendingRequests(n => Math.max(0, n - 1));
      }
    },
    [lang, serverEndpoint, recordResult],
  );

  const startNewRecorder = useCallback((stream: MediaStream) => {
    if (cancelledRef.current) return;
    chunksRef.current = [];
    utteranceStartedAtRef.current = null;
    lastVoiceAtRef.current = null;
    const mimeType = mimeTypeRef.current;
    let recorder: MediaRecorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch (e) {
      const err: SpeechError = {
        code: 'audio-capture',
        message: e instanceof Error
          ? `Kunne ikke starte optageren: ${e.message}`
          : 'Kunne ikke starte mikrofon-optageren.',
      };
      setError(err);
      onErrorRef.current?.(err);
      return;
    }

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) {
        chunksRef.current.push(ev.data);
      }
    };

    recorder.onstop = () => {
      const startedAt = utteranceStartedAtRef.current;
      const lastAt = lastVoiceAtRef.current;
      const collected = chunksRef.current;
      chunksRef.current = [];
      utteranceStartedAtRef.current = null;
      lastVoiceAtRef.current = null;
      recorderStartedAtRef.current = null;

      const utteranceMs = startedAt != null && lastAt != null ? lastAt - startedAt : 0;
      if (collected.length > 0 && utteranceMs >= SERVER_VAD_MIN_UTTERANCE_MS) {
        const utteranceId = nextUtteranceIdRef.current++;
        const generation = sessionGenerationRef.current;
        const blob = new Blob(collected, {
          type: mimeTypeRef.current ?? collected[0].type ?? 'audio/webm',
        });
        void sendForTranscription(blob, utteranceId, generation);
      }

      if (!cancelledRef.current && streamRef.current) {
        startNewRecorder(streamRef.current);
      }
    };

    try {
      recorder.start();
      recorderRef.current = recorder;
      recorderStartedAtRef.current = performance.now();
      if (!cancelledRef.current) {
        setListening(true);
        // onStart fires once per session, not per recorder rotation.
        if (!sessionStartedRef.current) {
          sessionStartedRef.current = true;
          onStartRef.current?.();
        }
      }
    } catch (e) {
      const err: SpeechError = {
        code: 'audio-capture',
        message: e instanceof Error
          ? `Kunne ikke starte optageren: ${e.message}`
          : 'Kunne ikke starte mikrofon-optageren.',
      };
      setError(err);
      onErrorRef.current?.(err);
    }
  }, [sendForTranscription]);

  const teardown = useCallback(() => {
    cancelledRef.current = true;
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (recorderRef.current) {
      try {
        recorderRef.current.ondataavailable = null;
        recorderRef.current.onstop = null;
        if (recorderRef.current.state !== 'inactive') recorderRef.current.stop();
      } catch { /* noop */ }
      recorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch { /* noop */ }
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    chunksRef.current = [];
    utteranceStartedAtRef.current = null;
    lastVoiceAtRef.current = null;
    recorderStartedAtRef.current = null;
    pendingResultsRef.current.clear();
    nextUtteranceIdRef.current = 0;
    nextEmitIndexRef.current = 0;
    sessionGenerationRef.current += 1;
    setListening(false);
    setAmplitude(0);
    // Any stale in-flight uploads are now ignored (their `generation` no
    // longer matches), so it's safe to drop the visible counter to zero.
    setPendingRequests(0);
    if (sessionStartedRef.current) {
      sessionStartedRef.current = false;
      onEndRef.current?.();
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      teardown();
      return;
    }
    if (!supported) {
      const err: SpeechError = {
        code: 'unsupported',
        message: 'Server-transskription kræver MediaRecorder + mikrofonadgang og understøttes ikke i denne browser.',
      };
      setError(err);
      onErrorRef.current?.(err);
      return;
    }

    cancelledRef.current = false;
    setError(null);
    mimeTypeRef.current = pickRecorderMimeType();

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelledRef.current) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        const AudioCtx: typeof AudioContext =
          window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.6;
        source.connect(analyser);
        analyserRef.current = analyser;

        const buffer = new Uint8Array(analyser.fftSize);
        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(buffer);
          let sumSquares = 0;
          for (let i = 0; i < buffer.length; i++) {
            const v = (buffer[i] - 128) / 128;
            sumSquares += v * v;
          }
          const rms = Math.sqrt(sumSquares / buffer.length);
          const normalised = Math.min(1, rms * 3);
          setAmplitude(normalised);

          const now = performance.now();
          if (rms >= SERVER_VAD_RMS_THRESHOLD) {
            if (utteranceStartedAtRef.current == null) {
              utteranceStartedAtRef.current = now;
            }
            lastVoiceAtRef.current = now;
          }

          const recorderActive = recorderRef.current?.state === 'recording';
          const silenceTooLong =
            lastVoiceAtRef.current != null &&
            now - lastVoiceAtRef.current >= SERVER_VAD_SILENCE_MS;
          const recorderTooLong =
            recorderStartedAtRef.current != null &&
            now - recorderStartedAtRef.current >= SERVER_MAX_RECORDER_MS;

          if (recorderActive && (silenceTooLong || recorderTooLong)) {
            try {
              recorderRef.current?.stop();
            } catch { /* noop */ }
          }

          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        startNewRecorder(stream);
      } catch (e) {
        if (cancelledRef.current) return;
        const mapped = mapGetUserMediaError(e);
        setError(mapped);
        onErrorRef.current?.(mapped);
        teardown();
      }
    };

    start();

    return () => {
      teardown();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, supported, teardown, startNewRecorder]);

  return {
    supported,
    listening,
    amplitude,
    interimTranscript: '',
    error,
    clearError,
    pendingRequests,
    transcribing: pendingRequests > 0,
  };
}

// Both inner hooks are always called (rules of hooks); the inactive one is
// disabled via `enabled: false` so it claims no microphone or recogniser.
export function useSpeechCapture(opts: UseSpeechCaptureOptions): UseSpeechCaptureResult {
  const backend: SpeechBackend = opts.backend ?? 'browser';
  const browserResult = useBrowserSpeechCapture({
    ...opts,
    enabled: opts.enabled && backend === 'browser',
  });
  const serverResult = useServerSpeechCapture({
    ...opts,
    enabled: opts.enabled && backend === 'server',
  });
  return backend === 'server' ? serverResult : browserResult;
}

/**
 * Speak a piece of text via the browser's SpeechSynthesis API.
 * Returns a Promise that resolves once playback ends (or immediately if unsupported).
 */
export function speak(
  text: string,
  opts: { lang?: string; rate?: number; pitch?: number; voice?: SpeechSynthesisVoice | null } = {},
): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) {
    return Promise.resolve();
  }
  return new Promise(resolve => {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = opts.lang ?? 'da-DK';
      utter.rate = opts.rate ?? 1;
      utter.pitch = opts.pitch ?? 1;
      if (opts.voice) utter.voice = opts.voice;
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      synth.speak(utter);
    } catch {
      resolve();
    }
  });
}

export function cancelSpeak(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try { window.speechSynthesis.cancel(); } catch { /* noop */ }
}
