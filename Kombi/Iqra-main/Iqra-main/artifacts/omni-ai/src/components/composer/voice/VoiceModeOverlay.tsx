import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpeechError, UseSpeechCaptureResult } from '@/hooks/useSpeechCapture';

export interface VoiceModeOverlayProps {
  /** Whether the overlay is currently visible. */
  active: boolean;
  /** Mic capture result, used for amplitude + interim transcript. */
  capture: UseSpeechCaptureResult;
  /** Last surfaced microphone / transcription error. */
  error: SpeechError | null;
  /** True while the assistant's reply is being read aloud through TTS. */
  speaking: boolean;
  /** The most recent assistant reply that was spoken aloud. */
  lastReply: string;
  /** Called when the user clicks the Afslut (end) button. */
  onEnd: () => void;
}

/**
 * Wispr-Flow style overlay that floats above the composer while
 * Stemmetilstand is active. Shows a live amplitude waveform, status text,
 * the current transcript / spoken reply / error, and an Afslut button.
 *
 * Shared between `AdvancedPromptComposer` and `UniversalComposer` so the
 * two stay in lock-step.
 */
export function VoiceModeOverlay({
  active,
  capture,
  error,
  speaking,
  lastReply,
  onEnd,
}: VoiceModeOverlayProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="voice-mode-overlay"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 right-0 bottom-full mb-3 z-30 rounded-3xl bg-gradient-to-b from-primary to-[#003a3d] text-white shadow-2xl ring-1 ring-black/10 px-8 py-6"
          data-testid="overlay-voice-mode"
          role="dialog"
          aria-label="Stemmetilstand"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {capture.transcribing && !error && !speaking ? (
                // While the server is processing speech we swap the pulsing
                // dot for a spinner so the user can see something is in
                // flight even though the mic is momentarily idle.
                <Loader2
                  className="h-3 w-3 animate-spin text-sky-200"
                  data-testid="voice-mode-status-spinner"
                />
              ) : (
                <span className={cn(
                  'relative flex h-2 w-2',
                  error && 'opacity-60',
                )}>
                  <span className={cn(
                    'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                    error ? 'bg-rose-300' : speaking ? 'bg-amber-300' : 'bg-emerald-300',
                  )} />
                  <span className={cn(
                    'relative inline-flex rounded-full h-2 w-2',
                    error ? 'bg-rose-300' : speaking ? 'bg-amber-300' : 'bg-emerald-300',
                  )} />
                </span>
              )}
              <span
                className="text-xs font-semibold uppercase tracking-wider text-white/80"
                data-testid="voice-mode-status"
              >
                {error
                  ? 'Fejl'
                  : speaking
                    ? 'Svarer…'
                    : capture.transcribing
                      ? 'Transkriberer…'
                      : capture.listening
                        ? 'Lytter…'
                        : 'Klargør mikrofon…'}
              </span>
            </div>
            <span className="text-[11px] font-medium text-white/60">Stemmetilstand</span>
          </div>

          {/* Live amplitude waveform — bars react to mic RMS in real time. */}
          <div
            className="flex items-end justify-center gap-[5px] h-20 mb-5"
            aria-hidden
            data-testid="voice-mode-waveform"
          >
            {Array.from({ length: 32 }).map((_, i) => {
              // Each bar reads a phase-shifted slice of the live amplitude so the
              // waveform looks like a moving signal rather than a single block.
              const phase = Math.sin((Date.now() / 180) + i * 0.4);
              const dynamic = error ? 0 : capture.amplitude * (0.6 + Math.abs(phase) * 0.4);
              const baseline = 0.08 + (i % 5) * 0.02;
              const heightPct = Math.min(1, baseline + dynamic) * 100;
              return (
                <div
                  key={i}
                  className={cn(
                    'w-[4px] rounded-full transition-[height] duration-75 ease-out',
                    error ? 'bg-white/30' : 'bg-white/85',
                  )}
                  style={{ height: `${heightPct}%`, minHeight: '6px' }}
                />
              );
            })}
          </div>

          {/* Live transcript / assistant reply / error message */}
          <div className="min-h-[36px] mb-3 text-center" data-testid="voice-mode-transcript">
            {error ? (
              <p className="text-sm text-rose-100 inline-flex items-center gap-2 justify-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error.message}</span>
              </p>
            ) : speaking && lastReply ? (
              <p className="text-sm text-white/90 italic">"{lastReply}"</p>
            ) : capture.transcribing ? (
              <p
                className="text-sm text-white/80 inline-flex items-center gap-2 justify-center"
                data-testid="voice-mode-transcribing"
              >
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Transkriberer dit svar…</span>
              </p>
            ) : capture.interimTranscript ? (
              <p className="text-sm text-white/90">{capture.interimTranscript}</p>
            ) : (
              <p className="text-sm text-white/60">Tal frit — jeg lytter og svarer.</p>
            )}
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onEnd}
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-white/15 hover:bg-white/25 px-4 py-1.5 text-xs font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              data-testid="button-end-voice-mode"
            >
              <X className="w-3.5 h-3.5" />
              Afslut
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
