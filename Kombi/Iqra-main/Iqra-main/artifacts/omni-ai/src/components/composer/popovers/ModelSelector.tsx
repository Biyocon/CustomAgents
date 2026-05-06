import { useState } from 'react';
import { Check, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockModels, mockMoreModels } from '@/data/mockComposerData';
import type { ModelMeta } from '@/types/composer';

interface ModelSelectorProps {
  selected: ModelMeta;
  adaptiveThinkingEnabled: boolean;
  onSelectModel: (model: ModelMeta) => void;
  onToggleAdaptiveThinking: () => void;
  onClose: () => void;
}

export function ModelSelector({
  selected,
  adaptiveThinkingEnabled,
  onSelectModel,
  onToggleAdaptiveThinking,
  onClose,
}: ModelSelectorProps) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="py-1 w-72">
      <div className="px-4 pt-2 pb-1 flex items-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Model</p>
      </div>

      {!showMore && (
        <>
          <div className="py-1">
            {mockModels.map(model => {
              const active = selected.id === model.id;
              return (
                <button
                  key={model.id}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { onSelectModel(model); onClose(); }}
                  className={cn(
                    'w-full flex items-start gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left',
                    active && 'bg-primary/5'
                  )}
                  data-testid={`model-${model.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={cn('font-medium leading-none', active ? 'text-primary' : 'text-foreground')}>{model.label}</p>
                    {model.description && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{model.description}</p>
                    )}
                  </div>
                  {active && <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="border-t border-border/50 my-1" />

          {/* Adaptive thinking toggle */}
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={onToggleAdaptiveThinking}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left"
            data-testid="adaptive-thinking-toggle"
          >
            <div className="flex-1 min-w-0">
              <p className={cn('font-medium leading-none', adaptiveThinkingEnabled ? 'text-primary' : 'text-foreground')}>Adaptive thinking</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Thinks for more complex tasks</p>
            </div>
            <div className={cn('w-8 h-4 rounded-full transition-colors shrink-0 flex items-center', adaptiveThinkingEnabled ? 'bg-primary' : 'bg-muted-foreground/20')}>
              <div className={cn('w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5', adaptiveThinkingEnabled ? 'translate-x-4' : 'translate-x-0')} />
            </div>
          </button>

          {/* More models submenu */}
          <div className="border-t border-border/50 mt-1">
            <button
              onMouseDown={e => e.preventDefault()}
              onClick={() => setShowMore(true)}
              className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              data-testid="model-more"
            >
              <span>More models</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}

      {showMore && (
        <>
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => setShowMore(false)}
            className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
            data-testid="model-back"
          >
            <ChevronRight className="w-3 h-3 rotate-180" />
            Back
          </button>
          <div className="py-1">
            {mockMoreModels.map(model => {
              const active = selected.id === model.id;
              return (
                <button
                  key={model.id}
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { onSelectModel(model); onClose(); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left',
                    active && 'bg-primary/5'
                  )}
                  data-testid={`model-${model.id}`}
                >
                  <p className={cn('font-medium leading-none flex-1', active ? 'text-primary' : 'text-foreground')}>{model.label}</p>
                  {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
