import { Feather, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockStyles } from '@/data/mockComposerData';
import type { StyleMeta } from '@/types/composer';

interface StylePickerProps {
  selected?: StyleMeta;
  onSelect: (style: StyleMeta) => void;
  onClose: () => void;
  onCreateAndEdit?: () => void;
}

export function StylePicker({ selected, onSelect, onClose, onCreateAndEdit }: StylePickerProps) {
  const activeId = selected?.id ?? 'normal';

  return (
    <div className="py-1 w-64">
      <div className="px-4 pt-2 pb-1 flex items-center gap-2">
        <Feather className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Use style</p>
      </div>

      <div className="py-1">
        {mockStyles.map(style => {
          const active = activeId === style.id;
          return (
            <button
              key={style.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onSelect(style); onClose(); }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left',
                active && 'bg-primary/5'
              )}
              data-testid={`style-${style.id}`}
            >
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium leading-none', active ? 'text-primary' : 'text-foreground')}>{style.label}</p>
                {style.description && (
                  <p className="text-[11px] text-muted-foreground mt-0.5">{style.description}</p>
                )}
              </div>
              {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>

      <div className="border-t border-border/50">
        <button
          onMouseDown={e => e.preventDefault()}
          onClick={() => { onCreateAndEdit?.(); onClose(); }}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          data-testid="style-create-edit"
        >
          <Plus className="w-3.5 h-3.5" />
          Create &amp; edit styles
        </button>
      </div>
    </div>
  );
}
