import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Link2, Mail, Check, Copy, Users, GitFork, Share2,
  FileText, FileSpreadsheet, Image, Code2, Globe, Package,
  Download, ChevronDown, Upload, FolderOpen, Database, Search,
  Shield, Lock, Eye, EyeOff, Trash2, Plus, Crown,
  File, Paperclip, BookOpen, ExternalLink, ArrowRight,
  CheckCircle2, AlertCircle, RefreshCw, Loader2, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════
   Context
═══════════════════════════════════════════ */
export type ModalType = 'share' | 'export' | 'attach' | 'permissions' | null;
export interface ModalMeta { title?: string; resourceType?: string }

interface ModalCtx {
  open: (type: ModalType, meta?: ModalMeta) => void;
  close: () => void;
  type: ModalType;
  meta: ModalMeta;
}

const Ctx = createContext<ModalCtx>({ open: () => {}, close: () => {}, type: null, meta: {} });

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState<ModalType>(null);
  const [meta, setMeta] = useState<ModalMeta>({});
  const open = useCallback((t: ModalType, m: ModalMeta = {}) => { setType(t); setMeta(m); }, []);
  const close = useCallback(() => setType(null), []);
  return <Ctx.Provider value={{ open, close, type, meta }}>{children}</Ctx.Provider>;
}

export const useModal = () => useContext(Ctx);

/* ═══════════════════════════════════════════
   Shared primitives
═══════════════════════════════════════════ */
function Overlay({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      key="overlay"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-[60]"
      onClick={onClick}
    />
  );
}

function ModalShell({ width = 520, title, icon: Icon, onClose, children, 'data-testid': testId }: {
  width?: number; title: string; icon?: React.ElementType; onClose: () => void;
  children: React.ReactNode; 'data-testid'?: string;
}) {
  return (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 8 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{ width: Math.min(width, window.innerWidth - 32) }}
      data-testid={testId}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          {Icon && <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center"><Icon className="w-3.5 h-3.5 text-primary" /></div>}
          <h2 className="text-[14px] font-bold text-foreground">{title}</h2>
        </div>
        <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors" data-testid="btn-modal-close">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="overflow-y-auto max-h-[80vh]">{children}</div>
    </motion.div>
  );
}

function SlidePanel({ side = 'right', width = 440, title, icon: Icon, onClose, children, 'data-testid': testId }: {
  side?: 'right' | 'bottom'; width?: number; title: string; icon?: React.ElementType;
  onClose: () => void; children: React.ReactNode; 'data-testid'?: string;
}) {
  return (
    <motion.div
      key="panel"
      initial={{ x: side === 'right' ? '100%' : 0, y: side === 'bottom' ? '100%' : 0 }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: side === 'right' ? '100%' : 0, y: side === 'bottom' ? '100%' : 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-0 top-0 bottom-0 z-[70] bg-white shadow-2xl border-l border-border flex flex-col"
      style={{ width }}
      data-testid={testId}
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2.5">
          {Icon && <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center"><Icon className="w-3.5 h-3.5 text-primary" /></div>}
          <h2 className="text-[14px] font-bold text-foreground">{title}</h2>
        </div>
        <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </motion.div>
  );
}

function TabBar({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="flex gap-0 border-b border-border px-5 bg-[#fafafa]">
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)}
          className={cn('px-4 py-3 text-[13px] font-semibold border-b-2 -mb-px transition-colors', active === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
          data-testid={`tab-${t.toLowerCase().replace(/\s/g,'-')}`}
        >{t}</button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   1. Share / Remix Modal
═══════════════════════════════════════════ */
interface Collaborator { id: string; name: string; email: string; role: string; isOwner?: boolean; avatar: string }
const COLLABS: Collaborator[] = [
  { id: 'c1', name: 'Alex Chen',    email: 'alex@omni.ai',    role: 'Owner',  isOwner: true, avatar: 'AC' },
  { id: 'c2', name: 'Mia Johansson',email: 'mia@team.io',    role: 'Editor', avatar: 'MJ' },
  { id: 'c3', name: 'Lars Eriksen', email: 'lars@design.co',  role: 'Viewer', avatar: 'LE' },
];

function ShareModal({ onClose, meta }: { onClose: () => void; meta: ModalMeta }) {
  const [tab, setTab]           = useState('Share');
  const [copied, setCopied]     = useState(false);
  const [invite, setInvite]     = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [linkAccess, setLinkAccess] = useState('View');
  const [collabs, setCollabs]   = useState(COLLABS);
  const [forkName, setForkName] = useState(`Copy of ${meta.title || 'Untitled'}`);
  const [forkIncludes, setForkIncludes] = useState({ content: true, settings: true, data: false, members: false });
  const [forking, setForking]   = useState(false);
  const [forked, setForked]     = useState(false);

  const copyLink = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const sendInvite = () => { if (!invite.trim()) return; setCollabs(p => [...p, { id: `c${Date.now()}`, name: invite.split('@')[0], email: invite, role: inviteRole, avatar: invite.slice(0,2).toUpperCase() }]); setInvite(''); };
  const fork = () => { setForking(true); setTimeout(() => { setForking(false); setForked(true); }, 1800); };
  const removeCollab = (id: string) => setCollabs(p => p.filter(c => c.id !== id));
  const updateRole = (id: string, role: string) => setCollabs(p => p.map(c => c.id === id ? { ...c, role } : c));

  return (
    <ModalShell title={`Share "${meta.title || 'Document'}"`} icon={Share2} onClose={onClose} data-testid="modal-share">
      <TabBar tabs={['Share', 'Remix']} active={tab} onChange={setTab} />

      {tab === 'Share' && (
        <div className="p-5 flex flex-col gap-5">
          {/* Link row */}
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Share link</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-border rounded-xl bg-[#f5f5f5]">
                <Link2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-[12px] text-muted-foreground truncate flex-1">https://omni.ai/d/abc123xyz</span>
                <div className="relative">
                  <select value={linkAccess} onChange={e => setLinkAccess(e.target.value)} className="appearance-none text-[11px] font-semibold text-primary bg-transparent pr-4 cursor-pointer outline-none">
                    {['View','Comment','Edit'].map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-primary pointer-events-none" />
                </div>
              </div>
              <button onClick={copyLink} className={cn('flex items-center gap-1.5 px-3 py-2.5 text-[12px] font-semibold rounded-xl border transition-all shrink-0', copied ? 'bg-[#22c55e] text-white border-[#22c55e]' : 'border-border bg-white hover:bg-[#f5f5f5]')} data-testid="btn-copy-link">
                {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
              </button>
            </div>
          </div>

          {/* Invite */}
          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Invite people</p>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-border rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input value={invite} onChange={e => setInvite(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendInvite()} placeholder="Email address" className="flex-1 text-[13px] outline-none placeholder:text-muted-foreground/50" data-testid="input-invite-email" />
              </div>
              <div className="relative">
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="appearance-none text-[12px] font-semibold px-3 py-2.5 border border-border rounded-xl bg-white pr-7 cursor-pointer outline-none focus:ring-2 focus:ring-primary/20">
                  {['Editor','Commenter','Viewer'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
              </div>
              <button onClick={sendInvite} className="px-4 py-2.5 bg-primary text-primary-foreground text-[12px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors shrink-0" data-testid="btn-send-invite">Invite</button>
            </div>
          </div>

          {/* Collaborators */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">People with access</p>
            {collabs.map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#f9fafb] transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">{c.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.email}</p>
                </div>
                {c.isOwner ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg"><Crown className="w-3 h-3" /> Owner</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select value={c.role} onChange={e => updateRole(c.id, e.target.value)} className="appearance-none text-[12px] font-medium px-2 py-1 rounded-lg bg-[#f5f5f5] border-0 cursor-pointer outline-none pr-5">
                        {['Editor','Commenter','Viewer'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground pointer-events-none" />
                    </div>
                    <button onClick={() => removeCollab(c.id)} className="p-1 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Remix' && (
        <div className="p-5 flex flex-col gap-5">
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <GitFork className="w-4 h-4 text-primary" />
              <p className="text-[13px] font-bold text-primary">Remix this resource</p>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">Creates a personal copy you can modify freely without affecting the original. Your fork is private by default.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Name your fork</label>
            <input value={forkName} onChange={e => setForkName(e.target.value)} className="text-[13px] px-3 py-2.5 border border-border rounded-xl bg-[#f5f5f5] outline-none focus:ring-2 focus:ring-primary/20" data-testid="input-fork-name" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Include in fork</p>
            {([['content','All content and documents'],['settings','Configurations and settings'],['data','Connected data sources'],['members','Current team members']] as const).map(([k, label]) => (
              <label key={k} className="flex items-center gap-3 px-3 py-3 rounded-xl border border-border hover:bg-[#f9fafb] cursor-pointer transition-colors">
                <div onClick={() => setForkIncludes(p => ({ ...p, [k]: !p[k as keyof typeof p] }))} className={cn('w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all', forkIncludes[k as keyof typeof forkIncludes] ? 'bg-primary border-primary' : 'border-border')}>
                  {forkIncludes[k as keyof typeof forkIncludes] && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className="text-[13px] text-foreground font-medium">{label}</span>
              </label>
            ))}
          </div>

          {forked ? (
            <div className="flex items-center gap-2 p-4 bg-[#dcfce7] rounded-2xl text-[#16a34a]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <div>
                <p className="text-[13px] font-bold">Fork created!</p>
                <p className="text-[12px]">"{forkName}" is ready in your Projects</p>
              </div>
              <button className="ml-auto flex items-center gap-1 text-[12px] font-semibold hover:underline">Open <ArrowRight className="w-3 h-3" /></button>
            </div>
          ) : (
            <button onClick={fork} disabled={forking} className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground text-[13px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors disabled:opacity-70" data-testid="btn-fork">
              {forking ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating fork…</> : <><GitFork className="w-4 h-4" /> Create fork</>}
            </button>
          )}
        </div>
      )}
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════
   2. Export Panel
═══════════════════════════════════════════ */
type ExportFmt = 'pdf' | 'docx' | 'xlsx' | 'png' | 'markdown' | 'html' | 'json' | 'csv';
interface FmtDef { label: string; ext: string; icon: React.ElementType; desc: string; color: string }
const FORMATS: Record<ExportFmt, FmtDef> = {
  pdf:      { label: 'PDF',       ext: '.pdf',  icon: FileText,       desc: 'Portable document, print-ready',        color: '#ef4444' },
  docx:     { label: 'Word',      ext: '.docx', icon: FileText,       desc: 'Microsoft Word compatible',             color: '#2563eb' },
  xlsx:     { label: 'Excel',     ext: '.xlsx', icon: FileSpreadsheet, desc: 'Spreadsheet with formulas preserved',  color: '#16a34a' },
  png:      { label: 'PNG',       ext: '.png',  icon: Image,          desc: 'High-resolution image export',          color: '#7c3aed' },
  markdown: { label: 'Markdown',  ext: '.md',   icon: Code2,          desc: 'Plain text with formatting syntax',     color: '#0891b2' },
  html:     { label: 'HTML',      ext: '.html', icon: Globe,          desc: 'Standalone web page',                   color: '#f59e0b' },
  json:     { label: 'JSON',      ext: '.json', icon: Code2,          desc: 'Structured data format',                color: '#6b7280' },
  csv:      { label: 'CSV',       ext: '.csv',  icon: FileSpreadsheet, desc: 'Comma-separated values',              color: '#10b981' },
};

function ExportPanel({ onClose, meta }: { onClose: () => void; meta: ModalMeta }) {
  const [fmt, setFmt]         = useState<ExportFmt>('pdf');
  const [filename, setFilename] = useState(meta.title || 'document');
  const [quality, setQuality] = useState<'standard'|'high'|'print'>('standard');
  const [includeMeta, setIncludeMeta] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone]       = useState(false);
  const [pageSize, setPageSize] = useState('A4');
  const [orientation, setOrientation] = useState('Portrait');

  const doExport = () => {
    setExporting(true); setProgress(0); setDone(false);
    const iv = setInterval(() => setProgress(p => { if (p >= 100) { clearInterval(iv); setExporting(false); setDone(true); return 100; } return p + 12; }), 180);
  };

  const F = FORMATS[fmt];

  return (
    <SlidePanel title="Export" icon={Download} onClose={onClose} data-testid="panel-export" width={400}>
      <div className="p-5 flex flex-col gap-5">
        {/* Format grid */}
        <div>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Format</p>
          <div className="grid grid-cols-4 gap-2">
            {(Object.keys(FORMATS) as ExportFmt[]).map(f => {
              const Def = FORMATS[f];
              return (
                <button key={f} onClick={() => { setFmt(f); setDone(false); }} className={cn('flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all text-center', fmt === f ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30')} data-testid={`fmt-${f}`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${Def.color}18` }}>
                    <Def.icon className="w-3.5 h-3.5" style={{ color: Def.color }} />
                  </div>
                  <span className={cn('text-[10px] font-bold', fmt === f ? 'text-primary' : 'text-foreground')}>{Def.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filename */}
        <div>
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Filename</p>
          <div className="flex items-center border border-border rounded-xl overflow-hidden bg-[#f5f5f5] focus-within:ring-2 focus-within:ring-primary/20">
            <input value={filename} onChange={e => setFilename(e.target.value)} className="flex-1 text-[13px] px-3 py-2.5 bg-transparent outline-none" data-testid="input-filename" />
            <span className="px-3 text-[12px] text-muted-foreground font-medium border-l border-border bg-white py-2.5 shrink-0">{F.ext}</span>
          </div>
        </div>

        {/* Format-specific options */}
        <div className="flex flex-col gap-2.5 p-4 bg-[#f9fafb] rounded-2xl border border-border">
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Options</p>
          {fmt === 'pdf' && (<>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-foreground">Quality</span>
              <div className="flex gap-1">
                {(['standard','high','print'] as const).map(q => (
                  <button key={q} onClick={() => setQuality(q)} className={cn('px-2 py-1 text-[10px] font-semibold rounded-md capitalize transition-all', quality === q ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground')}>{q}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-foreground">Page size</span>
              <div className="relative">
                <select value={pageSize} onChange={e => setPageSize(e.target.value)} className="appearance-none text-[12px] font-medium px-2 py-1 pr-6 rounded-lg bg-white border border-border cursor-pointer outline-none">
                  {['A4','Letter','A3'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-foreground">Orientation</span>
              <div className="flex gap-1">
                {['Portrait','Landscape'].map(o => (
                  <button key={o} onClick={() => setOrientation(o)} className={cn('px-2 py-1 text-[10px] font-semibold rounded-md transition-all', orientation === o ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground')}>{o}</button>
                ))}
              </div>
            </div>
          </>)}
          {fmt === 'png' && (
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-foreground">Resolution</span>
              <div className="flex gap-1">
                {['1x','2x','3x'].map(r => (
                  <button key={r} className={cn('px-2 py-1 text-[10px] font-semibold rounded-md transition-all', r === '2x' ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground')}>{r}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-foreground">Include metadata</span>
            <button onClick={() => setIncludeMeta(v => !v)} className={cn('w-8 h-4.5 rounded-full transition-colors relative shrink-0', includeMeta ? 'bg-primary' : 'bg-[#d1d5db]')} style={{ height: '20px' }}>
              <span className={cn('absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform', includeMeta ? 'translate-x-3.5' : '')} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-foreground">Include comments</span>
            <button onClick={() => setIncludeComments(v => !v)} className={cn('w-8 rounded-full transition-colors relative shrink-0', includeComments ? 'bg-primary' : 'bg-[#d1d5db]')} style={{ height: '20px' }}>
              <span className={cn('absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-transform', includeComments ? 'translate-x-3.5' : '')} />
            </button>
          </div>
        </div>

        {/* Progress / Export */}
        {exporting && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-[12px]">
              <span className="text-muted-foreground">Preparing export…</span>
              <span className="font-semibold text-foreground">{progress}%</span>
            </div>
            <div className="h-1.5 bg-[#e5e7eb] rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.15 }} />
            </div>
          </div>
        )}

        {done && (
          <div className="flex items-center gap-2.5 p-3.5 bg-[#dcfce7] rounded-xl text-[#16a34a]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold">Export ready</p>
              <p className="text-[11px] truncate">{filename}{F.ext}</p>
            </div>
            <button className="flex items-center gap-1 text-[12px] font-semibold hover:underline shrink-0"><Download className="w-3.5 h-3.5" /> Save</button>
          </div>
        )}

        <button onClick={doExport} disabled={exporting} className="flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-[13px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors disabled:opacity-60 mt-auto" data-testid="btn-export">
          {exporting ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</> : <><Download className="w-4 h-4" /> Export {F.label}</>}
        </button>
      </div>
    </SlidePanel>
  );
}

/* ═══════════════════════════════════════════
   3. Attach Panel
═══════════════════════════════════════════ */
interface AttachedFile { name: string; size: string; type: string }
const DRIVE_ITEMS = [
  { name: 'Q1 2026 OKRs.docx',          type: 'docx', modified: '2 days ago' },
  { name: 'Product Roadmap.pdf',          type: 'pdf',  modified: '1 week ago' },
  { name: 'Brand Guidelines.pdf',         type: 'pdf',  modified: '3 weeks ago' },
  { name: 'Revenue Tracker.xlsx',         type: 'xlsx', modified: '5 hours ago' },
  { name: 'Meeting Notes – April.docx',   type: 'docx', modified: 'Yesterday' },
  { name: 'Architecture Diagram.png',     type: 'png',  modified: '3 days ago' },
];
const KB_RESULTS = [
  { name: 'Product Handbook', desc: 'Internal product docs, specs, and guidelines', chunks: 142 },
  { name: 'Legal Templates',  desc: 'Contract templates, NDAs, and legal boilerplate', chunks: 38 },
  { name: 'Brand Voice Guide', desc: 'Tone of voice, messaging pillars, and examples', chunks: 27 },
];
const TYPE_COLOR: Record<string, string> = { docx: '#2563eb', pdf: '#ef4444', xlsx: '#16a34a', png: '#7c3aed', default: '#6b7280' };

function AttachPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab]           = useState('Upload');
  const [attached, setAttached] = useState<AttachedFile[]>([]);
  const [kbSearch, setKbSearch] = useState('');
  const [kbSelected, setKbSelected] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [dragging, setDragging] = useState(false);

  const addFile = (name: string) => setAttached(p => [...p, { name, size: `${(Math.random()*4+0.5).toFixed(1)} MB`, type: name.split('.').pop() || 'file' }]);
  const removeFile = (name: string) => setAttached(p => p.filter(f => f.name !== name));
  const toggleKb = (name: string) => setKbSelected(p => p.includes(name) ? p.filter(x => x !== name) : [...p, name]);

  const filteredKb = KB_RESULTS.filter(k => k.name.toLowerCase().includes(kbSearch.toLowerCase()));

  return (
    <ModalShell title="Attach content" icon={Paperclip} onClose={onClose} width={560} data-testid="modal-attach">
      <TabBar tabs={['Upload', 'Drive', 'Knowledge Base', 'URL']} active={tab} onChange={setTab} />

      {/* Attached files strip */}
      {attached.length > 0 && (
        <div className="px-5 py-3 border-b border-border/50 flex gap-2 flex-wrap bg-[#fafafa]">
          {attached.map(f => (
            <div key={f.name} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border bg-white text-[11px] font-medium">
              <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: TYPE_COLOR[f.type] || TYPE_COLOR.default }} />
              <span className="truncate max-w-[120px]">{f.name}</span>
              <span className="text-muted-foreground">{f.size}</span>
              <button onClick={() => removeFile(f.name)} className="ml-1 text-muted-foreground/50 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Upload' && (
        <div className="p-5 flex flex-col gap-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); Array.from(e.dataTransfer.files).forEach(f => addFile(f.name)); }}
            className={cn('border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 transition-all cursor-pointer', dragging ? 'border-primary bg-primary/5' : 'border-border bg-[#fafafa] hover:border-primary/40 hover:bg-primary/2')}
            data-testid="drop-zone"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center"><Upload className="w-5 h-5 text-primary" /></div>
            <div className="text-center">
              <p className="text-[13px] font-semibold text-foreground">{dragging ? 'Drop files here' : 'Drag & drop files here'}</p>
              <p className="text-[12px] text-muted-foreground mt-0.5">or <button onClick={() => addFile(`file_${Date.now()}.pdf`)} className="text-primary font-semibold hover:underline">choose from your device</button></p>
              <p className="text-[11px] text-muted-foreground/70 mt-2">PDF, DOCX, XLSX, PNG, JPG, CSV — up to 25 MB each</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'Drive' && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <FolderOpen className="w-3.5 h-3.5" /><span>My Drive</span><ChevronRight className="w-3 h-3" /><span className="text-foreground font-semibold">All files</span>
          </div>
          <div className="flex flex-col divide-y divide-border/50 rounded-2xl border border-border overflow-hidden">
            {DRIVE_ITEMS.map(item => (
              <button key={item.name} onClick={() => addFile(item.name)} className="flex items-center gap-3 px-4 py-3 hover:bg-[#f5f5f5] transition-colors text-left" data-testid={`drive-item-${item.type}`}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${TYPE_COLOR[item.type] || TYPE_COLOR.default}18` }}>
                  <File className="w-3.5 h-3.5" style={{ color: TYPE_COLOR[item.type] || TYPE_COLOR.default }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">Modified {item.modified}</p>
                </div>
                <Plus className="w-4 h-4 text-muted-foreground/50 shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'Knowledge Base' && (
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-2.5 border border-border rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input value={kbSearch} onChange={e => setKbSearch(e.target.value)} placeholder="Search knowledge bases…" className="flex-1 text-[13px] outline-none placeholder:text-muted-foreground/50" data-testid="input-kb-search" />
          </div>
          <div className="flex flex-col gap-2">
            {filteredKb.map(kb => {
              const sel = kbSelected.includes(kb.name);
              return (
                <button key={kb.name} onClick={() => toggleKb(kb.name)} className={cn('flex items-center gap-3 p-4 rounded-2xl border text-left transition-all', sel ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30')}>
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', sel ? 'bg-primary/10' : 'bg-[#f5f5f5]')}>
                    <BookOpen className={cn('w-4 h-4', sel ? 'text-primary' : 'text-muted-foreground')} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{kb.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{kb.desc}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{kb.chunks} knowledge chunks</p>
                  </div>
                  <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all', sel ? 'border-primary bg-primary' : 'border-border')}>
                    {sel && <Check className="w-3 h-3 text-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'URL' && (
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider block mb-2">Paste a URL</label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-border rounded-xl bg-white focus-within:ring-2 focus-within:ring-primary/20">
                <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://example.com/article" className="flex-1 text-[13px] outline-none placeholder:text-muted-foreground/50" data-testid="input-url" />
              </div>
              <button onClick={() => { if (urlInput) { addFile(urlInput); setUrlInput(''); } }} className="px-4 py-2.5 bg-primary text-primary-foreground text-[12px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors shrink-0">Fetch</button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">OmniAI will fetch and index the page content for use in this conversation.</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-white shrink-0">
        <span className="text-[12px] text-muted-foreground">{attached.length + kbSelected.length} item{attached.length + kbSelected.length !== 1 ? 's' : ''} selected</span>
        <div className="flex gap-2">
          <button onClick={onClose} className="px-4 py-2 text-[12px] font-semibold border border-border rounded-xl hover:bg-[#f5f5f5] transition-colors">Cancel</button>
          <button onClick={onClose} disabled={attached.length + kbSelected.length === 0} className="px-4 py-2 bg-primary text-primary-foreground text-[12px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors disabled:opacity-50" data-testid="btn-attach">
            Attach {attached.length + kbSelected.length > 0 ? `(${attached.length + kbSelected.length})` : ''}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════
   4. Permissions Dialog
═══════════════════════════════════════════ */
type AccessLevel = 'private' | 'link' | 'public';
interface PermUser { id: string; name: string; email: string; role: string; avatar: string; isOwner?: boolean }
const PERM_USERS: PermUser[] = [
  { id: 'p1', name: 'Alex Chen',    email: 'alex@omni.ai',   role: 'Owner',       avatar: 'AC', isOwner: true },
  { id: 'p2', name: 'Mia Johansson',email: 'mia@team.io',   role: 'Admin',       avatar: 'MJ' },
  { id: 'p3', name: 'Lars Eriksen', email: 'lars@design.co', role: 'Member',      avatar: 'LE' },
  { id: 'p4', name: 'Sara Lindgren',email: 'sara@omni.ai',  role: 'Viewer',      avatar: 'SL' },
];

const ROLE_DESC: Record<string, string> = {
  Owner:  'Full control including transfer and delete',
  Admin:  'Can manage members and settings',
  Member: 'Can read and edit content',
  Viewer: 'Read-only access',
};

function PermissionsDialog({ onClose, meta }: { onClose: () => void; meta: ModalMeta }) {
  const [access, setAccess] = useState<AccessLevel>('link');
  const [users, setUsers]   = useState(PERM_USERS);
  const [adding, setAdding] = useState(false);
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole]   = useState('Member');
  const [linkPerm, setLinkPerm] = useState('Viewer');

  const removeUser = (id: string) => setUsers(p => p.filter(u => u.id !== id));
  const updateRole = (id: string, role: string) => setUsers(p => p.map(u => u.id === id ? { ...u, role } : u));
  const addUser = () => { if (!addEmail.trim()) return; setUsers(p => [...p, { id: `p${Date.now()}`, name: addEmail.split('@')[0], email: addEmail, role: addRole, avatar: addEmail.slice(0,2).toUpperCase() }]); setAddEmail(''); setAdding(false); };

  const ACCESS_OPTIONS: { id: AccessLevel; label: string; desc: string; icon: React.ElementType }[] = [
    { id: 'private', label: 'Private',          desc: 'Only people explicitly added',       icon: Lock },
    { id: 'link',    label: 'Anyone with link',  desc: `Anyone with the link can ${linkPerm.toLowerCase()}`, icon: Link2 },
    { id: 'public',  label: 'Public',            desc: 'Anyone on the internet can view',    icon: Globe },
  ];

  return (
    <ModalShell title={`Permissions — "${meta.title || 'Resource'}"`} icon={Shield} onClose={onClose} width={560} data-testid="modal-permissions">
      <div className="p-5 flex flex-col gap-5">
        {/* Access level */}
        <div className="flex flex-col gap-2">
          <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">Access level</p>
          <div className="grid grid-cols-3 gap-2">
            {ACCESS_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setAccess(opt.id)} className={cn('flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all', access === opt.id ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/30')} data-testid={`access-${opt.id}`}>
                <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', access === opt.id ? 'bg-primary/10' : 'bg-[#f5f5f5]')}>
                  <opt.icon className={cn('w-4 h-4', access === opt.id ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div>
                  <p className={cn('text-[12px] font-bold', access === opt.id ? 'text-primary' : 'text-foreground')}>{opt.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
          {access === 'link' && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#f9fafb] rounded-xl border border-border">
              <p className="text-[12px] text-muted-foreground flex-1">Link permission:</p>
              <div className="relative">
                <select value={linkPerm} onChange={e => setLinkPerm(e.target.value)} className="appearance-none text-[12px] font-semibold text-primary bg-transparent pr-5 cursor-pointer outline-none">
                  {['Viewer','Commenter','Editor'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-primary pointer-events-none" />
              </div>
            </div>
          )}
          {access === 'public' && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 rounded-xl border border-amber-100">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <p className="text-[12px] text-amber-700">This resource will be discoverable by anyone. Sensitive data should stay Private.</p>
            </div>
          )}
        </div>

        {/* People */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-bold text-muted-foreground uppercase tracking-wider">People</p>
            <button onClick={() => setAdding(v => !v)} className="flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"><Plus className="w-3 h-3" /> Add person</button>
          </div>

          {adding && (
            <div className="flex gap-2 p-3 bg-[#f9fafb] rounded-xl border border-border">
              <input value={addEmail} onChange={e => setAddEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && addUser()} placeholder="Email address" className="flex-1 text-[13px] px-3 py-2 border border-border rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary/20" data-testid="input-perm-email" />
              <div className="relative">
                <select value={addRole} onChange={e => setAddRole(e.target.value)} className="appearance-none text-[12px] font-medium px-2 py-2 pr-6 rounded-xl border border-border bg-white cursor-pointer outline-none">
                  {['Admin','Member','Viewer'].map(r => <option key={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
              </div>
              <button onClick={addUser} className="px-3 py-2 bg-primary text-white text-[12px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors">Add</button>
            </div>
          )}

          <div className="flex flex-col rounded-2xl border border-border overflow-hidden divide-y divide-border/50">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full bg-primary/8 flex items-center justify-center text-[11px] font-bold text-primary shrink-0">{u.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[13px] font-semibold text-foreground truncate">{u.name}</p>
                    {u.isOwner && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground">{u.email}</p>
                </div>
                <div title={ROLE_DESC[u.role]} className="text-right">
                  {u.isOwner ? (
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">Owner</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <select value={u.role} onChange={e => updateRole(u.id, e.target.value)} className="appearance-none text-[12px] font-medium px-2 py-1 rounded-lg bg-[#f5f5f5] pr-5 cursor-pointer outline-none">
                          {['Admin','Member','Viewer'].map(r => <option key={r}>{r}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground pointer-events-none" />
                      </div>
                      <button onClick={() => removeUser(u.id)} className="p-1 text-muted-foreground/40 hover:text-red-500 transition-colors rounded-md"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground px-1">Role descriptions: Owner &gt; Admin &gt; Member &gt; Viewer. Roles apply across all content in this resource.</p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-semibold border border-border rounded-xl hover:bg-[#f5f5f5] transition-colors">Cancel</button>
          <button onClick={onClose} className="px-5 py-2 bg-primary text-primary-foreground text-[13px] font-semibold rounded-xl hover:bg-[#003a3d] transition-colors" data-testid="btn-save-permissions">Save permissions</button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ═══════════════════════════════════════════
   Root renderer
═══════════════════════════════════════════ */
export function GlobalModals() {
  const { type, close, meta } = useModal();

  return (
    <AnimatePresence>
      {type && (
        <>
          <Overlay onClick={close} />
          {type === 'share'       && <ShareModal onClose={close} meta={meta} />}
          {type === 'export'      && <ExportPanel onClose={close} meta={meta} />}
          {type === 'attach'      && <AttachPanel onClose={close} />}
          {type === 'permissions' && <PermissionsDialog onClose={close} meta={meta} />}
        </>
      )}
    </AnimatePresence>
  );
}
