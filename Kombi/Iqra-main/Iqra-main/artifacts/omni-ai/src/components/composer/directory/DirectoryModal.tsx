import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, Sparkles, Database, Puzzle, Settings, Plus, Check,
  ChevronDown, Monitor, Download, Server, Wrench, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  mockDirectorySkills,
  mockDirectoryConnectors,
  mockDirectoryPlugins,
  mockDirectoryMCPs,
} from '@/data/mockComposerData';
import type {
  DirectoryTab, DirectoryState,
  DirectorySkillEntry, DirectoryConnectorEntry, Plugin, MCPServer,
} from '@/types/composer';

interface DirectoryModalProps {
  state: DirectoryState;
  onChangeTab: (tab: DirectoryTab) => void;
  onChangeQuery: (q: string) => void;
  onChangeFilter: (f: string | undefined) => void;
  onChangeSort: (s: string | undefined) => void;
  onClose: () => void;
}

const TABS: { id: DirectoryTab; label: string; icon: React.ReactNode }[] = [
  { id: 'skills',     label: 'Skills',     icon: <Sparkles className="w-4 h-4" /> },
  { id: 'connectors', label: 'Connectors', icon: <Database className="w-4 h-4" /> },
  { id: 'plugins',    label: 'Plugins',    icon: <Puzzle className="w-4 h-4" />   },
  { id: 'mcps',       label: 'MCPs',       icon: <Server className="w-4 h-4" />   },
];

const TAB_LABEL: Record<DirectoryTab, string> = {
  skills: 'Skills',
  connectors: 'Connectors',
  plugins: 'Plugins',
  mcps: 'MCP Servers',
};

function formatDownloads(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

export function DirectoryModal({
  state, onChangeTab, onChangeQuery, onChangeFilter, onChangeSort, onClose,
}: DirectoryModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Esc to close + focus management (capture opener, restore on close).
  useEffect(() => {
    if (!state.isOpen) return;
    // Remember whatever element opened the modal so we can restore focus on close.
    previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    closeRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handler);
      // Restore focus to the opener (or its closest focusable ancestor).
      const opener = previousFocusRef.current;
      if (opener && document.contains(opener)) {
        try {
          opener.focus();
        } catch {
          /* element no longer focusable — ignore */
        }
      }
    };
  }, [state.isOpen, onClose]);

  return (
    <AnimatePresence>
      {state.isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-sm"
          onMouseDown={onClose}
          data-testid="directory-overlay"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-5xl h-[80vh] max-h-[720px] bg-white rounded-3xl shadow-[0_20px_80px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col"
            onMouseDown={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Directory"
            data-testid="directory-modal"
          >
            {/* Close */}
            <button
              ref={closeRef}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Close directory"
              data-testid="directory-close"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <aside className="hidden sm:flex flex-col w-56 shrink-0 bg-[#fafafa] border-r border-border/50 px-3 py-6">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 pb-2">Directory</p>
                <nav className="flex flex-col gap-0.5">
                  {TABS.map(t => {
                    const active = state.activeTab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => onChangeTab(t.id)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left',
                          active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                        )}
                        data-testid={`directory-tab-${t.id}`}
                      >
                        <span className={cn('shrink-0', active ? 'text-primary' : 'text-muted-foreground')}>{t.icon}</span>
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </aside>

              {/* Mobile tab strip */}
              <div className="sm:hidden absolute top-4 left-4 flex gap-1">
                {TABS.map(t => {
                  const active = state.activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => onChangeTab(t.id)}
                      className={cn(
                        'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                        active ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      )}
                      data-testid={`directory-tab-mobile-${t.id}`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col min-w-0 pt-12 sm:pt-0">
                {/* Header */}
                <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-border/40">
                  <h2 className="text-2xl font-semibold text-foreground">{TAB_LABEL[state.activeTab]}</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {state.activeTab === 'skills' && 'Browse and install reusable skills'}
                    {state.activeTab === 'connectors' && 'Connect to external services and tools'}
                    {state.activeTab === 'plugins' && 'Browse plugins by category'}
                    {state.activeTab === 'mcps' && 'Connect Model Context Protocol servers — tools, resources, and prompts'}
                  </p>

                  {/* Search row */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-xl flex-1 min-w-0">
                      <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                      <input
                        value={state.searchQuery}
                        onChange={e => onChangeQuery(e.target.value)}
                        placeholder={`Search ${state.activeTab}…`}
                        className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:text-muted-foreground"
                        data-testid="directory-search"
                      />
                    </div>

                    {/* Filter / Sort dropdowns (purely visual) */}
                    <div className="flex gap-2">
                      <DirectoryDropdown
                        label="Filter by"
                        value={state.filterBy}
                        options={['All', 'Installed', 'Most popular', 'Recently added']}
                        onSelect={v => onChangeFilter(v === 'All' ? undefined : v)}
                        testId="directory-filter"
                      />
                      <DirectoryDropdown
                        label="Sort by"
                        value={state.sortBy}
                        options={['Popular', 'Newest', 'Name']}
                        onSelect={v => onChangeSort(v)}
                        testId="directory-sort"
                      />
                    </div>
                  </div>

                  {/* Category pill */}
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      Anthropic &amp; Partners
                    </span>
                  </div>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
                  {state.activeTab === 'skills'     && <SkillsTab     query={state.searchQuery} />}
                  {state.activeTab === 'connectors' && <ConnectorsTab query={state.searchQuery} />}
                  {state.activeTab === 'plugins'    && <PluginsTab    query={state.searchQuery} />}
                  {state.activeTab === 'mcps'       && <MCPsTab       query={state.searchQuery} />}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Dropdown helper ────────────────────────────────────────
function DirectoryDropdown({ label, value, options, onSelect, testId }: {
  label: string; value?: string; options: string[];
  onSelect: (v: string) => void; testId: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-2 bg-muted rounded-xl text-sm text-foreground hover:bg-muted/80 transition-colors"
        data-testid={testId}
      >
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{value ?? 'All'}</span>
        <ChevronDown className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-20 bg-white border border-border rounded-xl shadow-lg py-1 min-w-[160px]">
            {options.map(opt => (
              <button
                key={opt}
                onClick={() => { onSelect(opt); setOpen(false); }}
                className="w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors text-left"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Skills tab ─────────────────────────────────────────────
function SkillsTab({ query }: { query: string }) {
  const list = useMemo(() => filterByQuery(mockDirectorySkills, query, ['name', 'description', 'provider']), [query]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {list.map(s => <SkillCard key={s.id} skill={s} />)}
      {list.length === 0 && <EmptyState query={query} />}
    </div>
  );
}

function SkillCard({ skill }: { skill: DirectorySkillEntry }) {
  return (
    <div className="bg-white border border-border/60 rounded-2xl p-4 hover:border-primary/40 transition-colors flex flex-col gap-3" data-testid={`directory-skill-${skill.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-mono font-semibold text-sm text-foreground truncate">{skill.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{skill.provider} · {formatDownloads(skill.downloads)} downloads</p>
        </div>
        <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Settings">
          <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{skill.description}</p>
      <button
        className={cn(
          'mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
          skill.installed
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-white hover:bg-[#003a3d]'
        )}
        data-testid={`directory-skill-action-${skill.id}`}
      >
        {skill.installed ? <><Check className="w-3 h-3" /> Installed</> : <><Plus className="w-3 h-3" /> Add skill</>}
      </button>
    </div>
  );
}

// ── Connectors tab ─────────────────────────────────────────
function ConnectorsTab({ query }: { query: string }) {
  const list = useMemo(() => filterByQuery(mockDirectoryConnectors, query, ['name', 'description', 'category']), [query]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {list.map(c => <ConnectorCard key={c.id} connector={c} />)}
      {list.length === 0 && <EmptyState query={query} />}
    </div>
  );
}

function ConnectorCard({ connector }: { connector: DirectoryConnectorEntry }) {
  return (
    <div className="bg-white border border-border/60 rounded-2xl p-4 hover:border-primary/40 transition-colors flex flex-col gap-3" data-testid={`directory-connector-${connector.id}`}>
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: connector.iconColor ?? '#94a3b8' }}
        >
          {connector.iconLetter ?? connector.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{connector.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{connector.popularity ?? connector.category}</p>
        </div>
        {connector.connected ? (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Connected</span>
        ) : (
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors" aria-label="Settings">
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{connector.description}</p>
      <button
        className={cn(
          'mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
          connector.connected
            ? 'bg-muted text-muted-foreground'
            : 'bg-primary text-white hover:bg-[#003a3d]'
        )}
        data-testid={`directory-connector-action-${connector.id}`}
      >
        {connector.connected ? <><Check className="w-3 h-3" /> Connected</> : <><Plus className="w-3 h-3" /> Add connector</>}
      </button>
    </div>
  );
}

// ── Plugins tab ────────────────────────────────────────────
function PluginsTab({ query }: { query: string }) {
  const list = useMemo(() => filterByQuery(mockDirectoryPlugins, query, ['name', 'description', 'provider']), [query]);
  return (
    <>
      <div className="mb-4 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200/60 flex items-start gap-2.5" data-testid="directory-plugins-banner">
        <Monitor className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-900">
          Plugins can be browsed, but are only available for use in the desktop app.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map(p => <PluginCard key={p.id} plugin={p} />)}
        {list.length === 0 && <EmptyState query={query} />}
      </div>
    </>
  );
}

function PluginCard({ plugin }: { plugin: Plugin }) {
  const desktopOnly = plugin.availability === 'desktop-only';
  return (
    <div className="bg-white border border-border/60 rounded-2xl p-4 hover:border-primary/40 transition-colors flex flex-col gap-3" data-testid={`directory-plugin-${plugin.id}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{plugin.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {plugin.provider}
            {plugin.downloads !== undefined && ` · ${formatDownloads(plugin.downloads)} `}
            {plugin.downloads !== undefined && <Download className="inline w-2.5 h-2.5 align-middle" />}
          </p>
        </div>
        {desktopOnly && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Desktop only</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">{plugin.description}</p>
      <button
        disabled={desktopOnly}
        className={cn(
          'mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
          plugin.enabled
            ? 'bg-muted text-muted-foreground'
            : desktopOnly
              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              : 'bg-primary text-white hover:bg-[#003a3d]'
        )}
        data-testid={`directory-plugin-action-${plugin.id}`}
      >
        {plugin.enabled
          ? <><Check className="w-3 h-3" /> Installed</>
          : desktopOnly
            ? 'Desktop only'
            : <><Plus className="w-3 h-3" /> Install</>
        }
      </button>
    </div>
  );
}

// ── MCPs tab ───────────────────────────────────────────────
function MCPsTab({ query }: { query: string }) {
  const list = useMemo(
    () => filterByQuery(mockDirectoryMCPs, query, ['name', 'description', 'provider', 'category']),
    [query]
  );
  return (
    <>
      <div
        className="mb-4 px-4 py-3 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-2.5"
        data-testid="directory-mcps-banner"
      >
        <Server className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-foreground/80">
          MCP-servere udvider modellen med eksterne værktøjer, ressourcer og prompts
          via stdio, SSE eller streamable HTTP.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {list.map(m => <MCPCard key={m.id} mcp={m} />)}
        {list.length === 0 && <EmptyState query={query} />}
      </div>
    </>
  );
}

const TRANSPORT_LABEL: Record<MCPServer['transport'], string> = {
  stdio: 'stdio',
  sse:   'SSE',
  http:  'HTTP',
};

function MCPCard({ mcp }: { mcp: MCPServer }) {
  const isConnected   = mcp.status === 'connected';
  const requiresAuth  = mcp.status === 'requires-auth';
  const hasError      = mcp.status === 'error';

  return (
    <div
      className="bg-white border border-border/60 rounded-2xl p-4 hover:border-primary/40 transition-colors flex flex-col gap-3"
      data-testid={`directory-mcp-${mcp.id}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
          style={{ background: mcp.iconColor ?? '#94a3b8' }}
        >
          {mcp.iconLetter ?? mcp.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{mcp.name}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
            {mcp.provider}
            {mcp.popularity && <> · {mcp.popularity}</>}
          </p>
        </div>
        {isConnected && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
            Connected
          </span>
        )}
        {requiresAuth && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 shrink-0">
            Auth required
          </span>
        )}
        {hasError && (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 shrink-0">
            Error
          </span>
        )}
        {!isConnected && !requiresAuth && !hasError && (
          <button className="p-1.5 hover:bg-muted rounded-lg transition-colors shrink-0" aria-label="Settings">
            <Settings className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2">{mcp.description}</p>

      {/* Stats row */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Wrench className="w-3 h-3" />
          {mcp.toolCount} {mcp.toolCount === 1 ? 'tool' : 'tools'}
        </span>
        {mcp.resourceCount !== undefined && mcp.resourceCount > 0 && (
          <span className="inline-flex items-center gap-1">
            <Database className="w-3 h-3" />
            {mcp.resourceCount} resources
          </span>
        )}
        <span className="inline-flex items-center gap-1 ml-auto">
          <Zap className="w-3 h-3" />
          {TRANSPORT_LABEL[mcp.transport]}
        </span>
      </div>

      <button
        className={cn(
          'mt-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
          isConnected
            ? 'bg-muted text-muted-foreground'
            : requiresAuth
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : hasError
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-primary text-white hover:bg-[#003a3d]'
        )}
        data-testid={`directory-mcp-action-${mcp.id}`}
      >
        {isConnected
          ? <><Check className="w-3 h-3" /> Connected</>
          : requiresAuth
            ? <>Authorize</>
            : hasError
              ? <>Reconnect</>
              : <><Plus className="w-3 h-3" /> Add MCP server</>
        }
      </button>
    </div>
  );
}

// ── Utilities ──────────────────────────────────────────────
function filterByQuery<T>(items: T[], query: string, fields: (keyof T)[]): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(item =>
    fields.some(f => String((item as Record<string, unknown>)[f as string] ?? '').toLowerCase().includes(q))
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="col-span-full px-4 py-12 text-center text-sm text-muted-foreground">
      No results for &ldquo;{query}&rdquo;
    </div>
  );
}
