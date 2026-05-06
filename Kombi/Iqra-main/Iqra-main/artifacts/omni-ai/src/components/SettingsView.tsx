import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Palette, Brain, FileText, Cpu, PenLine, Bell, Monitor,
  Link2, Search, CheckCircle2, AlertCircle, XCircle, RefreshCw,
  Trash2, ChevronRight, Check, X, Plus, Eye, EyeOff, Loader2,
  GitBranch, CreditCard, Slack, Figma, Globe, Database, Mail,
  MessageSquare, Zap, Package, Bot, LayoutGrid, Shield, Lock,
  Sun, Moon, SlidersHorizontal, Camera, Upload, ChevronDown,
  Sparkles, Volume2, Smartphone, Mic, Play,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  RECOGNITION_LANGUAGES,
  resetSpeechSettings,
  resolveVoice,
  setSpeechSettings,
  useAvailableVoices,
  useSpeechSettings,
} from '@/lib/speechSettings';
import { speak, cancelSpeak } from '@/hooks/useSpeechCapture';

/* ═══════════════════════════════════════════
   Types & Navigation
═══════════════════════════════════════════ */
type SettingsSection =
  | 'connectors'
  | 'profile' | 'personalization' | 'traits' | 'instructions'
  | 'models' | 'signatures' | 'notifications' | 'appearance' | 'speech';

interface NavGroup { label: string; items: { id: SettingsSection; label: string; icon: React.ElementType }[] }

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Integrations',
    items: [{ id: 'connectors', label: 'Connectors', icon: Link2 }],
  },
  {
    label: 'Customize',
    items: [
      { id: 'profile',         label: 'Profile',              icon: User },
      { id: 'personalization', label: 'Personalization',      icon: Palette },
      { id: 'traits',          label: 'Traits',               icon: Brain },
      { id: 'instructions',    label: 'Custom Instructions',  icon: FileText },
      { id: 'models',          label: 'Models & Defaults',    icon: Cpu },
      { id: 'signatures',      label: 'Signatures',           icon: PenLine },
      { id: 'notifications',   label: 'Notifications',        icon: Bell },
      { id: 'appearance',      label: 'Appearance',           icon: Monitor },
      { id: 'speech',          label: 'Speech & Voice',       icon: Mic },
    ],
  },
];

/* ═══════════════════════════════════════════
   Shared UI primitives
═══════════════════════════════════════════ */
function PanelHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
    </div>
  );
}

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center justify-between pt-5 border-t border-border mt-6">
      <span className={cn('text-[12px] font-medium transition-colors', saved ? 'text-[#22c55e]' : 'text-muted-foreground')}>
        {saved ? '✓ Changes saved' : 'Unsaved changes'}
      </span>
      <button onClick={onSave} className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-[#003a3d] transition-colors" data-testid="btn-save-settings">
        Save changes
      </button>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={cn('relative w-9 h-5 rounded-full transition-colors shrink-0', on ? 'bg-primary' : 'bg-[#d1d5db]')}
      aria-label={label}
    >
      <span className={cn('absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform', on ? 'translate-x-4' : 'translate-x-0')} />
    </button>
  );
}

function Field({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-border/60 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {desc && <p className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      type={type}
      className="text-sm px-3 py-2 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 transition-all w-[280px] placeholder:text-muted-foreground/50"
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)} className="appearance-none text-sm px-3 py-2 pr-8 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 w-[200px] text-foreground cursor-pointer">
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Connectors panel
═══════════════════════════════════════════ */
type ConnStatus = 'connected' | 'error' | 'disconnected' | 'reconnecting';
interface Conn {
  id: string; name: string; category: string; description: string;
  color: string; icon: React.ElementType; status: ConnStatus;
  permissions: string[]; lastSync?: string; health?: number;
}

const ALL_CONNECTORS: Conn[] = [
  { id: 'github',    name: 'GitHub',           category: 'Dev',           description: 'Access repos, issues, PRs, and CI status',                   color: '#1c1c1c', icon: GitBranch,    status: 'connected',    permissions: ['Repos (read)', 'Issues (read/write)', 'Webhooks'],        lastSync: '2 min ago',  health: 100 },
  { id: 'stripe',    name: 'Stripe',           category: 'Finance',       description: 'Manage payments, subscriptions, and customer records',        color: '#635bff', icon: CreditCard,   status: 'connected',    permissions: ['Charges (read)', 'Customers (read/write)', 'Webhooks'],    lastSync: '5 min ago',  health: 100 },
  { id: 'linear',    name: 'Linear',           category: 'Productivity',  description: 'Create issues, manage cycles, and read project status',       color: '#5e6ad2', icon: Zap,          status: 'error',        permissions: ['Issues (read/write)', 'Teams (read)', 'Projects (read)'],  lastSync: '3h ago',     health: 0 },
  { id: 'postgres',  name: 'PostgreSQL',       category: 'Data',          description: 'Query databases and use results inside agents or workflows',   color: '#336791', icon: Database,     status: 'connected',    permissions: ['Tables (read/write)', 'Schema (read)'],                    lastSync: '1 min ago',  health: 98 },
  { id: 'slack',     name: 'Slack',            category: 'Communication', description: 'Send messages and trigger workflows from Slack channels',      color: '#4a154b', icon: Slack,        status: 'disconnected', permissions: [],                                                          },
  { id: 'figma',     name: 'Figma',            category: 'Design',        description: 'Read design files, extract tokens, sync components to code',   color: '#f24e1e', icon: Figma,        status: 'disconnected', permissions: [] },
  { id: 'notion',    name: 'Notion',           category: 'Productivity',  description: 'Read and write Notion pages, databases, and blocks',           color: '#1c1c1c', icon: FileText,     status: 'disconnected', permissions: [] },
  { id: 'openai',    name: 'OpenAI',           category: 'AI',            description: 'Direct GPT-4o and Whisper access alongside the proxy',         color: '#10b981', icon: Bot,          status: 'connected',    permissions: ['Chat completions', 'Embeddings', 'Whisper'],               lastSync: '8 min ago',  health: 100 },
  { id: 'sendgrid',  name: 'SendGrid',         category: 'Communication', description: 'Send transactional and marketing emails from workflows',        color: '#1a82e2', icon: Mail,         status: 'error',        permissions: ['Mail send', 'Templates (read)'],                           lastSync: '1d ago',     health: 0 },
  { id: 'gsheets',   name: 'Google Sheets',    category: 'Data',          description: 'Read, write, and sync Google Sheets as a live data source',    color: '#34a853', icon: LayoutGrid,   status: 'disconnected', permissions: [] },
  { id: 'twilio',    name: 'Twilio',           category: 'Communication', description: 'Send SMS, WhatsApp, and voice calls from workflows',           color: '#f22f46', icon: MessageSquare, status: 'disconnected', permissions: [] },
  { id: 'vercel',    name: 'Vercel',           category: 'Dev',           description: 'Trigger deployments, check previews, and monitor builds',      color: '#1c1c1c', icon: Globe,        status: 'disconnected', permissions: [] },
];

const STATUS_CONFIG: Record<ConnStatus, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  connected:    { label: 'Connected',    icon: CheckCircle2, color: '#22c55e', bg: '#dcfce7' },
  error:        { label: 'Error',        icon: AlertCircle,  color: '#ef4444', bg: '#fee2e2' },
  disconnected: { label: 'Not connected',icon: XCircle,      color: '#9ca3af', bg: '#f3f4f6' },
  reconnecting: { label: 'Reconnecting', icon: Loader2,      color: '#f59e0b', bg: '#fef3c7' },
};

const CONN_CATS = ['All', 'Connected', 'Error', 'Productivity', 'Dev', 'Communication', 'Data', 'Finance', 'AI', 'Design'];

function ConnectorsPanel() {
  const [conns, setConns] = useState<Conn[]>(ALL_CONNECTORS);
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = conns.filter(c => {
    if (cat === 'Connected') return c.status === 'connected';
    if (cat === 'Error') return c.status === 'error';
    if (cat !== 'All' && !['Connected','Error'].includes(cat)) return c.category === cat;
    return true;
  }).filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const reconnect = (id: string) => {
    setConns(prev => prev.map(c => c.id === id ? { ...c, status: 'reconnecting' as ConnStatus } : c));
    setTimeout(() => {
      setConns(prev => prev.map(c => c.id === id ? { ...c, status: 'connected' as ConnStatus, lastSync: 'Just now', health: 100 } : c));
    }, 2000);
  };
  const disconnect = (id: string) => setConns(prev => prev.map(c => c.id === id ? { ...c, status: 'disconnected' as ConnStatus, permissions: [], lastSync: undefined, health: undefined } : c));
  const connect = (id: string) => setConns(prev => prev.map(c => c.id === id ? { ...c, status: 'connected' as ConnStatus, lastSync: 'Just now', health: 100, permissions: ['Basic access'] } : c));

  const connectedCount = conns.filter(c => c.status === 'connected').length;
  const errorCount = conns.filter(c => c.status === 'error').length;

  return (
    <div>
      <PanelHeader title="Connectors" desc="Manage third-party integrations, permissions, and connection health" />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Connected', value: connectedCount, color: '#22c55e', bg: '#dcfce7' },
          { label: 'Errors',    value: errorCount,     color: '#ef4444', bg: '#fee2e2' },
          { label: 'Available', value: conns.filter(c => c.status === 'disconnected').length, color: '#6b7280', bg: '#f3f4f6' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: s.bg }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[12px] font-semibold" style={{ color: s.color }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search connectors…" className="w-full text-xs pl-8 pr-3 py-2 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50" data-testid="input-conn-search" />
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-5">
        {CONN_CATS.map(c => (
          <button key={c} onClick={() => setCat(c)} className={cn('px-2.5 py-1 text-[10px] font-semibold rounded-full border transition-all', cat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>
            {c}
          </button>
        ))}
      </div>

      {/* Connector list */}
      <div className="flex flex-col gap-3">
        {filtered.map(conn => {
          const cfg = STATUS_CONFIG[conn.status];
          const isExpanded = expandedId === conn.id;
          const StatusIcon = cfg.icon;
          return (
            <div key={conn.id} className="bg-white border border-border rounded-2xl overflow-hidden transition-shadow hover:shadow-sm" data-testid={`conn-${conn.id}`}>
              <div className="flex items-center gap-4 px-5 py-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : conn.id)}>
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${conn.color}14` }}>
                  <conn.icon className="w-5 h-5" style={{ color: conn.color }} />
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-bold text-foreground">{conn.name}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-muted-foreground bg-[#f0f0f0]">{conn.category}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{conn.description}</p>
                </div>
                {/* Status */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: cfg.bg, color: cfg.color }}>
                    <StatusIcon className={cn('w-3 h-3', conn.status === 'reconnecting' && 'animate-spin')} />
                    {cfg.label}
                  </div>
                  {conn.status === 'error' && (
                    <button onClick={e => { e.stopPropagation(); reconnect(conn.id); }} className="px-2.5 py-1 text-[10px] font-semibold text-[#ef4444] border border-[#ef4444]/30 rounded-lg hover:bg-[#fee2e2] transition-colors flex items-center gap-1" data-testid={`reconnect-${conn.id}`}>
                      <RefreshCw className="w-3 h-3" /> Reconnect
                    </button>
                  )}
                  {conn.status === 'disconnected' && (
                    <button onClick={e => { e.stopPropagation(); connect(conn.id); }} className="px-2.5 py-1 text-[10px] font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-1" data-testid={`connect-${conn.id}`}>
                      <Plus className="w-3 h-3" /> Connect
                    </button>
                  )}
                  {conn.status === 'connected' && (
                    <button onClick={e => { e.stopPropagation(); disconnect(conn.id); }} className="p-1.5 text-muted-foreground/40 hover:text-[#ef4444] hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition-colors" data-testid={`disconnect-${conn.id}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ChevronRight className={cn('w-4 h-4 text-muted-foreground/40 transition-transform', isExpanded && 'rotate-90')} />
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-border/50">
                    <div className="px-5 py-4 bg-[#fafafa] grid grid-cols-2 gap-6">
                      {/* Permissions */}
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Permissions</p>
                        {conn.permissions.length > 0 ? (
                          <div className="flex flex-col gap-1.5">
                            {conn.permissions.map(p => (
                              <div key={p} className="flex items-center gap-1.5 text-[12px] text-foreground">
                                <Check className="w-3 h-3 text-primary shrink-0" /> {p}
                              </div>
                            ))}
                          </div>
                        ) : <p className="text-[12px] text-muted-foreground">Not connected — no permissions granted</p>}
                      </div>
                      {/* Health */}
                      <div>
                        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Health & Sync</p>
                        {conn.lastSync ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-[12px]">
                              <span className="text-muted-foreground">Last sync</span>
                              <span className="font-semibold text-foreground">{conn.lastSync}</span>
                            </div>
                            {conn.health !== undefined && (
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${conn.health}%`, background: conn.health > 80 ? '#22c55e' : conn.health > 50 ? '#f59e0b' : '#ef4444' }} />
                                </div>
                                <span className="text-[11px] font-bold text-foreground">{conn.health}%</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <button onClick={() => reconnect(conn.id)} className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                                <RefreshCw className="w-3 h-3" /> Refresh
                              </button>
                              <span className="text-muted-foreground/40">·</span>
                              <button className="text-[11px] font-semibold text-muted-foreground hover:underline">Edit scope</button>
                            </div>
                          </div>
                        ) : <p className="text-[12px] text-muted-foreground">No health data available</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Profile panel
═══════════════════════════════════════════ */
function ProfilePanel() {
  const [name, setName]         = useState('Alex Chen');
  const [email, setEmail]       = useState('alex@omni.ai');
  const [username, setUsername] = useState('alex-chen');
  const [bio, setBio]           = useState('Product lead & AI builder. Building the OS for intelligent work.');
  const [role, setRole]         = useState('Product Lead');
  const [timezone, setTimezone] = useState('Europe/Copenhagen');
  const [locale, setLocale]     = useState('en-DK');
  const [saved, setSaved]       = useState(false);

  return (
    <div>
      <PanelHeader title="Profile" desc="Your identity across OmniAI Hub" />

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6 p-5 bg-white border border-border rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-bold shrink-0">AC</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-foreground">Profile picture</p>
          <p className="text-[12px] text-muted-foreground mt-0.5">PNG, JPG up to 4 MB. Shown on your profile and in shared documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-border rounded-xl hover:bg-[#f5f5f5] transition-colors"><Upload className="w-3.5 h-3.5" /> Upload</button>
          <button className="p-2 text-muted-foreground hover:text-[#ef4444] border border-border rounded-xl hover:border-red-100 hover:bg-red-50 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field label="Full name" desc="Displayed on your profile and documents"><TextInput value={name} onChange={setName} /></Field>
        <Field label="Email address" desc="Used for notifications and account recovery"><TextInput value={email} onChange={setEmail} type="email" /></Field>
        <Field label="Username" desc="Your unique handle across OmniAI"><TextInput value={username} onChange={setUsername} /></Field>
        <Field label="Bio" desc="A short description shown on your public profile">
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} className="text-sm px-3 py-2 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all w-[280px] placeholder:text-muted-foreground/50" />
        </Field>
        <Field label="Role / Title"><TextInput value={role} onChange={setRole} placeholder="e.g. Product Manager" /></Field>
        <Field label="Timezone"><Select value={timezone} onChange={setTimezone} options={['Europe/Copenhagen','Europe/London','America/New_York','America/Los_Angeles','Asia/Tokyo','UTC']} /></Field>
        <Field label="Locale"><Select value={locale} onChange={setLocale} options={['en-DK','en-US','en-GB','da-DK','de-DE','fr-FR','ja-JP']} /></Field>
      </div>

      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Personalization panel
═══════════════════════════════════════════ */
function PersonalizationPanel() {
  const [lang, setLang]             = useState('English (UK)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [startupView, setStartupView] = useState('Home');
  const [compactMode, setCompactMode] = useState(false);
  const [autoSave, setAutoSave]     = useState(true);
  const [sidebarLabels, setSidebarLabels] = useState(true);
  const [saved, setSaved]           = useState(false);

  return (
    <div>
      <PanelHeader title="Personalization" desc="Language, format preferences, and workspace behaviour" />
      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field label="Language"><Select value={lang} onChange={setLang} options={['English (UK)','English (US)','Danish','German','French','Japanese']} /></Field>
        <Field label="Date format"><Select value={dateFormat} onChange={setDateFormat} options={['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD']} /></Field>
        <Field label="Startup view" desc="The page shown when you open OmniAI"><Select value={startupView} onChange={setStartupView} options={['Home','Chats','Projects','Inbox']} /></Field>
        <Field label="Auto-save" desc="Save documents and changes automatically every 30 seconds"><Toggle on={autoSave} onChange={setAutoSave} /></Field>
        <Field label="Sidebar labels" desc="Show text labels next to sidebar icons"><Toggle on={sidebarLabels} onChange={setSidebarLabels} /></Field>
        <Field label="Compact mode" desc="Reduce spacing in lists and panels for more content density"><Toggle on={compactMode} onChange={setCompactMode} /></Field>
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Traits panel
═══════════════════════════════════════════ */
const EXPERTISE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const COMM_STYLES = ['Concise', 'Detailed', 'Direct', 'Friendly', 'Technical', 'Executive'];
const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Education', 'Legal', 'Consulting'];

function TraitsPanel() {
  const [preferredName, setPreferredName] = useState('Alex');
  const [pronouns, setPronouns]           = useState('he/him');
  const [expertise, setExpertise]         = useState('Advanced');
  const [industry, setIndustry]           = useState('Technology');
  const [commStyle, setCommStyle]         = useState<string[]>(['Concise', 'Direct']);
  const [saved, setSaved]                 = useState(false);

  const toggleStyle = (s: string) => setCommStyle(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  return (
    <div>
      <PanelHeader title="Traits" desc="Help OmniAI understand who you are so it can adapt to your context" />

      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field label="Preferred name" desc="What the AI should call you in conversation"><TextInput value={preferredName} onChange={setPreferredName} placeholder="Your first name or nickname" /></Field>
        <Field label="Pronouns"><Select value={pronouns} onChange={setPronouns} options={['he/him','she/her','they/them','prefer not to say']} /></Field>
        <Field label="Expertise level" desc="Your overall technical and domain experience">
          <div className="flex gap-2">
            {EXPERTISE_LEVELS.map(l => (
              <button key={l} onClick={() => setExpertise(l)} className={cn('px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all', expertise === l ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>{l}</button>
            ))}
          </div>
        </Field>
        <Field label="Industry / Domain"><Select value={industry} onChange={setIndustry} options={INDUSTRIES} /></Field>
        <Field label="Communication style" desc="How you prefer responses to be written — select all that apply">
          <div className="flex flex-wrap gap-1.5 max-w-[280px]">
            {COMM_STYLES.map(s => (
              <button key={s} onClick={() => toggleStyle(s)} className={cn('px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all', commStyle.includes(s) ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>{s}</button>
            ))}
          </div>
        </Field>
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Custom Instructions panel
═══════════════════════════════════════════ */
function InstructionsPanel() {
  const [about, setAbout]        = useState("I'm a product lead at a B2B SaaS company building AI-native tools. I work across product strategy, design, and engineering. I value clarity, speed, and well-reasoned decisions over lengthy explanations.");
  const [respond, setRespond]    = useState("Be direct and concise. Prefer bullet points for multi-step answers. Use markdown formatting when the output is for a document. Avoid generic phrases like 'Certainly!' or 'Great question!' — just get to the answer.");
  const [allChats, setAllChats]  = useState(true);
  const [allAgents, setAllAgents] = useState(true);
  const [saved, setSaved]        = useState(false);

  return (
    <div>
      <PanelHeader title="Custom Instructions" desc="Give OmniAI persistent context so every response starts closer to what you need" />
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <div className="mb-5">
          <label className="text-sm font-semibold text-foreground block mb-1.5">What should OmniAI know about you?</label>
          <p className="text-[12px] text-muted-foreground mb-2.5">Background, role, goals, or anything else that gives context to your requests.</p>
          <textarea value={about} onChange={e => setAbout(e.target.value)} rows={5} className="w-full text-sm px-4 py-3 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" data-testid="textarea-about" />
          <p className="text-[11px] text-muted-foreground mt-1 text-right">{about.length} / 1500 characters</p>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground block mb-1.5">How should OmniAI respond?</label>
          <p className="text-[12px] text-muted-foreground mb-2.5">Tone, format, length, things to avoid, or specific response patterns you prefer.</p>
          <textarea value={respond} onChange={e => setRespond(e.target.value)} rows={5} className="w-full text-sm px-4 py-3 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed" data-testid="textarea-respond" />
          <p className="text-[11px] text-muted-foreground mt-1 text-right">{respond.length} / 1500 characters</p>
        </div>
      </div>
      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field label="Apply to all conversations" desc="Use these instructions in every new chat automatically"><Toggle on={allChats} onChange={setAllChats} /></Field>
        <Field label="Apply to all agents" desc="Agents will also receive your custom instructions as context"><Toggle on={allAgents} onChange={setAllAgents} /></Field>
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Models & Defaults panel
═══════════════════════════════════════════ */
interface ModelOption { id: string; name: string; provider: string; desc: string; speed: 'Fast' | 'Medium' | 'Powerful'; ctx: string; }
const MODELS: ModelOption[] = [
  { id: 'm1', name: 'Gemini 2.0 Flash',  provider: 'Google',    desc: 'Best balance of speed and quality for everyday tasks', speed: 'Fast',     ctx: '128K' },
  { id: 'm2', name: 'Claude 3.5 Haiku',  provider: 'Anthropic', desc: 'Fast, efficient, great for reasoning and writing',      speed: 'Fast',     ctx: '200K' },
  { id: 'm3', name: 'GPT-4o Mini',       provider: 'OpenAI',    desc: 'Compact, versatile model for structured tasks',        speed: 'Fast',     ctx: '128K' },
  { id: 'm4', name: 'Gemini 2.0 Pro',    provider: 'Google',    desc: 'Maximum reasoning and multimodal capability',          speed: 'Powerful', ctx: '1M' },
  { id: 'm5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', desc: 'State-of-the-art reasoning for complex problems',      speed: 'Medium',   ctx: '200K' },
  { id: 'm6', name: 'GPT-4o',            provider: 'OpenAI',    desc: 'Flagship multimodal model with vision and code',       speed: 'Powerful', ctx: '128K' },
];

const SPEED_COLOR: Record<string, string> = { Fast: '#22c55e', Medium: '#f59e0b', Powerful: '#7c3aed' };
const PROVIDER_COLOR: Record<string, string> = { Google: '#4285f4', Anthropic: '#c084fc', OpenAI: '#10b981' };

function ModelsPanel() {
  const [defaultModel, setDefaultModel] = useState('m1');
  const [style, setStyle]               = useState('Concise');
  const [temp, setTemp]                 = useState(0.7);
  const [memory, setMemory]             = useState(true);
  const [codeModel, setCodeModel]       = useState('m5');
  const [saved, setSaved]               = useState(false);

  return (
    <div>
      <PanelHeader title="Models & Defaults" desc="Choose which AI models to use and configure default behaviour" />

      <div className="mb-5">
        <p className="text-sm font-bold text-foreground mb-3">Default model</p>
        <div className="grid grid-cols-1 gap-2">
          {MODELS.map(m => (
            <button key={m.id} onClick={() => setDefaultModel(m.id)} className={cn('flex items-center gap-4 p-4 rounded-2xl border text-left transition-all', defaultModel === m.id ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30')} data-testid={`model-${m.id}`}>
              <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0', defaultModel === m.id ? 'border-primary' : 'border-border')}>
                {defaultModel === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[13px] font-bold text-foreground">{m.name}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${PROVIDER_COLOR[m.provider]}18`, color: PROVIDER_COLOR[m.provider] }}>{m.provider}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{m.desc}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${SPEED_COLOR[m.speed]}18`, color: SPEED_COLOR[m.speed] }}>{m.speed}</span>
                <span className="text-[10px] text-muted-foreground">{m.ctx} ctx</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field label="Response style" desc="Default tone applied to new conversations">
          <div className="flex gap-2">
            {['Concise','Detailed','Creative'].map(s => (
              <button key={s} onClick={() => setStyle(s)} className={cn('px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all', style === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>{s}</button>
            ))}
          </div>
        </Field>
        <Field label="Temperature" desc={`Controls creativity vs predictability — currently ${temp.toFixed(1)}`}>
          <div className="flex items-center gap-3 w-[200px]">
            <span className="text-[10px] text-muted-foreground shrink-0">Precise</span>
            <input type="range" min={0} max={1} step={0.1} value={temp} onChange={e => setTemp(parseFloat(e.target.value))} className="flex-1 accent-primary cursor-pointer" />
            <span className="text-[10px] text-muted-foreground shrink-0">Creative</span>
          </div>
        </Field>
        <Field label="Conversation memory" desc="Allow the model to remember context across sessions"><Toggle on={memory} onChange={setMemory} /></Field>
        <Field label="Default code model" desc="Model used for code generation and review">
          <Select value={codeModel} onChange={setCodeModel} options={MODELS.map(m => m.id)} />
        </Field>
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Signatures panel
═══════════════════════════════════════════ */
interface Sig { id: string; name: string; body: string; isDefault: boolean }
function SignaturesPanel() {
  const [sigs, setSigs] = useState<Sig[]>([
    { id: 's1', name: 'Work',     body: 'Alex Chen\nProduct Lead, OmniAI\nalex@omni.ai | omni.ai', isDefault: true },
    { id: 's2', name: 'Personal', body: 'Alex\n–', isDefault: false },
  ]);
  const [editing, setEditing] = useState<string | null>('s1');
  const [preview, setPreview] = useState(false);
  const [saved, setSaved]     = useState(false);

  const active = sigs.find(s => s.id === editing);
  const setDefault = (id: string) => setSigs(prev => prev.map(s => ({ ...s, isDefault: s.id === id })));
  const updateBody = (body: string) => setSigs(prev => prev.map(s => s.id === editing ? { ...s, body } : s));
  const addSig = () => { const id = `s${Date.now()}`; setSigs(prev => [...prev, { id, name: 'New signature', body: '', isDefault: false }]); setEditing(id); };
  const deleteSig = (id: string) => { setSigs(prev => prev.filter(s => s.id !== id)); if (editing === id) setEditing(sigs[0]?.id ?? null); };

  return (
    <div>
      <PanelHeader title="Signatures" desc="Email signatures auto-appended to drafted replies in Inbox" />
      <div className="flex gap-4">
        {/* Sidebar list */}
        <div className="w-44 shrink-0">
          <div className="flex flex-col gap-1 mb-3">
            {sigs.map(s => (
              <button key={s.id} onClick={() => setEditing(s.id)} className={cn('flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left text-[12px] font-semibold transition-all border', editing === s.id ? 'bg-primary/8 text-primary border-primary/20' : 'text-muted-foreground hover:bg-[#f5f5f5] border-transparent')} data-testid={`sig-${s.id}`}>
                <span className="truncate">{s.name}</span>
                {s.isDefault && <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-primary/10 text-primary shrink-0">Default</span>}
              </button>
            ))}
          </div>
          <button onClick={addSig} className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors w-full"><Plus className="w-3 h-3" /> Add signature</button>
        </div>

        {/* Editor */}
        {active ? (
          <div className="flex-1 bg-white border border-border rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <input value={active.name} onChange={e => setSigs(prev => prev.map(s => s.id === editing ? { ...s, name: e.target.value } : s))} className="text-sm font-bold text-foreground bg-transparent border-b border-border outline-none focus:border-primary/40 pb-0.5 flex-1" />
              <button onClick={() => setPreview(v => !v)} className={cn('flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all', preview ? 'bg-primary/8 text-primary border-primary/20' : 'border-border text-muted-foreground hover:bg-[#f5f5f5]')}>
                <Eye className="w-3 h-3" /> {preview ? 'Edit' : 'Preview'}
              </button>
              <button onClick={() => setDefault(active.id)} className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all', active.isDefault ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30')}>{active.isDefault ? '✓ Default' : 'Set default'}</button>
              <button onClick={() => deleteSig(active.id)} className="p-1.5 text-muted-foreground/40 hover:text-[#ef4444] hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            {preview ? (
              <div className="flex-1 p-4 bg-[#f9fafb] rounded-xl border border-border text-sm text-foreground leading-relaxed whitespace-pre-wrap font-mono">{active.body || <span className="text-muted-foreground">Empty signature</span>}</div>
            ) : (
              <textarea value={active.body} onChange={e => updateBody(e.target.value)} rows={6} placeholder="Type your signature here…" className="flex-1 text-sm px-4 py-3 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 resize-none font-mono" data-testid="sig-editor" />
            )}
          </div>
        ) : <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">Select a signature to edit</div>}
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Notifications panel
═══════════════════════════════════════════ */
interface NotifRow { id: string; label: string; desc: string; email: boolean; inApp: boolean; push: boolean }
function NotificationsPanel() {
  const [rows, setRows] = useState<NotifRow[]>([
    { id: 'n1', label: 'Workflow completions',  desc: 'When an automated workflow finishes a run',              email: true,  inApp: true,  push: false },
    { id: 'n2', label: 'Agent messages',        desc: 'When an agent sends you a message or finishes a task',   email: false, inApp: true,  push: true  },
    { id: 'n3', label: 'Team mentions',         desc: 'When someone @mentions you in a shared document',        email: true,  inApp: true,  push: true  },
    { id: 'n4', label: 'Design sync updates',   desc: 'When a design system finishes syncing tokens',           email: false, inApp: true,  push: false },
    { id: 'n5', label: 'Security alerts',       desc: 'Login from new device, connector errors, permission changes', email: true, inApp: true, push: true },
    { id: 'n6', label: 'Weekly digest',         desc: 'Summary of activity, metrics, and top workflows',        email: true,  inApp: false, push: false },
    { id: 'n7', label: 'Product updates',       desc: 'New features and platform announcements',                email: false, inApp: true,  push: false },
    { id: 'n8', label: 'Inbox emails',          desc: 'New messages in your OmniAI Inbox',                     email: false, inApp: true,  push: true  },
  ]);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, channel: 'email' | 'inApp' | 'push') => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [channel]: !r[channel] } : r));
  };

  const CHANNELS: { key: 'email' | 'inApp' | 'push'; label: string; icon: React.ElementType }[] = [
    { key: 'email', label: 'Email', icon: Mail },
    { key: 'inApp', label: 'In-app', icon: Bell },
    { key: 'push',  label: 'Push',   icon: Smartphone },
  ];

  return (
    <div>
      <PanelHeader title="Notifications" desc="Choose how and where you hear from OmniAI" />
      <div className="bg-white border border-border rounded-2xl overflow-hidden mb-5">
        {/* Header row */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-border bg-[#f9fafb]">
          <div className="flex-1" />
          {CHANNELS.map(ch => (
            <div key={ch.key} className="w-16 flex flex-col items-center gap-1 shrink-0">
              <ch.icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground">{ch.label}</span>
            </div>
          ))}
        </div>
        {rows.map(row => (
          <div key={row.id} className="flex items-center gap-4 px-5 py-4 border-b border-border/50 last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{row.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{row.desc}</p>
            </div>
            {CHANNELS.map(ch => (
              <div key={ch.key} className="w-16 flex justify-center shrink-0">
                <Toggle on={row[ch.key]} onChange={() => toggle(row.id, ch.key)} label={`${row.label} ${ch.label}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Appearance panel
═══════════════════════════════════════════ */
const ACCENT_COLORS = ['#004E51','#2563eb','#7c3aed','#dc2626','#ea580c','#16a34a','#0891b2','#be185d','#1c1c1c'];

function AppearancePanel() {
  const [theme, setTheme]       = useState<'light'|'dark'|'system'>('light');
  const [accent, setAccent]     = useState('#004E51');
  const [fontSize, setFontSize] = useState<'sm'|'md'|'lg'>('md');
  const [density, setDensity]   = useState<'compact'|'default'|'comfortable'>('default');
  const [animations, setAnimations] = useState(true);
  const [reduced, setReduced]   = useState(false);
  const [saved, setSaved]       = useState(false);

  return (
    <div>
      <PanelHeader title="Appearance" desc="Theme, spacing, and visual preferences" />

      {/* Theme */}
      <div className="mb-5">
        <p className="text-sm font-bold text-foreground mb-3">Theme</p>
        <div className="flex gap-3">
          {([
            { id: 'light',  label: 'Light',  icon: Sun },
            { id: 'dark',   label: 'Dark',   icon: Moon },
            { id: 'system', label: 'System', icon: Monitor },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTheme(t.id)} className={cn('flex-1 flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all', theme === t.id ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30')} data-testid={`theme-${t.id}`}>
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', theme === t.id ? 'bg-primary text-primary-foreground' : 'bg-[#f0f0f0] text-muted-foreground')}>
                <t.icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className={cn('text-[13px] font-bold', theme === t.id ? 'text-primary' : 'text-foreground')}>{t.label}</p>
                {t.id === 'system' && <p className="text-[10px] text-muted-foreground mt-0.5">Follows OS</p>}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent color */}
      <div className="bg-white border border-border rounded-2xl p-5 mb-4">
        <p className="text-sm font-bold text-foreground mb-3">Accent colour</p>
        <div className="flex items-center gap-3">
          {ACCENT_COLORS.map(c => (
            <button key={c} onClick={() => setAccent(c)} className={cn('w-8 h-8 rounded-full transition-all border-2', accent === c ? 'border-foreground scale-110' : 'border-transparent hover:scale-105')} style={{ background: c }} data-testid={`accent-${c}`} />
          ))}
          <div className="ml-2 flex items-center gap-2 text-[12px] text-muted-foreground">
            <div className="w-5 h-5 rounded-full" style={{ background: accent }} />
            <code className="font-mono">{accent}</code>
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field label="Font size" desc="Adjusts text size across the interface">
          <div className="flex gap-2">
            {([['sm','Small'],['md','Medium'],['lg','Large']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setFontSize(id)} className={cn('px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all', fontSize === id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>{label}</button>
            ))}
          </div>
        </Field>
        <Field label="Density" desc="Controls spacing between elements">
          <div className="flex gap-2">
            {(['compact','default','comfortable'] as const).map(d => (
              <button key={d} onClick={() => setDensity(d)} className={cn('px-3 py-1.5 text-[11px] font-semibold rounded-lg border transition-all capitalize', density === d ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 bg-white')}>{d}</button>
            ))}
          </div>
        </Field>
        <Field label="Animations" desc="Enable transitions and motion effects throughout the UI"><Toggle on={animations} onChange={setAnimations} /></Field>
        <Field label="Reduced motion" desc="Override animations for accessibility, ignoring system setting"><Toggle on={reduced} onChange={setReduced} /></Field>
      </div>
      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Speech & Voice panel
═══════════════════════════════════════════ */
const TTS_PREVIEW_TEXT: Record<string, string> = {
  'da': 'Hej, dette er en stemmeprøve på dansk.',
  'sv': 'Hej, det här är ett röstprov på svenska.',
  'nb': 'Hei, dette er en stemmeprøve på norsk.',
  'fi': 'Hei, tämä on äänennäyte suomeksi.',
  'de': 'Hallo, dies ist eine Stimmprobe auf Deutsch.',
  'fr': 'Bonjour, ceci est un essai vocal en français.',
  'es': 'Hola, esta es una muestra de voz en español.',
  'it': 'Ciao, questo è un esempio vocale in italiano.',
  'pt': 'Olá, esta é uma amostra de voz em português.',
  'nl': 'Hallo, dit is een spraakvoorbeeld in het Nederlands.',
  'pl': 'Cześć, to jest próbka głosu po polsku.',
  'tr': 'Merhaba, bu Türkçe bir ses örneğidir.',
  'ru': 'Привет, это образец голоса на русском.',
  'ar': 'مرحبا، هذه عينة صوتية باللغة العربية.',
  'hi': 'नमस्ते, यह हिंदी में एक आवाज़ का नमूना है।',
  'ja': 'こんにちは、これは日本語の音声サンプルです。',
  'ko': '안녕하세요, 이것은 한국어 음성 샘플입니다.',
  'zh': '你好，这是一段中文语音示例。',
  'en': 'Hi, this is a quick voice sample in English.',
};

function previewTextFor(lang: string): string {
  const base = lang.toLowerCase().split(/[-_]/)[0];
  return TTS_PREVIEW_TEXT[base] ?? TTS_PREVIEW_TEXT.en;
}

function SpeechPanel() {
  const settings = useSpeechSettings();
  const voices = useAvailableVoices();
  const [saved, setSaved] = useState(false);
  const [previewing, setPreviewing] = useState(false);

  const langPrefix = settings.recognitionLang.toLowerCase().split(/[-_]/)[0];
  // Voices whose own locale matches the chosen language come first; the rest
  // are still selectable so users can deliberately mix (e.g. an English voice
  // reading Danish words).
  const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(langPrefix));
  const otherVoices = voices.filter(v => !v.lang.toLowerCase().startsWith(langPrefix));
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const hasAnyVoice = voices.length > 0;
  const selectedVoice = resolveVoice(voices, settings.ttsVoiceURI);

  const setLang = (code: string) => {
    setSpeechSettings({ recognitionLang: code });
    setSaved(false);
  };

  const setVoiceURI = (uri: string) => {
    setSpeechSettings({ ttsVoiceURI: uri === '' ? null : uri });
    setSaved(false);
  };

  const previewVoice = async () => {
    if (!ttsSupported) return;
    setPreviewing(true);
    try {
      await speak(previewTextFor(settings.recognitionLang), {
        lang: settings.recognitionLang,
        voice: selectedVoice,
      });
    } finally {
      setPreviewing(false);
    }
  };

  const stopPreview = () => {
    cancelSpeak();
    setPreviewing(false);
  };

  const resetDefaults = () => {
    cancelSpeak();
    setPreviewing(false);
    resetSpeechSettings();
    setSaved(false);
  };

  return (
    <div>
      <PanelHeader
        title="Speech & Voice"
        desc="Pick the language used for voice input and dictation, and the voice used for spoken replies."
      />

      <div className="bg-white border border-border rounded-2xl px-5 py-1 mb-5">
        <Field
          label="Speech recognition language"
          desc="The locale sent to the speech recogniser when you use voice or dictate. Affects both browser and server backends."
        >
          <div className="relative">
            <select
              value={settings.recognitionLang}
              onChange={e => setLang(e.target.value)}
              className="appearance-none text-sm px-3 py-2 pr-8 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 w-[260px] text-foreground cursor-pointer"
              data-testid="select-speech-language"
            >
              {RECOGNITION_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label} — {l.code}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </Field>

        <Field
          label="Spoken-reply voice"
          desc={
            !ttsSupported
              ? 'This browser does not support speech synthesis.'
              : !hasAnyVoice
              ? 'Voices are still loading from your browser. Try again in a moment.'
              : `Used for replies in voice mode. ${matchingVoices.length} voice${matchingVoices.length === 1 ? '' : 's'} match your language; ${otherVoices.length} other${otherVoices.length === 1 ? '' : 's'} available.`
          }
        >
          <div className="relative">
            <select
              value={settings.ttsVoiceURI ?? ''}
              onChange={e => setVoiceURI(e.target.value)}
              disabled={!ttsSupported || !hasAnyVoice}
              className={cn(
                'appearance-none text-sm px-3 py-2 pr-8 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20 w-[260px] text-foreground cursor-pointer',
                (!ttsSupported || !hasAnyVoice) && 'opacity-50 cursor-not-allowed',
              )}
              data-testid="select-speech-voice"
            >
              <option value="">Browser default for {settings.recognitionLang}</option>
              {matchingVoices.length > 0 && (
                <optgroup label={`Voices for ${settings.recognitionLang}`}>
                  {matchingVoices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang}){v.default ? ' — default' : ''}
                    </option>
                  ))}
                </optgroup>
              )}
              {otherVoices.length > 0 && (
                <optgroup label="Other voices">
                  {otherVoices.map(v => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </Field>

        <Field
          label="Preview voice"
          desc="Hear a short sample using your selected language and voice."
        >
          <div className="flex items-center gap-2">
            {previewing ? (
              <button
                onClick={stopPreview}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-border rounded-xl hover:bg-[#f5f5f5] transition-colors"
                data-testid="btn-stop-voice-preview"
              >
                <X className="w-3.5 h-3.5" /> Stop
              </button>
            ) : (
              <button
                onClick={previewVoice}
                disabled={!ttsSupported}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-primary/20 text-primary rounded-xl hover:bg-primary/5 transition-colors',
                  !ttsSupported && 'opacity-50 cursor-not-allowed hover:bg-transparent',
                )}
                data-testid="btn-play-voice-preview"
              >
                <Play className="w-3.5 h-3.5" /> Play sample
              </button>
            )}
            <button
              onClick={resetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-border text-muted-foreground rounded-xl hover:bg-[#f5f5f5] hover:text-foreground transition-colors"
              data-testid="btn-reset-speech-settings"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset to default
            </button>
          </div>
        </Field>
      </div>

      <div className="rounded-2xl bg-[#f9fafb] border border-border p-4 mb-5 text-[12px] text-muted-foreground leading-relaxed">
        <p className="font-semibold text-foreground mb-1">Heads up</p>
        Browser speech recognition is only available in Chromium-based browsers (Chrome, Edge, Brave) and falls back to server transcription elsewhere. Available voices vary per OS and browser.
      </div>

      <SaveBar onSave={() => setSaved(true)} saved={saved} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Root: SettingsView
═══════════════════════════════════════════ */
const PANEL_MAP: Record<SettingsSection, React.ComponentType> = {
  connectors:      ConnectorsPanel,
  profile:         ProfilePanel,
  personalization: PersonalizationPanel,
  traits:          TraitsPanel,
  instructions:    InstructionsPanel,
  models:          ModelsPanel,
  signatures:      SignaturesPanel,
  notifications:   NotificationsPanel,
  appearance:      AppearancePanel,
  speech:          SpeechPanel,
};

export function SettingsView() {
  const [section, setSection] = useState<SettingsSection>('connectors');
  const ActivePanel = PANEL_MAP[section];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left nav */}
      <div className="w-[220px] shrink-0 border-r border-border bg-white flex flex-col overflow-y-auto">
        <div className="px-5 py-4 border-b border-border">
          <h1 className="text-base font-bold text-foreground">Settings</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">Workspace & preferences</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider px-3 mb-1">{group.label}</p>
              <div className="flex flex-col gap-0.5">
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={cn('flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all text-left relative overflow-hidden', section === item.id ? 'bg-[#f0f0f0] text-foreground font-semibold' : 'text-muted-foreground hover:bg-[#f5f5f5] hover:text-foreground')}
                    data-testid={`settings-nav-${item.id}`}
                  >
                    {section === item.id && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full" />}
                    <item.icon className={cn('w-3.5 h-3.5 shrink-0', section === item.id ? 'text-primary' : '')} />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#fafafa]">
        <div className="max-w-[820px] px-8 py-7">
          <AnimatePresence mode="wait">
            <motion.div key={section} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18, ease: [0.16,1,0.3,1] }}>
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
