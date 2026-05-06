import { Check, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockToolAccessModes } from '@/data/mockComposerData';
import type { ToolAccessMode } from '@/types/composer';

interface ToolAccessMenuProps {
  selected: ToolAccessMode;
  onSelect: (mode: ToolAccessMode) => void;
  onClose: () => void;
}

export function ToolAccessMenu({ selected, onSelect, onClose }: ToolAccessMenuProps) {
  return (
    <div className="py-1 w-72">
      <div className="px-4 pt-2 pb-1 flex items-center gap-2">
        <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Tool access</p>
      </div>
      <div className="py-1">
        {mockToolAccessModes.map(mode => {
          const active = selected === mode.id;
          return (
            <button
              key={mode.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onSelect(mode.id); onClose(); }}
              className={cn(
                'w-full flex items-start gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left',
                active && 'bg-primary/5'
              )}
              data-testid={`tool-access-${mode.id}`}
            >
              <div className="flex-1 min-w-0">
                <p className={cn('font-medium leading-none', active ? 'text-primary' : 'text-foreground')}>{mode.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{mode.description}</p>
              </div>
              {active && <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
