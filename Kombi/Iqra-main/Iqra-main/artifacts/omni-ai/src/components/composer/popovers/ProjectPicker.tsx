import { useState, useMemo } from 'react';
import { Folder, Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockProjects } from '@/data/mockComposerData';
import type { ProjectMeta } from '@/types/composer';

interface ProjectPickerProps {
  selected?: ProjectMeta;
  onSelect: (project: ProjectMeta | undefined) => void;
  onClose: () => void;
}

export function ProjectPicker({ selected, onSelect, onClose }: ProjectPickerProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return mockProjects;
    const q = query.toLowerCase();
    return mockProjects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.workspace ?? '').toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="py-1 w-72">
      <div className="flex items-center justify-between px-4 pt-2 pb-1">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Add to project</p>
        {selected && (
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={() => { onSelect(undefined); }}
            className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            data-testid="project-clear"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-muted rounded-lg">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:text-muted-foreground"
            data-testid="project-search"
          />
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">No projects found</p>
        )}
        {filtered.map(project => {
          const active = selected?.id === project.id;
          return (
            <button
              key={project.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => { onSelect(project); onClose(); }}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted text-left',
                active && 'bg-primary/5'
              )}
              data-testid={`project-${project.id}`}
            >
              <Folder className={cn('w-4 h-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground leading-none truncate">{project.name}</p>
                {project.workspace && (
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{project.workspace}</p>
                )}
              </div>
              {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
