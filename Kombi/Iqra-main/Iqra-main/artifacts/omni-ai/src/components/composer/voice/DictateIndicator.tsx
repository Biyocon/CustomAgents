import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpeechError, UseSpeechCaptureResult } from '@/hooks/useSpeechCapture';

export interface DictateIndicatorProps {
  /** Whether dictate mode is currently active. */
  active: boolean;
  /** Mic capture result, used for the listening label + interim transcript. */
  capture: UseSpeechCaptureResult;
  /** Last surfaced microphone / transcription error. */
  error: SpeechError | null;
  /** Called when the user dismisses the inline error pill. */
  onDismissError: () => void;
  /** Tailwind class for positioning the pulsing pill (top-right corner). */
  pillPositionClassName?: string;
}

/**
 * The triple inline render used while Dikter is active:
 *  - the small "Dikterer…" pulsing pill, absolutely positioned in the
 *    composer's top-right corner;
 *  - the live interim transcript preview;
 *  - a dismissable error alert.
 *
 * Shared between `AdvancedPromptComposer` and `UniversalComposer` so the
 * two stay in lock-step.
 */
export function DictateIndicator({
  active,
  capture,
  error,
  onDismissError,
  pillPositionClassName = 'top-1 right-5',
}: DictateIndicatorProps) {
  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={cn(
              'absolute flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold pointer-events-none',
              pillPositionClassName,
            )}
            data-testid="indicator-dictating"
          >
            {capture.transcribing ? (
              <>
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                <span data-testid="indicator-dictating-label">Transkriberer…</span>
              </>
            ) : (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                <span data-testid="indicator-dictating-label">
                  {capture.listening ? 'Dikterer…' : 'Klargør mikrofon…'}
                </span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && capture.interimTranscript && !error && !capture.transcribing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[13px] text-muted-foreground italic pb-1 pointer-events-none"
            data-testid="dictate-interim-transcript"
          >
            {capture.interimTranscript}
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && capture.transcribing && !error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground italic pb-1 pointer-events-none"
            data-testid="dictate-transcribing-shimmer"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Transkriberer dit svar…</span>
          </motion.p>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="flex items-start gap-2 mb-2 text-[12px] text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5"
            data-testid="dictate-error"
            role="alert"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span className="leading-tight">{error.message}</span>
            <button
              type="button"
              onClick={onDismissError}
              className="ml-auto text-rose-500 hover:text-rose-700 shrink-0"
              aria-label="Luk fejlbesked"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
