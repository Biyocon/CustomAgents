import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, ChevronDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  useComposerVoice,
  VoiceModeOverlay,
  DictateIndicator,
  VoiceModeButton,
  DictateButton,
} from '@/components/composer/voice';

export interface UniversalComposerProps {
  placeholder?: string;
  onSubmit?: (value: string, model: string) => void;
  models?: Array<{ value: string; label: string; description?: string }>;
  actions?: Array<{ icon: React.ReactNode; label: string; onClick: () => void }>;
  suggestions?: Array<{ icon: React.ReactNode; label: string }>;
  maxHeight?: number;
  /**
   * Optional. When voice mode (Stemmetilstand) is active, this is invoked with
   * the user's transcribed turn so the host can produce an assistant reply.
   * The returned text is read aloud through the browser's SpeechSynthesis API.
   * If not provided, a localised acknowledgement is spoken instead.
   */
  getVoiceReply?: (transcript: string) => string | Promise<string>;
  /** Locale for SpeechRecognition + SpeechSynthesis. Defaults to 'da-DK'. */
  speechLang?: string;
  /**
   * Optional preferred TTS voice URI (matches `SpeechSynthesisVoice.voiceURI`).
   * If omitted or unavailable, the browser picks a default voice for `speechLang`.
   */
  speechVoiceURI?: string | null;
}

export function UniversalComposer({
  placeholder = "Ask anything or type '/' for commands...",
  onSubmit,
  models = [
    { value: 'Instant', label: 'Instant' },
    { value: 'Thinking', label: 'Thinking' },
    { value: 'Deep Research', label: 'Deep Research' }
  ],
  actions = [],
  suggestions = [],
  maxHeight = 200,
  getVoiceReply,
  speechLang = 'da-DK',
  speechVoiceURI = null,
}: UniversalComposerProps) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedModel, setSelectedModel] = useState(models[0]?.label || 'Instant');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
  }, [maxHeight]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  const handleSubmit = useCallback((override?: string) => {
    const value = (override ?? input).trim();
    if (!value) return;
    onSubmit?.(value, selectedModel);
    if (override === undefined) {
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [input, onSubmit, selectedModel]);

  // ── Shared voice + dictate machinery ──────
  const handleSubmitRef = useRef<(override?: string) => void>(() => {});
  handleSubmitRef.current = handleSubmit;

  const onDictateFinal = useCallback((text: string) => {
    setInput(prev => {
      const trimmed = text.trim();
      if (!trimmed) return prev;
      if (prev.length === 0) {
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
      const needsSpace = !/\s$/.test(prev);
      return prev + (needsSpace ? ' ' : '') + trimmed;
    });
    requestAnimationFrame(adjustTextareaHeight);
  }, [adjustTextareaHeight]);

  const onVoiceFinal = useCallback((transcript: string) => {
    handleSubmitRef.current(transcript);
  }, []);

  const voice = useComposerVoice({
    onDictateFinal,
    onVoiceFinal,
    getVoiceReply,
    speechLang,
    speechVoiceURI,
  });

  return (
    <div className="w-full flex flex-col gap-6">
      <div
        className={cn(
          "bg-white rounded-[31px] border shadow-[var(--shadow-input)] transition-all duration-300 flex flex-col overflow-visible relative",
          isFocused ? "ring-2 ring-primary/30 border-primary/40 shadow-lg" : "border-border"
        )}
      >
        <VoiceModeOverlay
          active={voice.voiceMode}
          capture={voice.voiceCapture}
          error={voice.voiceError}
          speaking={voice.voiceSpeaking}
          lastReply={voice.voiceLastReply}
          onEnd={voice.endVoiceMode}
        />

        <div className="p-4 pb-2 relative">
          <DictateIndicator
            active={voice.dictateMode}
            capture={voice.dictateCapture}
            error={voice.dictateError}
            onDismissError={voice.clearDictateError}
            pillPositionClassName="top-1 right-4"
          />

          <textarea
            ref={textareaRef}
            value={input}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={placeholder}
            className="w-full resize-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground text-[16px] leading-relaxed min-h-[48px]"
            style={{ maxHeight: `${maxHeight}px` }}
            rows={1}
            data-testid="input-composer"
          />
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-2 relative z-10">
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
              data-testid="button-attach"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {actions.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className="p-2 text-muted-foreground hover:bg-muted hover:text-foreground rounded-full transition-colors"
                data-testid={`button-action-${i}`}
                title={action.label}
              >
                {action.icon}
              </button>
            ))}

            {models.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                  className="flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#e8e8e8] px-3 py-1.5 rounded-full text-sm font-medium text-foreground transition-colors border border-transparent"
                  data-testid="button-model-select"
                >
                  <span>{selectedModel}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {isModelDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-[var(--shadow-dropdown)] overflow-hidden z-50 py-1"
                    >
                      {models.map(model => (
                        <button
                          key={model.value}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            setSelectedModel(model.label);
                            setIsModelDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm font-medium transition-colors hover:bg-muted",
                            selectedModel === model.label ? "text-primary bg-primary/5" : "text-foreground"
                          )}
                          data-testid={`model-option-${model.value.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {model.label}
                          {model.description && (
                            <span className="block text-xs text-muted-foreground mt-0.5 font-normal">
                              {model.description}
                            </span>
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <TooltipProvider delayDuration={150}>
              <VoiceModeButton active={voice.voiceMode} onToggle={voice.toggleVoiceMode} />
              <DictateButton active={voice.dictateMode} onToggle={voice.toggleDictateMode} />
            </TooltipProvider>

            <button
              onClick={() => handleSubmit()}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ml-2",
                input.trim() ? "bg-primary text-white hover:bg-[#003a3d] shadow-md hover:shadow-lg hover:-translate-y-[1px]" : "bg-[#f0f0f0] text-muted-foreground"
              )}
              data-testid="button-send"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-4 py-2 bg-[#f5f5f5] hover:bg-primary/5 hover:text-primary text-muted-foreground font-medium text-sm rounded-full transition-all duration-200 hover:-translate-y-[2px]"
              data-testid={`suggestion-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {s.icon}
              <span>{s.label}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
