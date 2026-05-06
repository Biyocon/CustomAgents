import { useMemo, useState, type ElementType } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BarChart2,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  Database,
  Eye,
  FileSearch,
  Globe,
  History,
  Layers,
  Mic,
  Plus,
  Search,
  Shield,
  Sparkles,
  Star,
  Terminal,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  IQRA_AGENTS,
  type AgentIconKey,
  type AgentKind,
  type AgentScope,
  type AgentStatus,
  type WorkspaceAgent,
} from '@workspace/agents';
import { cn } from '@/lib/utils';
import yunusAvatar from '@assets/ChatGPT_Image_Apr_29,_2026,_10_35_24_AM_1777452805402.png';

type SortMode = 'uses' | 'rating' | 'updated' | 'az';

interface AgentsViewProps {
  selectedAgentId?: string | null;
  onUseAgent?: (agentId: string) => void;
}

const ASSET_AVATARS: Record<string, string> = {
  yunus: yunusAvatar,
  sibgha: "/avatars/2_Avatar_Agent_Sibqah_Finance_Analytics_Specialist.png",
};

const ICONS: Record<AgentIconKey, ElementType> = {
  sparkles: Sparkles,
  code: Code2,
  'file-search': FileSearch,
  'bar-chart': BarChart2,
  mic: Mic,
  layers: Layers,
  eye: Eye,
  database: Database,
  'book-open': BookOpen,
  wrench: Wrench,
  shield: Shield,
  zap: Zap,
};

const TYPE_META: Record<AgentKind, { color: string; label: string; Icon: ElementType }> = {
  chat: { color: '#004E51', label: 'Chat', Icon: Sparkles },
  code: { color: '#2563eb', label: 'Code', Icon: Code2 },
  research: { color: '#7c3aed', label: 'Research', Icon: FileSearch },
  automation: { color: '#16a34a', label: 'Automation', Icon: Zap },
  data: { color: '#0ea5e9', label: 'Data', Icon: BarChart2 },
};

const STATUS_META: Record<AgentStatus, { color: string; bg: string; label: string; Icon: ElementType }> = {
  published: { color: '#16a34a', bg: '#dcfce7', label: 'Published', Icon: CheckCircle2 },
  draft: { color: '#d97706', bg: '#fef3c7', label: 'Draft', Icon: Clock },
  archived: { color: '#6b7280', bg: '#f3f4f6', label: 'Archived', Icon: History },
};

const TAB_LABELS: Record<AgentScope, string> = {
  official: 'Official',
  team: 'Team',
  community: 'Community',
  personal: 'Personal',
};

const BASE_FILTERS = [
  'All',
  'Chat',
  'Code',
  'Research',
  'Data',
  'Automation',
  'Review',
  'SEO',
  'Marketing',
  'Product',
  'Planning',
  'Design',
  'Construction',
  'Quality',
];

const TOOLS_LIST = [
  { key: 'web-search', label: 'Web Search', icon: Globe },
  { key: 'code-exec', label: 'Code Execution', icon: Terminal },
  { key: 'file-read', label: 'File Access', icon: BookOpen },
  { key: 'database', label: 'Database', icon: Database },
  { key: 'memory', label: 'Long Memory', icon: Sparkles },
  { key: 'automation', label: 'Automation', icon: Zap },
];

function getAvatarSrc(agent: WorkspaceAgent): string | undefined {
  const key = agent.avatar?.assetKey;
  if (key) return ASSET_AVATARS[key];
  return agent.avatar?.src;
}

function getInitials(agent: WorkspaceAgent): string {
  return agent.avatar?.fallbackInitial ?? agent.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
}

function cloneAgent(agent: WorkspaceAgent): WorkspaceAgent {
  return {
    ...agent,
    capabilities: [...agent.capabilities],
    tools: [...agent.tools],
    tags: agent.tags ? [...agent.tags] : undefined,
    languages: agent.languages ? [...agent.languages] : undefined,
    avatar: agent.avatar ? { ...agent.avatar } : undefined,
  };
}

function AgentAvatar({
  agent,
  size = 'md',
  selected = false,
}: {
  agent: WorkspaceAgent;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const src = failed ? undefined : getAvatarSrc(agent);
  const accent = agent.avatar?.accentColor ?? agent.color;
  const sizeClass = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-base',
  }[size];
  const rounded = size === 'sm' ? 'rounded-full' : 'rounded-2xl';

  if (src) {
    return (
      <img
        src={src}
        alt={agent.avatar?.alt ?? agent.name}
        onError={() => setFailed(true)}
        className={cn(sizeClass, rounded, 'object-cover shrink-0 border-2 bg-white transition-shadow', selected && 'shadow-md')}
        style={{ borderColor: accent }}
      />
    );
  }

  const Icon = ICONS[agent.iconKey] ?? TYPE_META[agent.kind].Icon;

  return (
    <div
      className={cn(sizeClass, rounded, 'flex items-center justify-center shrink-0 border-2 font-bold text-white transition-shadow', selected && 'shadow-md')}
      style={{
        borderColor: accent,
        background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
      }}
      title={agent.avatar?.visualDirection}
    >
      {size === 'sm' ? getInitials(agent).slice(0, 2) : <Icon className="w-1/2 h-1/2" />}
    </div>
  );
}

function AgentAvatarStrip({
  agents,
  selectedAgentId,
  onSelectAgent,
}: {
  agents: WorkspaceAgent[];
  selectedAgentId?: string | null;
  onSelectAgent?: (agent: WorkspaceAgent) => void;
}) {
  return (
    <div className="flex items-center -space-x-1.5" data-testid="agent-avatar-strip">
      {agents.slice(0, 14).map((agent) => (
        <button
          key={agent.id}
          type="button"
          onClick={() => onSelectAgent?.(agent)}
          title={`${agent.name}${agent.role ? ` - ${agent.role}` : ''}`}
          className={cn(
            'rounded-full bg-white p-0.5 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
            selectedAgentId === agent.id && 'ring-2 ring-primary',
          )}
          data-testid={`avatar-strip-agent-${agent.id}`}
        >
          <AgentAvatar agent={agent} size="sm" selected={selectedAgentId === agent.id} />
        </button>
      ))}
    </div>
  );
}

function AgentCard({
  agent,
  selected,
  onOpen,
}: {
  agent: WorkspaceAgent;
  selected: boolean;
  onOpen: (agent: WorkspaceAgent) => void;
}) {
  const meta = TYPE_META[agent.kind];
  const sMeta = STATUS_META[agent.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      className={cn(
        'bg-white border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-md transition-all group cursor-pointer',
        selected ? 'border-primary/50 shadow-sm' : 'border-border',
      )}
      onClick={() => onOpen(agent)}
      data-testid={`agent-card-${agent.id}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <AgentAvatar agent={agent} selected={selected} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-[13px] font-bold text-foreground truncate">{agent.name}</p>
              {agent.isOfficial && (
                <span title="Official" className="w-4 h-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-primary-foreground" />
                </span>
              )}
              {agent.scope === 'team' && (
                <span title="Team" className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  Team
                </span>
              )}
            </div>
            {agent.role && <p className="text-[11px] font-medium text-foreground/70 truncate">{agent.role}</p>}
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span
                className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ background: `${agent.color}18`, color: agent.color }}
              >
                {agent.category ?? meta.label}
              </span>
              <span className="text-[10px] text-muted-foreground">{agent.model}</span>
            </div>
          </div>
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0"
          style={{ background: sMeta.bg, color: sMeta.color }}
        >
          <sMeta.Icon className="w-2.5 h-2.5" />
          {sMeta.label}
        </span>
      </div>

      <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">{agent.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {agent.capabilities.slice(0, 4).map((cap) => (
          <span key={cap} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f0f0] text-muted-foreground">
            {cap}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground">Tools:</span>
        <div className="flex items-center gap-1">
          {agent.tools.map((toolKey) => {
            const tool = TOOLS_LIST.find((item) => item.key === toolKey);
            if (!tool) return null;
            return <tool.icon key={toolKey} className="w-3 h-3 text-muted-foreground" />;
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50 mt-auto">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          {agent.rating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              {agent.rating} ({agent.reviews})
            </span>
          )}
          {agent.uses > 0 && <span>{agent.uses.toLocaleString()} uses</span>}
          <span>v{agent.version}</span>
          <span>{agent.updatedAgo}</span>
        </div>
        <span className="text-[10px] text-muted-foreground truncate max-w-[96px]">{agent.author}</span>
      </div>
    </motion.div>
  );
}

function AgentDetailPanel({
  agent,
  onClose,
  onUse,
  onEdit,
  onDuplicate,
}: {
  agent: WorkspaceAgent;
  onClose: () => void;
  onUse: (agent: WorkspaceAgent) => void;
  onEdit: (agent: WorkspaceAgent) => void;
  onDuplicate: (agent: WorkspaceAgent) => void;
}) {
  return (
    <motion.div
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 340, opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-[340px] bg-white border-l border-border flex flex-col overflow-hidden shrink-0"
      data-testid="agent-detail-drawer"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <p className="text-[13px] font-bold text-foreground">Agent Details</p>
        <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-3 text-center">
          <AgentAvatar agent={agent} size="xl" />
          <div>
            <h2 className="text-base font-bold text-foreground">{agent.name}</h2>
            {agent.role && <p className="text-xs font-semibold text-foreground/80 mt-0.5">{agent.role}</p>}
            <p className="text-xs text-muted-foreground mt-0.5">
              by {agent.author} · v{agent.version}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            {agent.rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {agent.rating}
              </span>
            )}
            {agent.uses > 0 && <span>{agent.uses.toLocaleString()} uses</span>}
          </div>
        </div>

        {(agent.organization || agent.department || agent.location) && (
          <div className="grid grid-cols-2 gap-3 text-left">
            {agent.organization && <Meta label="Organization" value={agent.organization} />}
            {agent.department && <Meta label="Department" value={agent.department} />}
            {agent.location && <Meta label="Location" value={agent.location} />}
            {agent.culturalBackground && <Meta label="Background" value={agent.culturalBackground} />}
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Profile</p>
          <p className="text-[12px] text-foreground/85 leading-relaxed whitespace-pre-line">
            {agent.profileDescription ?? agent.description}
          </p>
        </div>

        {agent.tags && agent.tags.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {agent.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Capabilities</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((capability) => (
              <span key={capability} className="text-[11px] font-medium px-2 py-1 rounded-full bg-[#f0f0f0] text-muted-foreground">
                {capability}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Tools Access</p>
          <div className="flex flex-col gap-1.5">
            {TOOLS_LIST.map((tool) => {
              const active = agent.tools.includes(tool.key);
              return (
                <div key={tool.key} className={cn('flex items-center gap-2 text-xs', active ? 'text-foreground' : 'text-muted-foreground/40')}>
                  <tool.icon className="w-3.5 h-3.5 shrink-0" />
                  {tool.label}
                  {active && <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />}
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">System Prompt</p>
          <p className="text-[11px] font-mono text-muted-foreground line-clamp-6 leading-relaxed">
            {agent.systemPrompt ?? 'No system prompt configured.'}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={() => onUse(agent)}
            className="w-full bg-primary text-primary-foreground text-sm font-semibold py-2.5 rounded-xl hover:bg-[#003a3d] transition-colors"
            data-testid="button-use-agent"
          >
            Use Agent
          </button>
          <button
            onClick={() => onEdit(agent)}
            className="w-full border border-border text-foreground text-sm font-medium py-2.5 rounded-xl hover:bg-[#f5f5f5] transition-colors"
            data-testid="button-edit-agent"
          >
            Edit locally
          </button>
          <button
            onClick={() => onDuplicate(agent)}
            className="w-full border border-border text-muted-foreground text-sm font-medium py-2.5 rounded-xl hover:bg-[#f5f5f5] transition-colors"
            data-testid="button-duplicate-agent"
          >
            <Copy className="w-3.5 h-3.5 inline mr-1.5" />
            Duplicate as personal draft
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-xs font-semibold text-foreground">{value}</p>
    </div>
  );
}

function AgentEditor({
  agent,
  onCancel,
  onSave,
}: {
  agent: WorkspaceAgent;
  onCancel: () => void;
  onSave: (agent: WorkspaceAgent) => void;
}) {
  const [draft, setDraft] = useState<WorkspaceAgent>(() => cloneAgent(agent));
  const [tagsText, setTagsText] = useState((agent.tags ?? []).join(', '));
  const [toolsText, setToolsText] = useState(agent.tools.join(', '));

  const update = <K extends keyof WorkspaceAgent,>(key: K, value: WorkspaceAgent[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <motion.div
      key="editor"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col overflow-hidden min-h-0 bg-white"
    >
      <div className="border-b border-border px-5 py-3 flex items-center gap-4 shrink-0">
        <button onClick={onCancel} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Agents
        </button>
        <div className="w-px h-5 bg-border" />
        <p className="text-sm font-semibold text-foreground truncate">Local edit: {draft.name}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[760px] mx-auto flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <AgentAvatar agent={draft} size="lg" />
            <div>
              <p className="text-sm font-bold text-foreground">Avatar preview</p>
              <p className="text-xs text-muted-foreground">Fallback bruges automatisk, hvis billedfilen mangler.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditorField label="Name" value={draft.name} onChange={(value) => update('name', value)} />
            <EditorField label="Role" value={draft.role ?? ''} onChange={(value) => update('role', value)} />
            <EditorField label="Category" value={draft.category ?? ''} onChange={(value) => update('category', value)} />
            <EditorField label="Model" value={draft.model} onChange={(value) => update('model', value)} />
            <EditorField label="Status" value={draft.status} onChange={(value) => update('status', value as AgentStatus)} />
            <EditorField label="Version" value={draft.version} onChange={(value) => update('version', value)} />
          </div>

          <EditorArea label="Description" value={draft.description} onChange={(value) => update('description', value)} rows={3} />
          <EditorArea label="System prompt" value={draft.systemPrompt ?? ''} onChange={(value) => update('systemPrompt', value)} rows={8} />
          <EditorField label="Tools (comma separated)" value={toolsText} onChange={setToolsText} />
          <EditorField label="Tags (comma separated)" value={tagsText} onChange={setTagsText} />

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onCancel} className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-[#f5f5f5]">
              Cancel
            </button>
            <button
              onClick={() =>
                onSave({
                  ...draft,
                  status: ['published', 'draft', 'archived'].includes(draft.status) ? draft.status : 'draft',
                  tags: tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
                  tools: toolsText.split(',').map((tool) => tool.trim()).filter(Boolean),
                })
              }
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-[#003a3d]"
              data-testid="button-save-agent-local"
            >
              Save local changes
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EditorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="text-sm border border-border rounded-xl px-3 py-2.5 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </label>
  );
}

function EditorArea({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="text-sm border border-border rounded-xl px-3 py-2.5 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-y"
      />
    </label>
  );
}

export function AgentsView({ selectedAgentId, onUseAgent }: AgentsViewProps) {
  const [agents, setAgents] = useState<WorkspaceAgent[]>(() => IQRA_AGENTS.map(cloneAgent));
  const [tab, setTab] = useState<AgentScope>('official');
  const [search, setSearch] = useState('');
  const [capFilter, setCapFilter] = useState('All');
  const [sort, setSort] = useState<SortMode>('uses');
  const [selectedAgent, setSelectedAgent] = useState<WorkspaceAgent | null>(null);
  const [editingAgent, setEditingAgent] = useState<WorkspaceAgent | null>(null);

  const teamAgents = useMemo(() => agents.filter((agent) => agent.scope === 'team'), [agents]);
  const filters = useMemo(() => {
    const categories = agents.map((agent) => agent.category).filter((value): value is string => Boolean(value));
    return Array.from(new Set([...BASE_FILTERS, ...categories]));
  }, [agents]);

  const tabCounts = useMemo<Record<AgentScope, number>>(
    () => ({
      official: agents.filter((agent) => agent.scope === 'official').length,
      team: agents.filter((agent) => agent.scope === 'team').length,
      community: agents.filter((agent) => agent.scope === 'community').length,
      personal: agents.filter((agent) => agent.scope === 'personal').length,
    }),
    [agents],
  );

  const displayed = useMemo(() => {
    const query = search.trim().toLowerCase();
    return agents
      .filter((agent) => agent.scope === tab)
      .filter((agent) => {
        if (!query) return true;
        return [
          agent.name,
          agent.role,
          agent.category,
          agent.description,
          agent.organization,
          agent.department,
          ...(agent.tags ?? []),
          ...agent.capabilities,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      })
      .filter((agent) => {
        if (capFilter === 'All') return true;
        const needle = capFilter.toLowerCase();
        return (
          TYPE_META[agent.kind].label.toLowerCase() === needle ||
          agent.category?.toLowerCase() === needle ||
          agent.capabilities.some((capability) => capability.toLowerCase().includes(needle)) ||
          agent.tags?.some((tag) => tag.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => {
        if (sort === 'uses') return b.uses - a.uses;
        if (sort === 'rating') return b.rating - a.rating;
        if (sort === 'az') return a.name.localeCompare(b.name);
        return b.updatedAgo.localeCompare(a.updatedAgo);
      });
  }, [agents, capFilter, search, sort, tab]);

  const openAgent = (agent: WorkspaceAgent) => {
    setEditingAgent(null);
    setSelectedAgent(agent);
  };

  const duplicateAgent = (agent: WorkspaceAgent) => {
    const copy: WorkspaceAgent = {
      ...cloneAgent(agent),
      id: `${agent.id}-copy-${Date.now().toString(36)}`,
      name: `${agent.name} Copy`,
      scope: 'personal',
      status: 'draft',
      author: 'You',
      uses: 0,
      rating: 0,
      reviews: 0,
      updatedAgo: 'now',
      isOfficial: false,
    };
    setAgents((current) => [copy, ...current]);
    setTab('personal');
    setSelectedAgent(null);
    setEditingAgent(copy);
  };

  const saveAgent = (agent: WorkspaceAgent) => {
    setAgents((current) => current.map((item) => (item.id === agent.id ? cloneAgent(agent) : item)));
    setSelectedAgent(agent);
    setEditingAgent(null);
  };

  const useAgent = (agent: WorkspaceAgent) => {
    onUseAgent?.(agent.id);
    setSelectedAgent(agent);
  };

  if (editingAgent) {
    return <AgentEditor agent={editingAgent} onCancel={() => setEditingAgent(null)} onSave={saveAgent} />;
  }

  return (
    <div className="flex-1 flex overflow-hidden min-h-0">
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="bg-white border-b border-border px-6 py-4 shrink-0">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-xl font-bold text-foreground">Agents</h1>
              <p className="text-sm text-muted-foreground">Discover, deploy and build AI agents for your workspace</p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <AgentAvatarStrip agents={teamAgents} selectedAgentId={selectedAgentId} onSelectAgent={openAgent} />
              <button
                onClick={() => {
                  const base = agents.find((agent) => agent.scope === 'personal') ?? agents[0];
                  setEditingAgent({
                    ...cloneAgent(base),
                    id: `custom-agent-${Date.now().toString(36)}`,
                    name: 'New Agent',
                    description: '',
                    role: 'Custom Agent',
                    scope: 'personal',
                    status: 'draft',
                    author: 'You',
                    uses: 0,
                    rating: 0,
                    reviews: 0,
                    updatedAgo: 'now',
                    systemPrompt: '',
                    avatar: {
                      alt: 'Custom agent avatar',
                      accentColor: '#004E51',
                      fallbackInitial: 'NA',
                    },
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-[#003a3d] transition-colors"
                data-testid="button-new-agent"
              >
                <Plus className="w-4 h-4" />
                New Agent
              </button>
            </div>
          </div>

          <div className="flex items-end gap-0 -mb-4 overflow-x-auto scrollbar-none">
            {(['official', 'team', 'community', 'personal'] as AgentScope[]).map((scope) => (
              <button
                key={scope}
                onClick={() => setTab(scope)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  tab === scope ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground',
                )}
                data-testid={`tab-agents-${scope}`}
              >
                {TAB_LABELS[scope]}
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', tab === scope ? 'bg-primary/10 text-primary' : 'bg-[#f0f0f0] text-muted-foreground')}>
                  {tabCounts[scope]}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border-b border-border/50 px-6 py-3 flex items-center gap-3 shrink-0 overflow-x-auto scrollbar-none">
          <div className="relative shrink-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input
              placeholder="Search agents..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="text-xs pl-8 pr-3 py-2 border border-border rounded-lg bg-[#f5f5f5] outline-none w-48 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-muted-foreground/60 transition-all"
              data-testid="input-search-agents"
            />
          </div>
          <div className="w-px h-5 bg-border shrink-0" />
          <div className="flex items-center gap-1.5 flex-nowrap">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setCapFilter(filter)}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-semibold rounded-full border whitespace-nowrap transition-all',
                  capFilter === filter ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                )}
                data-testid={`cap-filter-${filter.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <div className="ml-auto shrink-0">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortMode)}
              className="text-xs border border-border rounded-lg px-3 py-2 bg-white outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              data-testid="select-sort"
            >
              <option value="uses">Most Used</option>
              <option value="rating">Highest Rated</option>
              <option value="updated">Recently Updated</option>
              <option value="az">A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-fr">
              {displayed.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  selected={selectedAgentId === agent.id}
                  onOpen={openAgent}
                />
              ))}
              {displayed.length === 0 && (
                <div className="col-span-4 py-16 text-center text-muted-foreground text-sm">No agents match your search.</div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedAgent && (
          <AgentDetailPanel
            agent={selectedAgent}
            onClose={() => setSelectedAgent(null)}
            onUse={useAgent}
            onEdit={setEditingAgent}
            onDuplicate={duplicateAgent}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
