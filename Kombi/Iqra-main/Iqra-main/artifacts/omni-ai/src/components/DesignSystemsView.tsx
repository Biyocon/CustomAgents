import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Globe,
  Upload,
  FileText,
  ChevronRight,
  Check,
  RefreshCw,
  Edit3,
  Eye,
  Download,
  MoreHorizontal,
  Search,
  Zap,
  Copy,
  Trash2,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  X,
  Link,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Types ──────────────────────────────────────────── */
type SyncStatus = 'synced' | 'modified' | 'syncing';
type ActiveTab = 'overview' | 'tokens' | 'spec';
type ImportMode = 'website' | 'file' | 'create' | null;

interface DesignSystem {
  id: string;
  name: string;
  desc: string;
  status: 'active' | 'idle';
  colors: string[];
  usage: number;
  lastEdited: string;
  author: string;
  badge?: string;
}

/* ── Static data ────────────────────────────────────── */
const SYSTEMS: DesignSystem[] = [
  { id: 'omni',       name: 'OmniAI Default',        desc: 'Deep teal, mint accent, platform default',         status: 'active', colors: ['#004E51','#43FFC8','#fafafa'],   usage: 5, lastEdited: '1h ago',  author: 'Alex Chen', badge: 'Global' },
  { id: 'iif',        name: 'Institutional IIF',      desc: 'Enterprise-grade structured layouts',              status: 'active', colors: ['#0f172a','#1e3a8a','#f3f4f6'],   usage: 3, lastEdited: '2h ago',  author: 'Alex Chen', badge: 'Global' },
  { id: 'alexandria', name: 'Alexandria',             desc: 'Warm editorial, humanist type',                    status: 'idle',   colors: ['#e26d5c','#1e3a8a','#fdf6ee'],   usage: 1, lastEdited: '3d ago',  author: 'Alex Chen' },
  { id: 'bauhaus',    name: 'Bauhaus',                desc: 'Geometric minimal, bold contrasts',                status: 'idle',   colors: ['#dc2626','#171717','#fbbf24'],   usage: 0, lastEdited: '1w ago',  author: 'Alex Chen' },
  { id: 'glacier',    name: 'Glacier',                desc: 'Arctic clean, high-contrast whites',               status: 'idle',   colors: ['#e0f2fe','#bae6fd','#f8fbff'],   usage: 0, lastEdited: '1w ago',  author: 'Alex Chen' },
];

type TokenMap = Record<string, string>;

const DEFAULT_TOKENS: TokenMap = {
  'color-primary':     '#004E51',
  'color-accent':      '#43FFC8',
  'color-background':  '#FAFAFA',
  'color-foreground':  '#1C1C1C',
  'color-muted':       '#F5F5F5',
  'color-border':      '#E0E0E0',
  'color-destructive': '#E11D48',
  'font-sans':         'Inter',
  'font-serif':        'Georgia',
  'font-mono':         'Menlo',
  'text-xs':           '11px',
  'text-sm':           '13px',
  'text-base':         '15px',
  'text-lg':           '18px',
  'text-xl':           '20px',
  'text-2xl':          '24px',
  'text-3xl':          '32px',
  'space-1':           '4px',
  'space-2':           '8px',
  'space-3':           '12px',
  'space-4':           '16px',
  'space-6':           '24px',
  'space-8':           '32px',
  'space-12':          '48px',
  'radius-sm':         '6px',
  'radius-md':         '8px',
  'radius-lg':         '16px',
  'radius-xl':         '24px',
  'radius-full':       '9999px',
  'shadow-sm':         '0 2px 4px rgba(0,0,0,0.06)',
  'shadow-md':         '0 4px 16px rgba(0,0,0,0.08)',
};

const TOKEN_GROUPS = [
  { id: 'colors',     label: 'Colors',      keys: ['color-primary','color-accent','color-background','color-foreground','color-muted','color-border','color-destructive'] },
  { id: 'typography', label: 'Typography',  keys: ['font-sans','font-serif','font-mono','text-xs','text-sm','text-base','text-lg','text-xl','text-2xl','text-3xl'] },
  { id: 'spacing',    label: 'Spacing',     keys: ['space-1','space-2','space-3','space-4','space-6','space-8','space-12'] },
  { id: 'radius',     label: 'Border Radius', keys: ['radius-sm','radius-md','radius-lg','radius-xl','radius-full'] },
  { id: 'shadows',    label: 'Shadows',     keys: ['shadow-sm','shadow-md'] },
];

const INITIAL_SPEC = `# OmniAI Hub — Design System

## 1. Identity
OmniAI Hub is the OS for your AI workspaces. The identity is professional, highly functional, and refined — focusing on clarity over decoration.

## 2. Color Tokens
- **Primary**: #004E51 (Deep Teal)
- **Accent**: #43FFC8 (Mint Cyan)
- **Background**: #FAFAFA
- **Foreground**: #1C1C1C
- **Border**: #E0E0E0

## 3. Typography
- **Sans Serif**: Inter, sans-serif
- **Serif**: Georgia, serif
- **Monospace**: Menlo, monospace

### Scale
- **xs**: 11px — Labels, captions
- **sm**: 13px — Secondary text
- **base**: 15px — Body
- **lg**: 18px — Subheadings
- **xl**: 20px — Section headings
- **3xl**: 32px — Page titles

## 4. Spacing Scale (4px base)
- **space-1**: 4px
- **space-2**: 8px
- **space-3**: 12px
- **space-4**: 16px
- **space-6**: 24px
- **space-8**: 32px
- **space-12**: 48px

## 5. Border Radius
- **sm**: 6px — Chips, badges
- **md**: 8px — Buttons, inputs
- **lg**: 16px — Cards
- **xl**: 24px — Panels, modals

## 6. Shadow System
- **sm**: \`0 2px 4px rgba(0,0,0,0.06)\`
- **md**: \`0 4px 16px rgba(0,0,0,0.08)\`

## 7. Component Notes
- Cards always use **border + shadow-sm** (never just shadow)
- Buttons: rounded-md, 38px height, font-medium
- Inputs: bordered, bg-muted on idle, ring on focus
- Active states always use **primary** colour as left accent
`;

/* ── Helpers ────────────────────────────────────────── */
const isColorKey = (k: string) => k.startsWith('color-');
const isFontKey  = (k: string) => k.startsWith('font-');

function SyncBadge({ status }: { status: SyncStatus }) {
  return (
    <motion.div
      key={status}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        'flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors',
        status === 'synced'   && 'bg-green-50 text-green-600 border border-green-200',
        status === 'modified' && 'bg-amber-50 text-amber-600 border border-amber-200',
        status === 'syncing'  && 'bg-blue-50 text-blue-600 border border-blue-200',
      )}
    >
      {status === 'synced'   && <><CheckCircle2 className="w-3 h-3" /> Synced</>}
      {status === 'modified' && <><AlertCircle  className="w-3 h-3" /> Unsaved changes</>}
      {status === 'syncing'  && <><Loader2 className="w-3 h-3 animate-spin" /> Syncing…</>}
    </motion.div>
  );
}

/* ── Live Preview ────────────────────────────────────── */
function TokenPreview({ tokens }: { tokens: TokenMap }) {
  const p   = tokens['color-primary']    || '#004E51';
  const acc = tokens['color-accent']     || '#43FFC8';
  const bg  = tokens['color-background'] || '#FAFAFA';
  const fg  = tokens['color-foreground'] || '#1C1C1C';
  const bdr = tokens['color-border']     || '#E0E0E0';
  const mut = tokens['color-muted']      || '#F5F5F5';
  const rMd = tokens['radius-md']        || '8px';
  const rLg = tokens['radius-lg']        || '16px';
  const shd = tokens['shadow-sm']        || '0 2px 4px rgba(0,0,0,0.06)';

  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border" style={{ background: bg, borderColor: bdr }}>
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: p }}>Preview · Live</p>

      {/* Card */}
      <div className="flex flex-col gap-3 p-4 rounded-[var(--r)] border" style={{ background: '#fff', borderColor: bdr, borderRadius: rLg, boxShadow: shd, ['--r' as string]: rLg }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[var(--rm)] flex items-center justify-center" style={{ background: `${p}18`, borderRadius: rMd, ['--rm' as string]: rMd }}>
            <Sparkles className="w-4 h-4" style={{ color: p }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none" style={{ color: fg }}>Sample Card</p>
            <p className="text-xs mt-0.5" style={{ color: '#888' }}>Card description</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#666' }}>
          This card previews the current token values in real-time as you edit the theme.
        </p>
        <div className="flex gap-2">
          <button className="text-xs font-semibold px-3 py-1.5" style={{ background: p, color: '#fff', borderRadius: rMd }}>Primary</button>
          <button className="text-xs font-semibold px-3 py-1.5 border" style={{ background: mut, color: fg, borderColor: bdr, borderRadius: rMd }}>Secondary</button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'Active',     bg: `${p}18`,   color: p },
          { label: 'Accent',     bg: `${acc}40`, color: '#0e5a4d' },
          { label: 'Muted',      bg: mut,         color: '#666' },
        ].map(b => (
          <span key={b.label} className="text-[11px] font-semibold px-2.5 py-1" style={{ background: b.bg, color: b.color, borderRadius: '9999px' }}>
            {b.label}
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2 border" style={{ background: mut, borderColor: bdr, borderRadius: rMd }}>
        <Search className="w-3.5 h-3.5" style={{ color: '#999' }} />
        <span className="text-xs" style={{ color: '#aaa' }}>Search…</span>
      </div>

      {/* Colour chips */}
      <div className="flex gap-2">
        {[p, acc, bg, bdr, mut].map((c, i) => (
          <div key={i} className="w-6 h-6 rounded-full border border-black/10 shadow-sm" style={{ background: c }} title={c} />
        ))}
      </div>
    </div>
  );
}

/* ── Import Modal ────────────────────────────────────── */
function ImportModal({ mode, onClose }: { mode: ImportMode; onClose: () => void }) {
  const [url, setUrl]           = useState('');
  const [name, setName]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1600);
  };

  if (!mode) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[24px] border border-border shadow-2xl w-full max-w-md p-6 flex flex-col gap-5"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === 'website' && 'Import from website'}
              {mode === 'file'    && 'Import DESIGN.md'}
              {mode === 'create'  && 'Create design system'}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === 'website' && 'Enter a URL — we\'ll extract tokens from the site\'s CSS'}
              {mode === 'file'    && 'Upload or paste your DESIGN.md file'}
              {mode === 'create'  && 'Start fresh with a blank design system'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!done ? (
          <>
            {/* Name field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">System Name</label>
              <input
                placeholder="e.g. Stripe Dashboard"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-sm border border-border rounded-xl px-3 py-2.5 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/60 transition-all"
                data-testid="input-ds-name"
              />
            </div>

            {/* Mode-specific fields */}
            {mode === 'website' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Website URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      placeholder="https://stripe.com"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      className="w-full text-sm border border-border rounded-xl pl-9 pr-3 py-2.5 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/60 transition-all"
                      data-testid="input-ds-url"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">OmniAI will scrape CSS variables, fonts, and visual patterns from the page.</p>
              </div>
            )}

            {mode === 'file' && (
              <div className="flex flex-col gap-3">
                <label
                  className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-2xl bg-[#f7f7f7] hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                  data-testid="dropzone-design-file"
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-border shadow-sm flex items-center justify-center">
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">Drop DESIGN.md here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                  <input type="file" className="hidden" accept=".md,.txt" />
                </label>
                <div className="relative flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-[11px] text-muted-foreground">or paste content</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <textarea
                  placeholder="# My Design System&#10;&#10;## Colors&#10;..."
                  rows={4}
                  className="w-full text-xs font-mono border border-border rounded-xl px-3 py-2.5 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 resize-none placeholder:text-muted-foreground/60"
                  data-testid="textarea-design-paste"
                />
              </div>
            )}

            {mode === 'create' && (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Start from preset</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Blank', 'OmniAI Default', 'Minimal Dark', 'Editorial'].map(preset => (
                      <button
                        key={preset}
                        className="text-left text-sm font-medium border border-border rounded-xl px-3 py-2.5 hover:border-primary/40 hover:bg-primary/5 transition-all"
                        data-testid={`preset-${preset.toLowerCase().replace(/\s/g,'-')}`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !name.trim()}
              className="w-full bg-primary hover:bg-[#003a3d] text-primary-foreground text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              data-testid="button-import-submit"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {mode === 'website' ? 'Fetch & Import' : mode === 'file' ? 'Import File' : 'Create System'}
            </button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-3 py-6 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">System imported!</p>
              <p className="text-sm text-muted-foreground mt-0.5">"{name}" has been added to your workspace.</p>
            </div>
            <button onClick={onClose} className="mt-2 text-sm font-semibold text-primary hover:underline">
              Open editor →
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Main View ──────────────────────────────────────── */
export function DesignSystemsView() {
  const [selectedId,  setSelectedId]  = useState<string>('omni');
  const [activeTab,   setActiveTab]   = useState<ActiveTab>('overview');
  const [importMode,  setImportMode]  = useState<ImportMode>(null);
  const [tokens,      setTokens]      = useState<TokenMap>(DEFAULT_TOKENS);
  const [syncStatus,  setSyncStatus]  = useState<SyncStatus>('synced');
  const [specContent, setSpecContent] = useState(INITIAL_SPEC);
  const [specMode,    setSpecMode]    = useState<'edit' | 'preview'>('edit');
  const [specSync,    setSpecSync]    = useState<SyncStatus>('synced');
  const [search,      setSearch]      = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['colors']);

  const selected = SYSTEMS.find(s => s.id === selectedId)!;

  /* token editing */
  const updateToken = useCallback((key: string, value: string) => {
    setTokens(prev => ({ ...prev, [key]: value }));
    setSyncStatus('modified');
  }, []);

  const saveTokens = () => {
    setSyncStatus('syncing');
    setTimeout(() => setSyncStatus('synced'), 1500);
  };

  const resetTokens = () => {
    setTokens(DEFAULT_TOKENS);
    setSyncStatus('modified');
  };

  /* spec editing */
  const updateSpec = (v: string) => { setSpecContent(v); setSpecSync('modified'); };
  const saveSpec   = () => { setSpecSync('syncing'); setTimeout(() => setSpecSync('synced'), 1200); };

  const toggleGroup = (id: string) =>
    setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);

  const filteredSystems = SYSTEMS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Import modal */}
      <AnimatePresence>
        {importMode && <ImportModal mode={importMode} onClose={() => setImportMode(null)} />}
      </AnimatePresence>

      <div className="flex h-full overflow-hidden">

        {/* ── Left: Systems list ───────────────── */}
        <div className="w-[260px] xl:w-[280px] bg-white border-r border-border flex flex-col shrink-0 overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b border-border shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[13px] font-bold text-foreground">Design Systems</h2>
              <button
                onClick={() => setImportMode('create')}
                className="flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/8 hover:bg-primary/15 px-2 py-1 rounded-lg transition-colors"
                data-testid="button-new-ds"
              >
                <Plus className="w-3 h-3" /> New
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-[#f5f5f5] border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
                data-testid="input-search-ds"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto py-2">
            {filteredSystems.map(sys => (
              <button
                key={sys.id}
                onClick={() => { setSelectedId(sys.id); setActiveTab('overview'); }}
                className={cn(
                  'w-full flex flex-col gap-2 px-4 py-3 text-left transition-colors border-l-2',
                  selectedId === sys.id
                    ? 'bg-primary/5 border-l-primary'
                    : 'border-l-transparent hover:bg-[#f7f7f7] hover:border-l-border'
                )}
                data-testid={`ds-list-${sys.id}`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex -space-x-1.5 shrink-0">
                      {sys.colors.map((c, i) => (
                        <div key={i} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c, zIndex: 10 - i }} />
                      ))}
                    </div>
                    <span className={cn('text-[12px] font-semibold truncate', selectedId === sys.id ? 'text-primary' : 'text-foreground')}>
                      {sys.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {sys.badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{sys.badge}</span>
                    )}
                    <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', sys.status === 'active' ? 'bg-green-500' : 'bg-gray-300')} />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{sys.desc}</p>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span>{sys.usage} projects</span>
                  <span>·</span>
                  <span>{sys.lastEdited}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Import actions */}
          <div className="p-3 border-t border-border flex flex-col gap-1.5 shrink-0">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1 mb-1">Import</p>
            {[
              { icon: Globe,    label: 'From website',   mode: 'website' as ImportMode },
              { icon: Upload,   label: 'Import DESIGN.md', mode: 'file' as ImportMode },
            ].map(opt => (
              <button
                key={opt.mode}
                onClick={() => setImportMode(opt.mode)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#f5f5f5] text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`btn-import-${opt.mode}`}
              >
                <opt.icon className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[12px] font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Right: Detail panel ──────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* System header */}
          <div className="bg-white border-b border-border px-6 py-4 shrink-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex -space-x-2 shrink-0">
                  {selected.colors.map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: c, zIndex: 10 - i }} />
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-foreground truncate">{selected.name}</h1>
                    {selected.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary shrink-0">{selected.badge}</span>
                    )}
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                      selected.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500'
                    )}>
                      {selected.status === 'active' ? '● Active' : '○ Idle'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{selected.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-lg hover:bg-muted/50 transition-colors" data-testid="button-ds-export">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-muted/50 transition-colors" data-testid="button-ds-more">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-end gap-0 -mb-4 mt-4 overflow-x-auto scrollbar-none">
              {([
                { id: 'overview', label: 'Overview' },
                { id: 'tokens',   label: 'Theme Tokens' },
                { id: 'spec',     label: 'Design Spec' },
              ] as { id: ActiveTab; label: string }[]).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                  data-testid={`tab-ds-${tab.id}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">

              {/* ── Overview ─────────────────────── */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1000px]"
                >
                  {/* Stats */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Projects using', value: selected.usage.toString() },
                        { label: 'Last edited',    value: selected.lastEdited },
                        { label: 'Author',         value: selected.author },
                      ].map(stat => (
                        <div key={stat.label} className="bg-white border border-border rounded-2xl p-4 shadow-[var(--shadow-card)]">
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                          <p className="text-lg font-bold text-foreground">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Color palette */}
                    <div className="bg-white border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Colour Palette</p>
                      <div className="flex flex-wrap gap-3">
                        {[
                          { name: 'Primary',    key: 'color-primary' },
                          { name: 'Accent',     key: 'color-accent' },
                          { name: 'Background', key: 'color-background' },
                          { name: 'Foreground', key: 'color-foreground' },
                          { name: 'Border',     key: 'color-border' },
                          { name: 'Muted',      key: 'color-muted' },
                        ].map(c => (
                          <div key={c.name} className="flex flex-col items-center gap-1.5">
                            <div className="w-10 h-10 rounded-xl border border-black/10 shadow-sm" style={{ backgroundColor: tokens[c.key] }} />
                            <span className="text-[10px] font-medium text-muted-foreground">{c.name}</span>
                            <span className="text-[9px] font-mono text-muted-foreground/60">{tokens[c.key]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Token summary */}
                    <div className="bg-white border border-border rounded-2xl p-5 shadow-[var(--shadow-card)]">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Token Summary</p>
                      <div className="grid grid-cols-2 gap-3">
                        {TOKEN_GROUPS.map(g => (
                          <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/60 last:border-0">
                            <span className="text-sm text-muted-foreground">{g.label}</span>
                            <span className="text-sm font-semibold text-foreground">{g.keys.length} tokens</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right sidebar */}
                  <div className="flex flex-col gap-4">
                    {/* Quick actions */}
                    <div className="bg-white border border-border rounded-2xl p-4 shadow-[var(--shadow-card)]">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
                      <div className="flex flex-col gap-1">
                        {[
                          { icon: Edit3,       label: 'Edit tokens',   tab: 'tokens' as ActiveTab },
                          { icon: FileText,    label: 'Edit spec',     tab: 'spec' as ActiveTab },
                          { icon: Copy,        label: 'Duplicate',     tab: null },
                          { icon: ExternalLink,label: 'Open in Stitch',tab: null },
                          { icon: Download,    label: 'Export',        tab: null },
                          { icon: Trash2,      label: 'Delete',        tab: null },
                        ].map(action => (
                          <button
                            key={action.label}
                            onClick={() => action.tab && setActiveTab(action.tab)}
                            className={cn(
                              'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left',
                              action.label === 'Delete'
                                ? 'text-red-500 hover:bg-red-50'
                                : 'text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5]'
                            )}
                            data-testid={`action-${action.label.toLowerCase().replace(' ','-')}`}
                          >
                            <action.icon className="w-3.5 h-3.5 shrink-0" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Linked projects */}
                    <div className="bg-white border border-border rounded-2xl p-4 shadow-[var(--shadow-card)]">
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Used in Projects</p>
                      {selected.usage > 0 ? (
                        <div className="flex flex-col gap-2">
                          {Array.from({ length: Math.min(selected.usage, 3) }, (_, i) => (
                            <div key={i} className="flex items-center gap-2 py-1.5 hover:bg-[#f5f5f5] -mx-2 px-2 rounded-lg cursor-pointer transition-colors">
                              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selected.colors[0] }} />
                              <span className="text-[12px] font-medium text-foreground truncate">
                                {['Landing Page Redesign', 'Brand Guidelines', 'Product Launch Plan', 'API Documentation'][i]}
                              </span>
                              <ChevronRight className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">No projects using this system yet.</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Tokens Editor ───────────────── */}
              {activeTab === 'tokens' && (
                <motion.div
                  key="tokens"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full"
                >
                  {/* Token editor sidebar */}
                  <div className="w-[320px] xl:w-[360px] border-r border-border bg-white flex flex-col overflow-hidden shrink-0">
                    {/* Save bar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                      <SyncBadge status={syncStatus} />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={resetTokens}
                          title="Reset to defaults"
                          className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                          data-testid="button-reset-tokens"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={saveTokens}
                          disabled={syncStatus !== 'modified'}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-[#003a3d] transition-colors disabled:opacity-40"
                          data-testid="button-save-tokens"
                        >
                          {syncStatus === 'syncing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Save & Sync
                        </button>
                      </div>
                    </div>

                    {/* Token groups */}
                    <div className="flex-1 overflow-y-auto">
                      {TOKEN_GROUPS.map(group => {
                        const isOpen = expandedGroups.includes(group.id);
                        return (
                          <div key={group.id} className="border-b border-border/60 last:border-0">
                            <button
                              onClick={() => toggleGroup(group.id)}
                              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-[#f7f7f7] transition-colors"
                              data-testid={`group-${group.id}`}
                            >
                              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{group.label}</span>
                              <ChevronRight className={cn('w-3.5 h-3.5 text-muted-foreground transition-transform', isOpen && 'rotate-90')} />
                            </button>
                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: 'auto' }}
                                  exit={{ height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-3 flex flex-col gap-2">
                                    {group.keys.map(key => (
                                      <div key={key} className="flex items-center gap-3">
                                        {isColorKey(key) && (
                                          <div className="relative shrink-0">
                                            <div className="w-6 h-6 rounded border border-black/10 shadow-sm cursor-pointer" style={{ backgroundColor: tokens[key] }} />
                                            <input
                                              type="color"
                                              value={tokens[key]}
                                              onChange={e => updateToken(key, e.target.value)}
                                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                              data-testid={`color-picker-${key}`}
                                            />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-[10px] font-mono text-muted-foreground/70 truncate">--{key}</p>
                                          <input
                                            type="text"
                                            value={tokens[key]}
                                            onChange={e => updateToken(key, e.target.value)}
                                            className={cn(
                                              'w-full text-xs font-mono bg-[#f5f5f5] border border-border/60 rounded-md px-2 py-1 outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/40 transition-all',
                                              isFontKey(key) && 'font-sans'
                                            )}
                                            data-testid={`token-input-${key}`}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live preview */}
                  <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 min-w-0" style={{ background: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-bold text-foreground">Live Preview</p>
                      <div className="flex items-center gap-2">
                        <SyncBadge status={syncStatus} />
                        <span className="text-xs text-muted-foreground">Updates on edit</span>
                      </div>
                    </div>
                    <div className="max-w-sm">
                      <TokenPreview tokens={tokens} />
                    </div>
                    {/* Typography specimen */}
                    <div className="max-w-sm bg-white border border-border rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Typography</p>
                      {[
                        { size: tokens['text-3xl'] || '32px', weight: '700', label: 'Page Title' },
                        { size: tokens['text-xl']  || '20px', weight: '600', label: 'Section Heading' },
                        { size: tokens['text-base']|| '15px', weight: '400', label: 'Body text' },
                        { size: tokens['text-sm']  || '13px', weight: '400', label: 'Small / muted' },
                      ].map((t, i) => (
                        <div key={i} className="flex items-baseline justify-between gap-3">
                          <span style={{ fontFamily: tokens['font-sans'], fontSize: `min(${t.size}, 24px)`, fontWeight: t.weight, color: tokens['color-foreground'] || '#1c1c1c' }}>
                            Aa
                          </span>
                          <div className="text-right">
                            <p className="text-[11px] font-medium text-foreground">{t.label}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{t.size} / {t.weight}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Spacing ruler */}
                    <div className="max-w-sm bg-white border border-border rounded-2xl p-5 shadow-[var(--shadow-card)] flex flex-col gap-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Spacing Scale</p>
                      {['space-1','space-2','space-3','space-4','space-6','space-8'].map(key => (
                        <div key={key} className="flex items-center gap-3">
                          <div className="h-3 rounded-sm shrink-0" style={{ width: tokens[key] || '16px', background: tokens['color-primary'] || '#004E51', opacity: 0.7, minWidth: 2, maxWidth: 80 }} />
                          <span className="text-[11px] font-mono text-muted-foreground">{tokens[key]}</span>
                          <span className="text-[10px] text-muted-foreground/60">{key}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Spec Editor ─────────────────── */}
              {activeTab === 'spec' && (
                <motion.div
                  key="spec"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-full"
                >
                  {/* Editor */}
                  <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                    {/* Spec toolbar */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="flex bg-[#f0f0f0] p-0.5 rounded-lg">
                          {(['edit','preview'] as const).map(m => (
                            <button
                              key={m}
                              onClick={() => setSpecMode(m)}
                              className={cn(
                                'flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all capitalize',
                                specMode === m ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                              )}
                              data-testid={`spec-mode-${m}`}
                            >
                              {m === 'edit' ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                              {m}
                            </button>
                          ))}
                        </div>
                        <SyncBadge status={specSync} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground hidden sm:block">{specContent.length} chars</span>
                        <button
                          onClick={saveSpec}
                          disabled={specSync !== 'modified'}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-[#003a3d] transition-colors disabled:opacity-40"
                          data-testid="button-save-spec"
                        >
                          {specSync === 'syncing' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                          Save
                        </button>
                        <button className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors" data-testid="button-download-spec">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Editor / Preview area */}
                    {specMode === 'edit' ? (
                      <textarea
                        value={specContent}
                        onChange={e => updateSpec(e.target.value)}
                        className="flex-1 font-mono text-sm text-foreground leading-relaxed px-6 py-5 resize-none outline-none bg-white"
                        spellCheck={false}
                        data-testid="textarea-spec"
                      />
                    ) : (
                      <div className="flex-1 overflow-y-auto px-6 py-5 bg-white">
                        <div className="max-w-[700px] prose prose-sm">
                          {specContent.split('\n').map((line, i) => {
                            if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold mt-6 mb-2 text-foreground">{line.slice(3)}</h2>;
                            if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold mt-4 mb-1.5 text-foreground">{line.slice(4)}</h3>;
                            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mb-3 text-foreground">{line.slice(2)}</h1>;
                            if (line.startsWith('- **')) {
                              const match = line.match(/^- \*\*(.+?)\*\*: (.+)$/);
                              if (match) return (
                                <div key={i} className="flex gap-2 text-sm mb-1">
                                  <span className="font-semibold text-foreground min-w-[120px]">{match[1]}</span>
                                  <span className="text-muted-foreground font-mono text-xs mt-0.5">{match[2]}</span>
                                </div>
                              );
                            }
                            if (line.startsWith('- ')) return <li key={i} className="text-sm text-muted-foreground ml-4 mb-0.5">{line.slice(2)}</li>;
                            if (line === '') return <div key={i} className="h-2" />;
                            return <p key={i} className="text-sm text-muted-foreground mb-1">{line}</p>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Spec metadata sidebar */}
                  <div className="w-[240px] border-l border-border bg-white flex flex-col p-4 gap-4 shrink-0 hidden lg:flex overflow-y-auto">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">File Info</p>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-muted-foreground">File</span><span className="font-mono font-medium text-foreground">DESIGN.md</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Size</span><span className="font-medium text-foreground">{(specContent.length / 1024).toFixed(1)} KB</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Lines</span><span className="font-medium text-foreground">{specContent.split('\n').length}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Modified</span><span className="font-medium text-foreground">Just now</span></div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Sections</p>
                      <div className="flex flex-col gap-1">
                        {specContent.split('\n').filter(l => l.startsWith('## ')).map((h, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer transition-colors py-0.5">
                            <div className="w-1 h-1 rounded-full bg-border shrink-0" />
                            {h.slice(3)}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Sync Status</p>
                      <SyncBadge status={specSync} />
                      {specSync === 'modified' && (
                        <p className="text-[10px] text-muted-foreground mt-2">Unsaved changes won't be reflected in Stitch until you save.</p>
                      )}
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Used In</p>
                      {['Stitch Canvas', 'Landing Page Redesign'].map(p => (
                        <div key={p} className="text-[11px] text-muted-foreground flex items-center gap-1 py-0.5">
                          <Zap className="w-2.5 h-2.5 shrink-0" />{p}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
}
