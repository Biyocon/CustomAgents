import { useState, useMemo } from 'react';
import { Github, Search, Check, ChevronDown, FileText, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockGitHubSources } from '@/data/mockComposerData';
import type { ContextItem, GitHubRepo } from '@/types/composer';

interface GitHubSourcePickerProps {
  alreadySelectedIds: string[];
  onAddContext: (item: ContextItem) => void;
  onClose: () => void;
}

export function GitHubSourcePicker({ alreadySelectedIds, onAddContext, onClose }: GitHubSourcePickerProps) {
  const [query, setQuery] = useState('');
  const [expandedRepoId, setExpandedRepoId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return mockGitHubSources;
    const q = query.toLowerCase();
    return mockGitHubSources.filter(r =>
      r.fullName.toLowerCase().includes(q) ||
      (r.description ?? '').toLowerCase().includes(q)
    );
  }, [query]);

  const handleAddRepo = (repo: GitHubRepo) => {
    const id = `gh-repo-${repo.id}`;
    if (alreadySelectedIds.includes(id)) return;
    onAddContext({
      id,
      title: repo.fullName,
      sourceType: 'connector',
      connectorId: 'github',
      sourceName: 'GitHub',
      status: 'available',
      selected: true,
      description: repo.description,
    });
  };

  const handleAddPath = (repo: GitHubRepo, path: string) => {
    const id = `gh-path-${repo.id}-${path.replace(/[^a-zA-Z0-9]/g, '_')}`;
    if (alreadySelectedIds.includes(id)) return;
    onAddContext({
      id,
      title: `${repo.fullName} · ${path}`,
      sourceType: 'connector',
      connectorId: 'github',
      sourceName: 'GitHub',
      status: 'available',
      selected: true,
    });
  };

  return (
    <div className="py-1 w-80">
      <div className="px-4 pt-2 pb-1 flex items-center gap-2">
        <Github className="w-3.5 h-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Add from GitHub</p>
      </div>

      <div className="px-3 pb-2">
        <div className="flex items-center gap-2 px-2.5 py-1.5 bg-muted rounded-lg">
          <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search repositories…"
            className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:text-muted-foreground"
            data-testid="github-search"
          />
        </div>
      </div>

      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1">Recent repositories</p>

      <div className="max-h-72 overflow-y-auto">
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">No repositories found</p>
        )}
        {filtered.map(repo => {
          const isExpanded = expandedRepoId === repo.id;
          const repoSelectedId = `gh-repo-${repo.id}`;
          const repoAlreadyAdded = alreadySelectedIds.includes(repoSelectedId);
          return (
            <div key={repo.id} className="border-b border-border/30 last:border-0">
              <div className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted">
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => {
                    if (!repoAlreadyAdded) handleAddRepo(repo);
                    setExpandedRepoId(isExpanded ? null : repo.id);
                  }}
                  className="flex items-center gap-3 flex-1 min-w-0 text-left"
                  data-testid={`gh-repo-${repo.id}`}
                >
                  <Github className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground leading-none truncate">{repo.fullName}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <GitBranch className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{repo.defaultBranch}</span>
                    </div>
                  </div>
                  {repoAlreadyAdded && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
                </button>
                <button
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => setExpandedRepoId(isExpanded ? null : repo.id)}
                  className="p-1 rounded hover:bg-muted-foreground/10 shrink-0"
                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  data-testid={`gh-toggle-${repo.id}`}
                >
                  <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', isExpanded && 'rotate-180')} />
                </button>
              </div>

              {isExpanded && (
                <div className="bg-muted/30 px-4 py-2 flex flex-col gap-1">
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { handleAddRepo(repo); onClose(); }}
                    disabled={repoAlreadyAdded}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold rounded-md bg-primary text-white hover:bg-[#003a3d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    data-testid={`gh-add-repo-${repo.id}`}
                  >
                    {repoAlreadyAdded ? <><Check className="w-3 h-3" /> Repo added</> : 'Add entire repo as context'}
                  </button>
                  {repo.paths.map(path => {
                    const pathId = `gh-path-${repo.id}-${path.replace(/[^a-zA-Z0-9]/g, '_')}`;
                    const pathAdded = alreadySelectedIds.includes(pathId);
                    return (
                      <button
                        key={path}
                        onMouseDown={e => e.preventDefault()}
                        onClick={() => { handleAddPath(repo, path); }}
                        disabled={pathAdded}
                        className="w-full flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground hover:bg-white hover:text-foreground rounded-md transition-colors text-left disabled:opacity-50"
                        data-testid={`gh-add-path-${repo.id}-${path.replace(/[^a-zA-Z0-9]/g, '-')}`}
                      >
                        <FileText className="w-3 h-3 shrink-0" />
                        <span className="truncate flex-1">{path}</span>
                        {pathAdded && <Check className="w-3 h-3 text-primary shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
