import { motion } from 'framer-motion';
import { Mic, AudioLines, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SpeechBackend } from '@/hooks/useSpeechCapture';

// ──────────────────────────────────────────────────────────
// Stemmetilstand (Voice mode / Wispr Flow) button
// ──────────────────────────────────────────────────────────

export interface VoiceModeButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function VoiceModeButton({ active, onToggle }: VoiceModeButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Brug Stemmetilstand"
          aria-pressed={active}
          className={cn(
            'relative flex items-center justify-center w-9 h-9 rounded-full transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            active
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
          data-testid="button-voice-mode"
        >
          <Mic className="w-[18px] h-[18px]" />
          {active && (
            <motion.span
              layoutId="voice-mode-active-ring"
              className="absolute inset-0 rounded-full ring-2 ring-primary/40"
            />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8} className="bg-foreground text-background">
        Brug Stemmetilstand
        <TooltipArrow className="fill-foreground" width={10} height={5} />
      </TooltipContent>
    </Tooltip>
  );
}

// ──────────────────────────────────────────────────────────
// Dikter (Dictate) button
// ──────────────────────────────────────────────────────────

export interface DictateButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function DictateButton({ active, onToggle }: DictateButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onToggle}
          aria-label="Dikter"
          aria-pressed={active}
          className={cn(
            'relative flex items-center justify-center w-9 h-9 rounded-full transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            active
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted',
          )}
          data-testid="button-dictate"
        >
          {active ? (
            <div className="flex items-center gap-[3px] h-4">
              <motion.div animate={{ height: [6, 12, 6] }} transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }} className="w-[2px] bg-primary rounded-full" />
              <motion.div animate={{ height: [10, 16, 10] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.15, ease: 'easeInOut' }} className="w-[2px] bg-primary rounded-full" />
              <motion.div animate={{ height: [8, 14, 8] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.3, ease: 'easeInOut' }} className="w-[2px] bg-primary rounded-full" />
              <motion.div animate={{ height: [5, 10, 5] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.45, ease: 'easeInOut' }} className="w-[2px] bg-primary rounded-full" />
            </div>
          ) : (
            <AudioLines className="w-[18px] h-[18px]" />
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8} className="bg-foreground text-background">
        Dikter
        <TooltipArrow className="fill-foreground" width={10} height={5} />
      </TooltipContent>
    </Tooltip>
  );
}

// ──────────────────────────────────────────────────────────
// Transcription backend toggle (Browser ↔ Server)
// ──────────────────────────────────────────────────────────

export interface TranscriptionBackendToggleProps {
  backend: SpeechBackend;
  onChange: (next: SpeechBackend) => void;
  /** When true the toggle is rendered disabled (host pinned the backend). */
  locked?: boolean;
}

export function TranscriptionBackendToggle({
  backend,
  onChange,
  locked = false,
}: TranscriptionBackendToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onChange(backend === 'browser' ? 'server' : 'browser')}
          disabled={locked}
          aria-label={`Transskription: ${backend === 'server' ? 'Server (OpenAI Whisper)' : 'Browser (Web Speech)'}`}
          aria-pressed={backend === 'server'}
          className={cn(
            'flex items-center justify-center h-7 px-2 rounded-full border text-[10px] font-semibold uppercase tracking-wider transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
            backend === 'server'
              ? 'bg-primary/10 text-primary border-primary/30'
              : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted',
            locked && 'opacity-60 cursor-not-allowed',
          )}
          data-testid="button-transcription-backend"
        >
          {backend === 'server' ? 'Server' : 'Browser'}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8} className="bg-foreground text-background">
        {backend === 'server'
          ? 'Transskription via OpenAI Whisper (server). Skift til browser-genkendelse.'
          : 'Transskription via browserens Web Speech API. Skift til server (OpenAI Whisper) for Safari/Firefox.'}
        <TooltipArrow className="fill-foreground" width={10} height={5} />
      </TooltipContent>
    </Tooltip>
  );
}

// ──────────────────────────────────────────────────────────
// Transcription language picker
// ──────────────────────────────────────────────────────────

export interface TranscriptionLanguageOption {
  /** BCP-47 locale code, e.g. "da-DK", "en-US". */
  code: string;
  /** User-facing label shown in the dropdown, e.g. "Dansk". */
  label: string;
  /** Short 2-letter pill label, e.g. "DA". Defaults to first 2 chars of code. */
  short?: string;
}

/**
 * Default offering — kept small on purpose. The picker is meant as a quick
 * switch, not an exhaustive locale browser. Add languages here as needed.
 */
export const DEFAULT_TRANSCRIPTION_LANGUAGES: TranscriptionLanguageOption[] = [
  { code: 'da-DK', label: 'Dansk',     short: 'DA' },
  { code: 'en-US', label: 'English',   short: 'EN' },
  { code: 'de-DE', label: 'Deutsch',   short: 'DE' },
  { code: 'sv-SE', label: 'Svenska',   short: 'SV' },
  { code: 'nb-NO', label: 'Norsk',     short: 'NO' },
  { code: 'es-ES', label: 'Español',   short: 'ES' },
];

export interface TranscriptionLanguagePickerProps {
  /** Currently active BCP-47 code. */
  language: string;
  onChange: (next: string) => void;
  /** Override the default 4–6 language list. */
  options?: TranscriptionLanguageOption[];
  /**
   * When true the trigger renders disabled (host pinned the language). The
   * pill stays visible so users still see which language is active, mirroring
   * how `TranscriptionBackendToggle` behaves when `locked`.
   */
  locked?: boolean;
}

export function TranscriptionLanguagePicker({
  language,
  onChange,
  options = DEFAULT_TRANSCRIPTION_LANGUAGES,
  locked = false,
}: TranscriptionLanguagePickerProps) {
  const active = options.find(o => o.code === language);
  const shortLabel =
    active?.short ?? (active ? active.label.slice(0, 2).toUpperCase() : language.slice(0, 2).toUpperCase());
  const fullLabel = active?.label ?? language;

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild disabled={locked}>
            <button
              type="button"
              disabled={locked}
              aria-label={`Transskriptionssprog: ${fullLabel}`}
              className={cn(
                'flex items-center gap-1 h-7 pl-2 pr-1.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
                'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted',
                locked && 'opacity-60 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground',
              )}
              data-testid="button-transcription-language"
            >
              <span>{shortLabel}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={8} className="bg-foreground text-background">
          Sprog for transskription: {fullLabel}
          <TooltipArrow className="fill-foreground" width={10} height={5} />
        </TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end" sideOffset={6} className="min-w-[10rem]">
        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">
          Transskriptionssprog
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map(opt => {
          const selected = opt.code === language;
          return (
            <DropdownMenuItem
              key={opt.code}
              onSelect={() => onChange(opt.code)}
              data-testid={`option-transcription-language-${opt.code}`}
              className="flex items-center justify-between gap-2"
            >
              <span className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-6">
                  {opt.short ?? opt.label.slice(0, 2).toUpperCase()}
                </span>
                <span>{opt.label}</span>
              </span>
              {selected && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
