import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useSpeechCapture,
  speak,
  cancelSpeak,
  isSpeechCaptureSupported,
  type SpeechError,
  type SpeechBackend,
  type UseSpeechCaptureResult,
} from '@/hooks/useSpeechCapture';
import { useAvailableVoices, resolveVoice } from '@/lib/speechSettings';

const TRANSCRIPTION_BACKEND_STORAGE_KEY = 'omni-ai.transcriptionBackend';
const TRANSCRIPTION_LANGUAGE_STORAGE_KEY = 'omni-ai.transcriptionLanguage';

export interface UseComposerVoiceOptions {
  /**
   * Called with the user's transcribed turn while voice mode is active. The
   * transcript is also routed back through the regular submit pipeline.
   */
  onVoiceFinal: (transcript: string) => void;
  /**
   * Called with each completed dictation chunk so the host can append it into
   * the textarea (with whatever spacing / capitalisation rules it prefers).
   */
  onDictateFinal: (text: string) => void;
  /**
   * Optional. When voice mode is active, this is invoked with the user's
   * transcribed turn so the host can produce an assistant reply. The returned
   * text is read aloud through the browser's SpeechSynthesis API. If not
   * provided, a localised acknowledgement is spoken instead.
   */
  getVoiceReply?: (transcript: string) => string | Promise<string>;
  /** Locale for SpeechRecognition + SpeechSynthesis. Defaults to 'da-DK'. */
  speechLang?: string;
  /**
   * Optional preferred TTS voice URI (matches `SpeechSynthesisVoice.voiceURI`).
   * If omitted or unavailable, the browser picks a default voice for `speechLang`.
   */
  speechVoiceURI?: string | null;
  /**
   * Which transcription backend to use for the mic. When provided explicitly
   * by the host, the in-composer toggle is locked. When omitted, the user's
   * last choice is read from localStorage (defaulting to `'browser'`).
   */
  transcriptionBackend?: SpeechBackend;
  /**
   * BCP-47 locale code used for transcription (both browser SpeechRecognition
   * and the `language` field on POST /api/transcribe). When provided
   * explicitly by the host, the in-composer language picker is locked. When
   * omitted, the user's last choice is read from localStorage (defaulting to
   * `speechLang`, which itself defaults to `'da-DK'`).
   *
   * Kept separate from `speechLang` so the spoken-reply locale (TTS) can stay
   * stable while the user dictates in a different language.
   */
  transcriptionLanguage?: string;
}

export interface UseComposerVoiceResult {
  // ── State ──
  voiceMode: boolean;
  dictateMode: boolean;
  voiceError: SpeechError | null;
  dictateError: SpeechError | null;
  voiceSpeaking: boolean;
  voiceLastReply: string;
  voiceCapture: UseSpeechCaptureResult;
  dictateCapture: UseSpeechCaptureResult;

  // ── Toggles / actions ──
  toggleVoiceMode: () => void;
  toggleDictateMode: () => void;
  /** End voice mode (used by the overlay's Afslut button). */
  endVoiceMode: () => void;
  /** Dismiss the inline dictate error pill. */
  clearDictateError: () => void;

  // ── Transcription backend ──
  transcriptionBackend: SpeechBackend;
  setTranscriptionBackend: (next: SpeechBackend) => void;
  /** True when the host pinned the backend via prop, disabling the toggle. */
  transcriptionBackendLocked: boolean;

  // ── Transcription language ──
  /** BCP-47 code currently used for both dictate and voice mode mic capture. */
  transcriptionLanguage: string;
  setTranscriptionLanguage: (next: string) => void;
  /** True when the host pinned the language via prop, disabling the picker. */
  transcriptionLanguageLocked: boolean;
}

/**
 * Shared voice + dictate state for chat composers.
 *
 * Owns:
 *  - mutual exclusion between Stemmetilstand (voice mode) and Dikter (dictate)
 *  - error surfaces, separated by mode
 *  - the TTS reply pipeline (assistant reply → SpeechSynthesis)
 *  - persisted transcription backend preference
 *
 * Both `AdvancedPromptComposer` and `UniversalComposer` consume this hook so
 * they stay in lock-step. Tweaks to behaviour (e.g. swapping in a real
 * transcription backend) are now a one-place edit.
 */
export function useComposerVoice({
  onVoiceFinal: onVoiceFinalProp,
  onDictateFinal: onDictateFinalProp,
  getVoiceReply,
  speechLang = 'da-DK',
  speechVoiceURI = null,
  transcriptionBackend: transcriptionBackendProp,
  transcriptionLanguage: transcriptionLanguageProp,
}: UseComposerVoiceOptions): UseComposerVoiceResult {
  // `voiceMode` = continuous Wispr-Flow style voice mode (overlay).
  // `dictateMode` = inline dictation into the textarea.
  // The two are mutually exclusive — activating one deactivates the other.
  const [voiceMode, setVoiceMode] = useState(false);
  const [dictateMode, setDictateMode] = useState(false);

  // Persisted preference (so users can stick with server transcription on
  // Safari/Firefox where the Web Speech API is unavailable). The prop wins
  // when explicitly provided. When the user hasn't made an explicit choice
  // yet, we auto-fall back to the server backend on browsers that lack the
  // Web Speech API (Safari, Firefox) so the mic doesn't show "unsupported"
  // out of the box. Chrome/Edge still default to the browser backend.
  const [transcriptionBackendState, setTranscriptionBackendState] =
    useState<SpeechBackend>(() => {
      if (typeof window === 'undefined') return 'browser';
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(TRANSCRIPTION_BACKEND_STORAGE_KEY);
      } catch {
        // storage may be disabled (private mode, quota); ignore
      }
      if (saved === 'server' || saved === 'browser') return saved;
      if (
        !isSpeechCaptureSupported('browser') &&
        isSpeechCaptureSupported('server')
      ) {
        return 'server';
      }
      return 'browser';
    });
  const transcriptionBackend: SpeechBackend =
    transcriptionBackendProp ?? transcriptionBackendState;
  const transcriptionBackendLocked = transcriptionBackendProp !== undefined;

  const setTranscriptionBackend = useCallback((next: SpeechBackend) => {
    setTranscriptionBackendState(next);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(TRANSCRIPTION_BACKEND_STORAGE_KEY, next);
      } catch {
        // storage may be disabled (private mode, quota); ignore
      }
    }
  }, []);

  // Persisted transcription language. Falls back to the host-supplied
  // `speechLang` so users that haven't picked anything yet keep the existing
  // (Danish-by-default) behaviour. The prop wins when provided.
  const [transcriptionLanguageState, setTranscriptionLanguageState] =
    useState<string>(() => {
      if (typeof window === 'undefined') return speechLang;
      try {
        const saved = window.localStorage.getItem(TRANSCRIPTION_LANGUAGE_STORAGE_KEY);
        return saved && saved.trim() ? saved : speechLang;
      } catch {
        return speechLang;
      }
    });
  const transcriptionLanguage: string =
    transcriptionLanguageProp ?? transcriptionLanguageState;
  const transcriptionLanguageLocked = transcriptionLanguageProp !== undefined;

  const setTranscriptionLanguage = useCallback((next: string) => {
    setTranscriptionLanguageState(next);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(TRANSCRIPTION_LANGUAGE_STORAGE_KEY, next);
      } catch {
        // storage may be disabled (private mode, quota); ignore
      }
    }
  }, []);

  // Surfaced microphone / transcription errors, separated by mode so each
  // surface (overlay vs. textarea) can render its own message.
  const [voiceError, setVoiceError] = useState<SpeechError | null>(null);
  const [dictateError, setDictateError] = useState<SpeechError | null>(null);
  // True while the assistant's reply is being read aloud through TTS.
  const [voiceSpeaking, setVoiceSpeaking] = useState(false);
  // Last spoken assistant reply — shown in the overlay for transparency.
  const [voiceLastReply, setVoiceLastReply] = useState<string>('');

  const toggleVoiceMode = useCallback(() => {
    setVoiceMode(v => {
      const next = !v;
      // Always clear stale errors / state when transitioning either direction.
      setVoiceError(null);
      setVoiceLastReply('');
      if (next) {
        setDictateMode(false);
        setDictateError(null);
      } else {
        cancelSpeak();
        setVoiceSpeaking(false);
      }
      return next;
    });
  }, []);

  const toggleDictateMode = useCallback(() => {
    setDictateMode(v => {
      const next = !v;
      // Always clear stale errors when transitioning either direction so the
      // pill / alert disappears when the user opts out.
      setDictateError(null);
      if (next) {
        setVoiceMode(false);
        setVoiceError(null);
        cancelSpeak();
        setVoiceSpeaking(false);
      }
      return next;
    });
  }, []);

  const endVoiceMode = useCallback(() => {
    setVoiceMode(false);
    cancelSpeak();
    setVoiceSpeaking(false);
  }, []);

  const clearDictateError = useCallback(() => {
    setDictateError(null);
  }, []);

  // ── Refs to avoid stale closures in callbacks given to the hook ──
  const onDictateFinalRef = useRef(onDictateFinalProp);
  onDictateFinalRef.current = onDictateFinalProp;
  const onVoiceFinalRef = useRef(onVoiceFinalProp);
  onVoiceFinalRef.current = onVoiceFinalProp;
  const getVoiceReplyRef = useRef(getVoiceReply);
  getVoiceReplyRef.current = getVoiceReply;
  const voiceModeRef = useRef(voiceMode);
  voiceModeRef.current = voiceMode;
  const voiceSpeakingRef = useRef(voiceSpeaking);
  voiceSpeakingRef.current = voiceSpeaking;

  // Cache available voices in a ref so the voice callback doesn't need to
  // re-render whenever the voice list grows (browsers populate it lazily).
  const availableVoices = useAvailableVoices();
  const availableVoicesRef = useRef(availableVoices);
  availableVoicesRef.current = availableVoices;

  const onDictateFinal = useCallback((text: string) => {
    onDictateFinalRef.current(text);
  }, []);

  const onVoiceFinal = useCallback((text: string) => {
    const transcript = text.trim();
    if (!transcript) return;
    // Drop transcripts captured while we're speaking — avoids the assistant
    // hearing its own TTS output on speaker setups without echo cancellation.
    if (voiceSpeakingRef.current) return;
    // 1. Send the transcript through the host's submit pipeline.
    onVoiceFinalRef.current(transcript);
    // 2. Produce + speak an assistant reply.
    const replyPromise = (() => {
      try {
        const r = getVoiceReplyRef.current?.(transcript);
        return Promise.resolve(r ?? `Modtaget: ${transcript}`);
      } catch (e) {
        return Promise.resolve(`Beklager, jeg kunne ikke behandle det. ${(e as Error)?.message ?? ''}`.trim());
      }
    })();
    setVoiceSpeaking(true);
    replyPromise
      .then(reply => {
        const replyText = (reply ?? '').toString();
        setVoiceLastReply(replyText);
        const voice = resolveVoice(availableVoicesRef.current, speechVoiceURI);
        return speak(replyText, { lang: speechLang, voice });
      })
      .finally(() => {
        // Only clear if voice mode is still active; otherwise toggle already cleaned up.
        if (voiceModeRef.current) setVoiceSpeaking(false);
      });
  }, [speechLang, speechVoiceURI]);

  // We surface errors *into* the overlay/indicator instead of auto-closing
  // the mode. That way the user actually reads the message (e.g. "tillad
  // mikrofonen") and can dismiss explicitly via the X / Afslut button.
  const onDictateError = useCallback((err: SpeechError) => {
    setDictateError(err);
  }, []);

  const onVoiceError = useCallback((err: SpeechError) => {
    setVoiceError(err);
    cancelSpeak();
    setVoiceSpeaking(false);
  }, []);

  // Two hook instances — only one is enabled at a time because the modes are
  // mutually exclusive (see toggleVoiceMode / toggleDictateMode).
  const dictateCapture = useSpeechCapture({
    enabled: dictateMode,
    backend: transcriptionBackend,
    lang: transcriptionLanguage,
    continuous: true,
    interimResults: true,
    onFinalTranscript: onDictateFinal,
    onError: onDictateError,
  });
  const voiceCapture = useSpeechCapture({
    enabled: voiceMode,
    backend: transcriptionBackend,
    lang: transcriptionLanguage,
    continuous: true,
    interimResults: true,
    onFinalTranscript: onVoiceFinal,
    onError: onVoiceError,
  });

  // Cancel any in-flight TTS on unmount.
  useEffect(() => () => cancelSpeak(), []);

  return {
    voiceMode,
    dictateMode,
    voiceError,
    dictateError,
    voiceSpeaking,
    voiceLastReply,
    voiceCapture,
    dictateCapture,
    toggleVoiceMode,
    toggleDictateMode,
    endVoiceMode,
    clearDictateError,
    transcriptionBackend,
    setTranscriptionBackend,
    transcriptionBackendLocked,
    transcriptionLanguage,
    setTranscriptionLanguage,
    transcriptionLanguageLocked,
  };
}
