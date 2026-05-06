import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpreadsheetView } from './SpreadsheetView';
import {
  FileText, Grid3x3, Mail, Layers, Code2, Database, LayoutTemplate,
  ClipboardList, Plus, Search, ArrowLeft, Star, Clock, MoreHorizontal,
  Bold, Italic, List, Heading1, Heading2, AlignLeft, Download, Share2,
  Sparkles, ChevronRight, ChevronDown, Send, Reply, Archive, Trash2,
  Check, X, RefreshCw, Eye, PenLine, ZapIcon, Tag, Filter,
  Columns, BarChart2, SortAsc, Wand2, CheckCircle2, ChevronUp,
  Lock, Keyboard, Hash, AtSign, Paperclip, Inbox, Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import imgWord     from '@assets/word_1777415920725.png';
import imgExcel    from '@assets/excel_1777415920724.png';
import imgInbox    from '@assets/inbox_1777416110828.webp';
import imgCanvas   from '@assets/Canvas_1777416110827.webp';
import imgPPT      from '@assets/powerPoint_1777415920725.png';
import imgForms    from '@assets/Forms_1777416110827.png';
import imgDatabase from '@assets/Database_1777416219238.png';
import imgCode     from '@assets/code_1777415979280.png';

/* ═══════════════════════════════════════════
   Types
═══════════════════════════════════════════ */
type AppMode = 'library' | 'docs' | 'sheets' | 'inbox';
type DocsState = 'landing' | 'editor';
type SheetsState = 'landing' | 'editor';

/* ═══════════════════════════════════════════
   App Library Data
═══════════════════════════════════════════ */
interface AppCard { id: AppMode | string; name: string; desc: string; icon: React.ElementType; color: string; category: string; recentCount?: number; badge?: string; comingSoon?: boolean; logoUrl?: string; }

const APP_CARDS: AppCard[] = [
  { id: 'docs',     name: 'Docs',     desc: 'AI-powered document editor',       icon: FileText,       color: '#2B579A', category: 'Productivity', recentCount: 3, logoUrl: imgWord },
  { id: 'sheets',   name: 'Sheets',   desc: 'Intelligent spreadsheets',          icon: Grid3x3,        color: '#217346', category: 'Data',         recentCount: 2, logoUrl: imgExcel },
  { id: 'inbox',    name: 'Inbox',    desc: 'Smart email workspace',             icon: Mail,           color: '#1B4F8A', category: 'Communication', badge: '7',   logoUrl: imgInbox },
  { id: 'canvas',   name: 'Canvas',   desc: 'Visual design & Stitch surface',    icon: Layers,         color: '#00C4CC', category: 'Design',        recentCount: 5, logoUrl: imgCanvas },
  { id: 'slides',   name: 'Slides',   desc: 'AI presentation builder',           icon: LayoutTemplate, color: '#C43E1C', category: 'Productivity', badge: 'Soon', comingSoon: true, logoUrl: imgPPT },
  { id: 'forms',    name: 'Forms',    desc: 'Surveys and data collection',       icon: ClipboardList,  color: '#038387', category: 'Productivity', badge: 'Soon', comingSoon: true, logoUrl: imgForms },
  { id: 'database', name: 'Database', desc: 'Visual database browser',           icon: Database,       color: '#CC2222', category: 'Data',          badge: 'Beta', logoUrl: imgDatabase },
  { id: 'code',     name: 'Code',     desc: 'AI-native code environment',        icon: Code2,          color: '#1B6FDE', category: 'Dev',           badge: 'Beta', logoUrl: imgCode },
];

const RECENT_FILES = [
  { name: 'Landing Page Brief',       type: 'docs',   icon: FileText, color: '#2563eb', edited: '2h ago',     size: '4.2 KB' },
  { name: 'Q2 Revenue Tracker',       type: 'sheets', icon: Grid3x3,  color: '#16a34a', edited: 'Yesterday',  size: '18 KB' },
  { name: 'Brand Guidelines Doc',     type: 'docs',   icon: FileText, color: '#2563eb', edited: '3d ago',     size: '12 KB' },
  { name: 'API Spec Analysis',        type: 'docs',   icon: FileText, color: '#2563eb', edited: '1w ago',     size: '6.8 KB' },
  { name: 'Team Budget FY26',         type: 'sheets', icon: Grid3x3,  color: '#16a34a', edited: '1w ago',     size: '44 KB' },
];

/* ═══════════════════════════════════════════
   Docs data
═══════════════════════════════════════════ */
const DOC_TEMPLATES = [
  { id: 'blank',   name: 'Blank', icon: PenLine, content: '' },
  {
    id: 'report',  name: 'Report', icon: FileText,
    content: `# Quarterly Performance Report\n\n## Executive Summary\n\nThis report covers the key performance metrics for Q2 2026. Overall, the quarter showed strong growth across core product lines, with OmniAI Pro leading at 34% YoY growth.\n\n## Key Findings\n\n1. **Revenue** — Total ARR reached $4.2M, up 31% quarter-over-quarter\n2. **User Growth** — Active workspaces grew to 12,400, a 22% increase\n3. **Retention** — Monthly retention rate held at 94.2%, above the 90% target\n\n## Recommendations\n\nFocus Q3 investment on the Enterprise tier, which showed the highest growth trajectory and lowest churn. Consider accelerating the Inbox and Sheets release to close the productivity gap identified in user research.\n\n## Next Steps\n\n- Schedule Q3 planning session with product leads\n- Review pricing model for Enterprise tier\n- Finalise roadmap for Apps layer expansion`,
  },
  {
    id: 'prd', name: 'PRD', icon: LayoutTemplate,
    content: `# Product Requirements Document\n\n**Product**: OmniAI Inbox\n**Status**: Draft\n**Owner**: Alex Chen\n\n## Problem Statement\n\nUsers managing communications across multiple channels lack a unified, AI-assisted inbox that surfaces what matters and reduces cognitive load.\n\n## Goals\n\n1. Reduce email response time by 40%\n2. Surface actionable items with >90% accuracy\n3. Enable batch AI summarisation for thread digests\n\n## User Stories\n\n- As a Pro user, I want to see a one-paragraph summary of any thread so I can decide whether to read it\n- As a team member, I want AI-drafted replies I can edit and send in under 30 seconds\n- As a user, I want keyboard shortcuts for every inbox action so I stay in flow\n\n## Out of Scope\n\n- OAuth integrations for external email providers (v2)\n- Mobile push notifications (v2)`,
  },
  {
    id: 'notes', name: 'Meeting Notes', icon: ClipboardList,
    content: `# Meeting Notes\n\n**Date**: April 28, 2026\n**Attendees**: Alex Chen, Sarah K., James R.\n**Facilitator**: Alex Chen\n\n## Agenda\n\n1. Q2 retrospective (15 min)\n2. Apps layer prioritisation (20 min)\n3. Design Systems sync status (10 min)\n\n## Key Decisions\n\n- Inbox launches before Slides — higher user demand signal\n- Design Systems view will be the source of truth for token changes\n- Stitch Canvas requires a dedicated review session before GA\n\n## Action Items\n\n| Owner | Action | Due |\n|-------|--------|-----|\n| Alex  | Finalise Inbox MVP spec | May 5 |\n| Sarah | Review Stitch token export | May 3 |\n| James | Set up analytics dashboard | May 10 |\n\n## Next Meeting\n\nMay 5, 2026 — Q3 planning kickoff`,
  },
];

const RECENT_DOCS = [
  { name: 'Landing Page Brief',   edited: '2h ago',  words: 1240 },
  { name: 'Brand Guidelines',     edited: '3d ago',  words: 3820 },
  { name: 'API Spec Analysis',    edited: '1w ago',  words: 870 },
];

/* ═══════════════════════════════════════════
   Sheets data
═══════════════════════════════════════════ */
const COLS = ['A','B','C','D','E','F','G','H'];
const INITIAL_CELLS: string[][] = [
  ['Product',       'Q1',       'Q2',       'Q3',        'Q4',        'Total',    'YoY %',  ''],
  ['OmniAI Pro',   '124,500',  '138,200',  '151,900',   '167,600',   '582,200',  '+34%',   ''],
  ['Design Hub',   '48,200',   '52,400',   '61,800',    '73,200',    '235,600',  '+52%',   ''],
  ['API Access',   '29,100',   '31,800',   '34,200',    '37,500',    '132,600',  '+29%',   ''],
  ['Enterprise',   '89,000',   '94,500',   '108,000',   '127,000',   '418,500',  '+43%',   ''],
  ['Total',        '290,800',  '316,900',  '355,900',   '405,300',   '1,368,900','',       ''],
  ['',             '',         '',         '',          '',          '',         '',        ''],
  ['',             '',         '',         '',          '',          '',         '',        ''],
];

const SHEET_TEMPLATES = [
  { id: 'blank',    name: 'Blank',           icon: Grid3x3 },
  { id: 'budget',   name: 'Budget Tracker',  icon: BarChart2 },
  { id: 'crm',      name: 'CRM Pipeline',    icon: SortAsc },
  { id: 'roadmap',  name: 'Product Roadmap', icon: LayoutTemplate },
];
const RECENT_SHEETS = [
  { name: 'Q2 Revenue Tracker', edited: 'Yesterday', rows: 48 },
  { name: 'Team Budget FY26',   edited: '1w ago',    rows: 124 },
];

/* ═══════════════════════════════════════════
   Inbox data
═══════════════════════════════════════════ */
interface Thread {
  id: string; from: string; fromInitials: string; fromColor: string;
  subject: string; preview: string; time: string; unread: boolean;
  starred: boolean; tag?: string; messages: InboxMessage[];
}
interface InboxMessage { from: string; fromInitials: string; fromColor: string; text: string; time: string; }

const THREADS: Thread[] = [
  {
    id: 't1', from: 'Sarah K.', fromInitials: 'SK', fromColor: '#7c3aed',
    subject: 'Stitch Canvas review — feedback needed',
    preview: "Hi Alex, I've been going through the Stitch Canvas export and have some…",
    time: '10:24', unread: true, starred: true, tag: 'Design',
    messages: [
      { from: 'Sarah K.', fromInitials: 'SK', fromColor: '#7c3aed', time: '10:24', text: 'Hi Alex,\n\nI\'ve been going through the Stitch Canvas export and have some notes on the token mapping — the border-radius values don\'t seem to be applying correctly in the exported React components.\n\nAlso, the typography scale preview in the Token Editor looks off at the "xs" end. Worth a look before we ship.\n\nCan you take a look today? Happy to jump on a call.\n\nBest,\nSarah' },
    ],
  },
  {
    id: 't2', from: 'James R.', fromInitials: 'JR', fromColor: '#2563eb',
    subject: 'Analytics dashboard is ready for review',
    preview: 'Hey, just pushed the Q2 analytics dashboard. The YoY comparison chart is…',
    time: '09:51', unread: true, starred: false, tag: 'Data',
    messages: [
      { from: 'James R.', fromInitials: 'JR', fromColor: '#2563eb', time: '09:51', text: 'Hey,\n\nJust pushed the Q2 analytics dashboard. The YoY comparison chart is looking solid — OmniAI Pro growth is really telling a good story.\n\nThere\'s one issue with the Enterprise row filter on mobile but I\'ll fix that before the all-hands.\n\nLet me know if you need any changes to the layout.\n\nCheers,\nJames' },
    ],
  },
  {
    id: 't3', from: 'OmniAI Team', fromInitials: 'OA', fromColor: '#004E51',
    subject: 'Your weekly workspace digest',
    preview: '12 active tasks · 2,874 workflow runs · 98.3% success rate this week…',
    time: 'Mon', unread: true, starred: false,
    messages: [
      { from: 'OmniAI Team', fromInitials: 'OA', fromColor: '#004E51', time: 'Mon', text: 'Weekly Workspace Digest — April 22–28\n\n✅ 12 active tasks completed\n⚡ 2,874 workflow runs (98.3% success rate)\n🤖 Agents used: 847 sessions\n📄 Documents created: 14\n\nTop workflow this week: Daily Report Generator (324 runs)\nMost active agent: OmniAI Assistant (312 sessions)\n\nView your full dashboard →' },
    ],
  },
  {
    id: 't4', from: 'Lena M.', fromInitials: 'LM', fromColor: '#ea580c',
    subject: 'Re: Brand token export format',
    preview: 'The W3C Design Token format looks promising. We could adapt it for…',
    time: 'Mon', unread: false, starred: true, tag: 'Design',
    messages: [
      { from: 'Alex Chen', fromInitials: 'AC', fromColor: '#004E51', time: 'Sun', text: 'Hi Lena,\n\nHave you looked at the W3C Design Token Community Group format? Wondering if we should align our export with that spec.' },
      { from: 'Lena M.', fromInitials: 'LM', fromColor: '#ea580c', time: 'Mon', text: 'Yes! The W3C Design Token format looks promising. We could adapt it for our token export — it would make integration with Figma Tokens plugin much smoother.\n\nI\'ll draft a proposal for the export schema and share it by EOD Wednesday.\n\nLena' },
    ],
  },
  {
    id: 't5', from: 'GitHub Notifications', fromInitials: 'GH', fromColor: '#1c1c1c',
    subject: '[omni-ai] PR #47: Adds WorkflowsView component',
    preview: 'merged by alex-chen · 3 files changed, 892 additions, 0 deletions…',
    time: 'Sun', unread: false, starred: false, tag: 'Dev',
    messages: [
      { from: 'GitHub', fromInitials: 'GH', fromColor: '#1c1c1c', time: 'Sun', text: 'Pull Request #47 was merged.\n\n**Title**: Adds WorkflowsView component\n**Author**: alex-chen\n**Changes**: 3 files changed, 892 additions, 0 deletions\n\nFiles changed:\n- artifacts/omni-ai/src/components/WorkflowsView.tsx (+892)\n- artifacts/omni-ai/src/App.tsx (+14)\n- artifacts/omni-ai/src/components/Sidebar.tsx (+3)' },
    ],
  },
  {
    id: 't6', from: 'Product Hunt', fromInitials: 'PH', fromColor: '#da552f',
    subject: 'OmniAI is trending — 342 upvotes today',
    preview: 'Your product is on the front page of Product Hunt with 342 upvotes and…',
    time: 'Fri', unread: false, starred: false,
    messages: [
      { from: 'Product Hunt', fromInitials: 'PH', fromColor: '#da552f', time: 'Fri', text: 'Congratulations!\n\nOmniAI Hub is trending on Product Hunt today with 342 upvotes, placing it #2 Product of the Day.\n\nHere\'s a snapshot of your metrics:\n- 342 upvotes\n- 89 comments\n- 1,240 clicks to your website\n- 3 new featured reviews\n\nKeep the momentum going by engaging with comments!' },
    ],
  },
  {
    id: 't7', from: 'Stripe', fromInitials: 'ST', fromColor: '#635bff',
    subject: 'Invoice payment received — $2,400.00',
    preview: 'A payment of $2,400.00 has been received for Invoice #OA-2026-048…',
    time: 'Thu', unread: false, starred: false, tag: 'Finance',
    messages: [
      { from: 'Stripe', fromInitials: 'ST', fromColor: '#635bff', time: 'Thu', text: 'Payment Received\n\nAmount: $2,400.00\nInvoice: #OA-2026-048\nCustomer: Acme Corp\nDate: April 24, 2026\n\nThank you for using OmniAI Hub. A receipt has been sent to billing@acmecorp.com.\n\nView your Stripe Dashboard →' },
    ],
  },
  {
    id: 't8', from: 'Alex Chen', fromInitials: 'AC', fromColor: '#004E51',
    subject: 'Note to self — Agent Builder spec ideas',
    preview: 'Quick capture: multi-step onboarding for new agents, progressive disclosure…',
    time: 'Wed', unread: false, starred: false,
    messages: [
      { from: 'Alex Chen', fromInitials: 'AC', fromColor: '#004E51', time: 'Wed', text: 'Quick capture for Agent Builder spec:\n\n1. Multi-step onboarding with progressive disclosure — don\'t overwhelm with all config upfront\n2. "Test as user" mode — impersonate end-user to QA the agent\n3. Versioned prompts with diff view between versions\n4. Agent analytics: sessions, avg turns, thumbs up/down ratio\n5. Handoff flows — agent can escalate to another agent or human\n\nFollow up with team on items 2 and 5.' },
    ],
  },
];

const AI_INBOX_SUGGESTIONS = [
  'Summarise this thread',
  'Draft a reply',
  'Find action items',
  'Schedule follow-up',
];

/* ═══════════════════════════════════════════
   App Library
═══════════════════════════════════════════ */
function AppLibrary({ onOpen }: { onOpen: (id: AppMode) => void }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const cats = ['All', 'Productivity', 'Data', 'Communication', 'Design', 'Dev'];

  const displayed = APP_CARDS.filter(a =>
    (cat === 'All' || a.category === cat) &&
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div key="library" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Apps</h1>
            <p className="text-sm text-muted-foreground">Specialised workspaces for every kind of work</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search apps…"
              className="text-xs pl-8 pr-3 py-2 border border-border rounded-lg bg-[#f5f5f5] outline-none w-44 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
              data-testid="input-search-apps" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} className={cn('px-3 py-1 text-[11px] font-semibold rounded-full border transition-all', cat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-white')} data-testid={`cat-${c}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-8 max-w-[1100px]">
        {/* App grid */}
        <section>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayed.map(app => (
              <motion.div key={app.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                onClick={() => !app.comingSoon && (app.id === 'docs' || app.id === 'sheets' || app.id === 'inbox') && onOpen(app.id as AppMode)}
                className={cn('bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 transition-all group', !app.comingSoon && (app.id === 'docs' || app.id === 'sheets' || app.id === 'inbox') ? 'cursor-pointer hover:border-primary/30 hover:shadow-md' : 'cursor-default opacity-80')}
                data-testid={`app-card-${app.id}`}>
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: `${app.color}22` }}>
                    {app.logoUrl ? (
                      <img src={app.logoUrl} alt={app.name} className="w-9 h-9 object-contain" style={{ mixBlendMode: 'multiply' }} />
                    ) : (
                      <app.icon className="w-6 h-6" style={{ color: app.color }} />
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {app.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: app.comingSoon ? '#f0f0f0' : `${app.color}18`, color: app.comingSoon ? '#999' : app.color }}>{app.badge}</span>
                    )}
                    {app.recentCount && <span className="text-[10px] text-muted-foreground">{app.recentCount} recent</span>}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{app.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{app.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                  <span className="text-[10px] font-medium text-muted-foreground">{app.category}</span>
                  {!app.comingSoon && (app.id === 'docs' || app.id === 'sheets' || app.id === 'inbox') && (
                    <span className="text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">Open <ChevronRight className="w-3 h-3" /></span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent files */}
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Recent Files</h2>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {RECENT_FILES.map((f, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors cursor-pointer group" data-testid={`recent-file-${i}`}>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${f.color}18` }}>
                  <f.icon className="w-3.5 h-3.5" style={{ color: f.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                </div>
                <span className="text-[11px] text-muted-foreground shrink-0">{f.size}</span>
                <span className="text-[11px] text-muted-foreground shrink-0 w-20 text-right">{f.edited}</span>
                <MoreHorizontal className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Docs
═══════════════════════════════════════════ */
function DocsApp({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<DocsState>('landing');
  const [docContent, setDocContent] = useState('');
  const [docTitle, setDocTitle] = useState('Untitled Document');
  const [saved, setSaved] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiMessages, setAiMessages] = useState<{role:'user'|'ai';text:string}[]>([
    { role: 'ai', text: 'I\'m your document assistant. I can help you write, edit, summarise, generate outlines, or improve any selected text. What would you like to do?' }
  ]);
  const [aiTyping, setAiTyping] = useState(false);
  const wordCount = docContent.trim() ? docContent.trim().split(/\s+/).length : 0;

  const openTemplate = (tpl: typeof DOC_TEMPLATES[0]) => {
    setDocTitle(tpl.id === 'blank' ? 'Untitled Document' : tpl.name);
    setDocContent(tpl.content);
    setSaved(true);
    setState('editor');
  };

  const sendAi = (text?: string) => {
    const msg = text || aiPrompt.trim();
    if (!msg) return;
    setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
    setAiPrompt('');
    setAiTyping(true);
    setTimeout(() => {
      const responses: Record<string, string> = {
        'improve clarity': 'Here\'s a clearer version of the selected paragraph:\n\n"Q2 showed strong growth across all product lines, with OmniAI Pro leading at 34% YoY. ARR reached $4.2M, driven primarily by Enterprise and API expansion."',
        'generate outline': '## Suggested Outline\n\n1. Executive Summary\n2. Market Context\n3. Q2 Performance Metrics\n   - Revenue breakdown\n   - User growth\n   - Retention rates\n4. Key Findings\n5. Risks & Mitigations\n6. Recommendations\n7. Q3 Roadmap',
        'default': `I've analysed your document "${docTitle}". A few suggestions:\n\n1. The executive summary could be tightened to 2 sentences\n2. Consider adding a "Key Metrics" callout box\n3. The action items section would benefit from an owner column\n\nWould you like me to make any of these changes?`,
      };
      const key = msg.toLowerCase().includes('clarity') ? 'improve clarity' : msg.toLowerCase().includes('outline') ? 'generate outline' : 'default';
      setAiMessages(prev => [...prev, { role: 'ai', text: responses[key] }]);
      setAiTyping(false);
    }, 1100);
  };

  if (state === 'landing') return (
    <motion.div key="docs-landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors" data-testid="btn-docs-back"><ArrowLeft className="w-4 h-4" /> Apps</button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg flex items-center justify-center bg-[#2563eb18]"><FileText className="w-3.5 h-3.5 text-[#2563eb]" /></div><span className="text-sm font-bold text-foreground">Docs</span></div>
        </div>
        <button onClick={() => openTemplate(DOC_TEMPLATES[0])} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-[#003a3d] transition-colors" data-testid="btn-new-doc"><Plus className="w-4 h-4" /> New Doc</button>
      </div>
      <div className="p-6 max-w-[900px] flex flex-col gap-8">
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Start from template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {DOC_TEMPLATES.map(tpl => (
              <button key={tpl.id} onClick={() => openTemplate(tpl)} className="flex flex-col items-center gap-3 p-5 bg-white border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all group" data-testid={`tpl-${tpl.id}`}>
                <div className="w-10 h-10 rounded-xl bg-[#2563eb18] group-hover:bg-[#2563eb22] flex items-center justify-center transition-colors"><tpl.icon className="w-5 h-5 text-[#2563eb]" /></div>
                <span className="text-sm font-semibold text-foreground">{tpl.name}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Recent documents</h2>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {RECENT_DOCS.map((d, i) => (
              <div key={i} onClick={() => { setDocTitle(d.name); setDocContent(DOC_TEMPLATES[1].content); setState('editor'); }} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors cursor-pointer group">
                <div className="w-7 h-7 rounded-lg bg-[#2563eb18] flex items-center justify-center shrink-0"><FileText className="w-3.5 h-3.5 text-[#2563eb]" /></div>
                <p className="text-sm font-medium text-foreground flex-1 truncate">{d.name}</p>
                <span className="text-[11px] text-muted-foreground shrink-0">{d.words.toLocaleString()} words</span>
                <span className="text-[11px] text-muted-foreground shrink-0 w-20 text-right">{d.edited}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );

  return (
    <motion.div key="docs-editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Editor toolbar */}
      <div className="bg-white border-b border-border px-4 py-2 flex items-center gap-2 shrink-0">
        <button onClick={() => setState('landing')} className="flex items-center gap-1 text-muted-foreground hover:text-foreground text-xs font-medium transition-colors shrink-0" data-testid="btn-editor-back"><ArrowLeft className="w-3.5 h-3.5" /></button>
        <div className="w-px h-5 bg-border shrink-0" />
        <input value={docTitle} onChange={e => { setDocTitle(e.target.value); setSaved(false); }} className="text-sm font-semibold text-foreground bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary/40 transition-colors min-w-0 max-w-[240px]" data-testid="input-doc-title" />
        {!saved && <span className="text-[10px] text-amber-500 font-medium shrink-0">Unsaved</span>}
        <div className="h-5 w-px bg-border mx-1" />
        {[{ icon: Bold, tip: 'Bold' }, { icon: Italic, tip: 'Italic' }, { icon: Heading1, tip: 'H1' }, { icon: Heading2, tip: 'H2' }, { icon: List, tip: 'List' }, { icon: AlignLeft, tip: 'Align' }].map(({ icon: Icon, tip }) => (
          <button key={tip} title={tip} className="p-1.5 rounded hover:bg-[#f0f0f0] text-muted-foreground hover:text-foreground transition-colors"><Icon className="w-3.5 h-3.5" /></button>
        ))}
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button onClick={() => setSaved(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-[#f5f5f5] transition-colors" data-testid="btn-save-doc"><Check className="w-3 h-3" />{saved ? 'Saved' : 'Save'}</button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"><Share2 className="w-3.5 h-3.5" /></button>
          <button onClick={() => setAiPanelOpen(v => !v)} className={cn('flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors', aiPanelOpen ? 'bg-primary/10 text-primary' : 'border border-border text-muted-foreground hover:bg-[#f5f5f5]')} data-testid="btn-toggle-ai"><Sparkles className="w-3.5 h-3.5" /> AI</button>
        </div>
      </div>

      {/* Editor + AI panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Document area */}
        <div className="flex-1 overflow-y-auto flex flex-col" style={{ background: '#f7f7f7' }}>
          <div className="w-[700px] max-w-full mx-auto my-8 bg-white shadow-md rounded-lg min-h-[800px] flex flex-col">
            <textarea
              value={docContent}
              onChange={e => { setDocContent(e.target.value); setSaved(false); }}
              placeholder={`Start writing or press / for commands…\n\nTip: Select any text and ask the AI assistant to rewrite, improve, or expand it.`}
              className="flex-1 p-12 text-[15px] leading-[1.8] text-foreground resize-none outline-none font-[Georgia,serif] placeholder:text-muted-foreground/40 bg-transparent"
              style={{ fontFamily: 'Georgia, serif', minHeight: 800 }}
              data-testid="doc-editor"
            />
          </div>
          <div className="w-[700px] max-w-full mx-auto pb-4 px-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{docContent.length} characters</span>
          </div>
        </div>

        {/* AI Assistant panel */}
        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }} className="w-[280px] bg-white border-l border-border flex flex-col overflow-hidden shrink-0">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[13px] font-bold text-foreground">AI Assistant</span>
                <button onClick={() => setAiPanelOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors"><X className="w-3.5 h-3.5" /></button>
              </div>
              {/* Quick actions */}
              <div className="p-3 border-b border-border/50 flex flex-wrap gap-1.5 shrink-0">
                {['Improve clarity','Generate outline','Summarise','Continue writing'].map(a => (
                  <button key={a} onClick={() => sendAi(a)} className="text-[10px] font-semibold px-2 py-1 rounded-full border border-border hover:border-primary/30 hover:bg-primary/5 hover:text-primary text-muted-foreground transition-all" data-testid={`ai-action-${a.toLowerCase().replace(' ','-')}`}>{a}</button>
                ))}
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {aiMessages.map((m, i) => (
                  <div key={i} className={cn('text-[12px] leading-relaxed rounded-xl p-3', m.role === 'user' ? 'bg-primary/8 text-foreground ml-4' : 'bg-[#f5f5f5] text-foreground')}>
                    {m.role === 'ai' && <p className="text-[10px] font-bold text-primary mb-1">AI</p>}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))}
                {aiTyping && <div className="bg-[#f5f5f5] rounded-xl p-3 flex gap-1 items-center">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>}
              </div>
              {/* Input */}
              <div className="p-3 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAi()} placeholder="Ask about this document…" className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all" data-testid="ai-doc-input" />
                  <button onClick={() => sendAi()} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-[#003a3d] transition-colors" data-testid="ai-doc-send"><Send className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Sheets — replaced by SpreadsheetView in ./SpreadsheetView.tsx
═══════════════════════════════════════════ */
function _SheetsApp_REMOVED({ onBack: _onBack }: { onBack: () => void }) { return null; }
void _SheetsApp_REMOVED;
// Legacy SheetsApp removed — SpreadsheetView is now used directly.
function SheetsApp({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<SheetsState>('landing');
  const [cells, setCells] = useState<string[][]>(INITIAL_CELLS);
  const [selected, setSelected] = useState<[number,number] | null>(null);
  const [formulaVal, setFormulaVal] = useState('');
  const [sheetName, setSheetName] = useState('Q2 Revenue Tracker');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [aiMessages, setAiMessages] = useState<{role:'user'|'ai';text:string}[]>([
    { role: 'ai', text: 'I can help you analyse this data, write formulas, spot trends, and suggest visualisations. What would you like to explore?' }
  ]);
  const [aiTyping, setAiTyping] = useState(false);

  const numRows = 15;
  const cellName = selected ? `${COLS[selected[1]]}${selected[0]+1}` : '';

  const selectCell = (r: number, c: number) => {
    setSelected([r, c]);
    setFormulaVal(cells[r]?.[c] ?? '');
  };

  const updateCell = (val: string) => {
    if (!selected) return;
    const [r, c] = selected;
    setCells(prev => { const next = prev.map(row => [...row]); while (next.length <= r) next.push([]); while ((next[r]?.length ?? 0) <= c) next[r].push(''); next[r][c] = val; return next; });
    setFormulaVal(val);
  };

  const sendAi = (text?: string) => {
    const msg = text || aiPrompt.trim();
    if (!msg) return;
    setAiMessages(prev => [...prev, { role: 'user', text: msg }]);
    setAiPrompt('');
    setAiTyping(true);
    setTimeout(() => {
      const responses: Record<string, string> = {
        analyse: 'Based on this data:\n\n📈 **Top performer**: OmniAI Pro — $582K total (+34% YoY)\n📊 **Fastest growing**: Design Hub — +52% YoY\n⚡ **Total ARR**: $1.37M across all products\n\nQ4 shows strongest growth for all products. Consider a Q4-focused upsell campaign.\n\nShall I generate a trend chart description?',
        formula: '**Suggested formula for H2 (Growth Rate)**:\n\n`=IFERROR((E2-B2)/B2*100, 0)`\n\nThis calculates QoQ growth from Q1 to Q4. Copy down rows 2-5 for all products.\n\nWant me to add a conditional format rule to highlight rows above 40% growth?',
        default: 'I can see 4 product lines across 4 quarters. Total revenue is $1.37M.\n\nA few observations:\n1. All products show positive quarter-over-quarter growth\n2. Design Hub (+52%) and Enterprise (+43%) are outpacing the portfolio average\n3. Q4 showed the strongest absolute growth\n\nWould you like me to suggest formulas to automate the YoY % column?',
      };
      const key = msg.toLowerCase().includes('analys') ? 'analyse' : msg.toLowerCase().includes('formula') ? 'formula' : 'default';
      setAiMessages(prev => [...prev, { role: 'ai', text: responses[key] }]);
      setAiTyping(false);
    }, 1000);
  };

  if (state === 'landing') return (
    <motion.div key="sheets-landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"><ArrowLeft className="w-4 h-4" /> Apps</button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-[#16a34a18] flex items-center justify-center"><Grid3x3 className="w-3.5 h-3.5 text-[#16a34a]" /></div><span className="text-sm font-bold text-foreground">Sheets</span></div>
        </div>
        <button onClick={() => setState('editor')} className="flex items-center gap-2 px-4 py-2 bg-[#16a34a] text-white text-sm font-semibold rounded-xl hover:bg-[#15803d] transition-colors"><Plus className="w-4 h-4" /> New Sheet</button>
      </div>
      <div className="p-6 max-w-[900px] flex flex-col gap-8">
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Start from template</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SHEET_TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setState('editor')} className="flex flex-col items-center gap-3 p-5 bg-white border border-border rounded-2xl hover:border-[#16a34a]/30 hover:shadow-md transition-all group" data-testid={`sheet-tpl-${t.id}`}>
                <div className="w-10 h-10 rounded-xl bg-[#16a34a18] group-hover:bg-[#16a34a22] flex items-center justify-center"><t.icon className="w-5 h-5 text-[#16a34a]" /></div>
                <span className="text-sm font-semibold text-foreground">{t.name}</span>
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Recent sheets</h2>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {RECENT_SHEETS.map((s, i) => (
              <div key={i} onClick={() => setState('editor')} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors cursor-pointer">
                <div className="w-7 h-7 rounded-lg bg-[#16a34a18] flex items-center justify-center shrink-0"><Grid3x3 className="w-3.5 h-3.5 text-[#16a34a]" /></div>
                <p className="text-sm font-medium text-foreground flex-1 truncate">{s.name}</p>
                <span className="text-[11px] text-muted-foreground shrink-0">{s.rows} rows</span>
                <span className="text-[11px] text-muted-foreground shrink-0 w-24 text-right">{s.edited}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );

  return (
    <motion.div key="sheets-editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Sheets toolbar */}
      <div className="bg-white border-b border-border px-4 py-2 flex items-center gap-2 shrink-0">
        <button onClick={() => setState('landing')} className="text-muted-foreground hover:text-foreground transition-colors shrink-0"><ArrowLeft className="w-4 h-4" /></button>
        <div className="w-px h-5 bg-border shrink-0" />
        <input value={sheetName} onChange={e => setSheetName(e.target.value)} className="text-sm font-semibold text-foreground bg-transparent outline-none border-b border-transparent hover:border-border focus:border-[#16a34a]/40 transition-colors min-w-0 max-w-[200px]" />
        <div className="h-5 w-px bg-border mx-1 shrink-0" />
        {/* Formula bar */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="text-[11px] font-mono font-bold text-muted-foreground shrink-0 w-10 text-center">{cellName || 'A1'}</div>
          <div className="h-4 w-px bg-border shrink-0" />
          <input value={formulaVal} onChange={e => updateCell(e.target.value)} className="flex-1 text-xs font-mono border border-border rounded px-2 py-1 bg-[#f5f5f5] outline-none focus:ring-1 focus:ring-[#16a34a]/30" placeholder="Value or formula…" data-testid="formula-bar" />
        </div>
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          <button onClick={() => setAiPanelOpen(v => !v)} className={cn('flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors', aiPanelOpen ? 'bg-[#16a34a10] text-[#16a34a]' : 'border border-border text-muted-foreground hover:bg-[#f5f5f5]')} data-testid="btn-toggle-ai-sheets"><Sparkles className="w-3.5 h-3.5" /> AI</button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"><Download className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      {/* Grid + AI */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 overflow-auto">
          <table className="border-collapse text-[12px]" style={{ tableLayout: 'fixed', width: Math.max(COLS.length * 120 + 40, 800) }}>
            <colgroup><col style={{ width: 40 }} />{COLS.map(c => <col key={c} style={{ width: 120 }} />)}</colgroup>
            <thead>
              <tr className="sticky top-0 z-10">
                <th className="border border-[#d1d5db] bg-[#f0f0f0] text-center text-[11px] text-muted-foreground h-7 w-10" />
                {COLS.map(c => <th key={c} className="border border-[#d1d5db] bg-[#f0f0f0] text-center text-[11px] font-bold text-muted-foreground h-7">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: numRows }, (_, r) => (
                <tr key={r}>
                  <td className="border border-[#d1d5db] bg-[#f7f7f7] text-center text-[11px] font-medium text-muted-foreground select-none">{r + 1}</td>
                  {COLS.map((_, c) => {
                    const val = cells[r]?.[c] ?? '';
                    const isSel = selected?.[0] === r && selected?.[1] === c;
                    const isHeader = r === 0;
                    const isTotal = r === 5 || c === 0;
                    return (
                      <td
                        key={c}
                        onClick={() => selectCell(r, c)}
                        className={cn('border border-[#d1d5db] px-2 py-0.5 h-7 overflow-hidden cursor-cell whitespace-nowrap', isSel ? 'outline outline-2 outline-[#16a34a] outline-offset-[-1px] bg-[#16a34a08]' : 'hover:bg-[#f0f0f0]', isHeader ? 'font-bold bg-[#f7f7f7] text-foreground' : '', (isTotal && !isHeader) ? 'bg-[#f9fafb] font-medium text-foreground' : 'text-foreground')}
                        data-testid={`cell-${COLS[c]}${r+1}`}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI side panel */}
        <AnimatePresence>
          {aiPanelOpen && (
            <motion.div initial={{ x: 260, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 260, opacity: 0 }} transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }} className="w-[260px] bg-white border-l border-border flex flex-col overflow-hidden shrink-0">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[#16a34a]" />
                <span className="text-[13px] font-bold text-foreground">Sheet AI</span>
                <button onClick={() => setAiPanelOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="p-3 border-b border-border/50 flex flex-wrap gap-1.5 shrink-0">
                {['Analyse data','Suggest formulas','Find trends','Create chart'].map(a => (
                  <button key={a} onClick={() => sendAi(a)} className="text-[10px] font-semibold px-2 py-1 rounded-full border border-border hover:border-[#16a34a]/40 hover:bg-[#16a34a08] hover:text-[#16a34a] text-muted-foreground transition-all">{a}</button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                {aiMessages.map((m, i) => (
                  <div key={i} className={cn('text-[12px] leading-relaxed rounded-xl p-3', m.role === 'user' ? 'bg-[#16a34a08] text-foreground ml-3' : 'bg-[#f5f5f5] text-foreground')}>
                    {m.role === 'ai' && <p className="text-[10px] font-bold text-[#16a34a] mb-1">AI</p>}
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                ))}
                {aiTyping && <div className="bg-[#f5f5f5] rounded-xl p-3 flex gap-1 items-center">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}</div>}
              </div>
              <div className="p-3 border-t border-border shrink-0">
                <div className="flex gap-2">
                  <input value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAi()} placeholder="Ask about this sheet…" className="flex-1 text-xs border border-border rounded-lg px-3 py-2 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-[#16a34a]/20 placeholder:text-muted-foreground/60 transition-all" data-testid="ai-sheet-input" />
                  <button onClick={() => sendAi()} className="p-2 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] transition-colors"><Send className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Inbox
═══════════════════════════════════════════ */
function InboxApp({ onBack }: { onBack: () => void }) {
  const [threads, setThreads] = useState(THREADS);
  const [selectedThread, setSelectedThread] = useState<Thread>(THREADS[0]);
  const [draftOpen, setDraftOpen] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [inboxFilter, setInboxFilter] = useState<'all'|'unread'|'starred'>('all');
  const [search, setSearch] = useState('');

  const unreadCount = threads.filter(t => t.unread).length;
  const filtered = threads.filter(t => {
    if (inboxFilter === 'unread' && !t.unread) return false;
    if (inboxFilter === 'starred' && !t.starred) return false;
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase()) && !t.from.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const markRead = (id: string) => setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: false } : t));
  const toggleStar = (id: string) => setThreads(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  const archive = (id: string) => setThreads(prev => prev.filter(t => t.id !== id));

  const summarise = () => {
    setSummaryLoading(true);
    setAiPanelOpen(true);
    setAiSummary('');
    setTimeout(() => {
      setSummaryLoading(false);
      const summaries: Record<string, string> = {
        't1': '**Thread Summary** (2 messages)\n\nSarah K. flagged two issues with the Stitch Canvas export:\n1. Border-radius values not applying in exported React components\n2. Typography scale preview is off at the "xs" level\n\n**Action required**: Review both issues and respond. She suggested a call.',
        't4': '**Thread Summary** (2 messages)\n\nThis is a back-and-forth about adopting the W3C Design Token Community Group format for token exports. Lena will deliver a schema proposal by EOD Wednesday.\n\n**No action needed** — waiting on Lena\'s proposal.',
        'default': `**Thread Summary**\n\nThis thread from ${selectedThread.from} covers: "${selectedThread.subject}"\n\nPreview: ${selectedThread.preview}\n\n**Suggested action**: Review and archive if no follow-up needed.`,
      };
      setAiSummary(summaries[selectedThread.id] || summaries['default']);
    }, 1200);
  };

  const generateDraft = () => {
    setDraftText(`Hi ${selectedThread.from.split(' ')[0]},\n\nThanks for reaching out. I've reviewed the thread and will follow up shortly.\n\nBest,\nAlex`);
    setDraftOpen(true);
  };

  const SHORTCUTS = [
    { key: 'R', action: 'Reply' }, { key: 'E', action: 'Archive' }, { key: 'S', action: 'Star' },
    { key: '#', action: 'Delete' }, { key: 'J/K', action: 'Next/Prev' }, { key: '?', action: 'Help' },
  ];

  return (
    <motion.div key="inbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden min-h-0">
      {/* Inbox header */}
      <div className="bg-white border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors shrink-0"><ArrowLeft className="w-4 h-4" /> Apps</button>
        <div className="w-px h-5 bg-border shrink-0" />
        <div className="flex items-center gap-2"><div className="w-6 h-6 rounded-lg bg-[#7c3aed18] flex items-center justify-center"><Mail className="w-3.5 h-3.5 text-[#7c3aed]" /></div><span className="text-sm font-bold text-foreground">Inbox</span>{unreadCount > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#7c3aed] text-white">{unreadCount}</span>}</div>
        <div className="flex items-center gap-1.5 ml-2">
          {(['all','unread','starred'] as const).map(f => (
            <button key={f} onClick={() => setInboxFilter(f)} className={cn('px-2.5 py-1 text-[11px] font-semibold rounded-full border transition-all capitalize', inboxFilter === f ? 'bg-[#7c3aed] text-white border-[#7c3aed]' : 'border-border text-muted-foreground hover:border-[#7c3aed]/30')}>{f}</button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="text-xs pl-7 pr-3 py-1.5 border border-border rounded-lg bg-[#f5f5f5] outline-none w-36 focus:ring-2 focus:ring-[#7c3aed]/20 placeholder:text-muted-foreground/60 transition-all" />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Thread list */}
        <div className="w-[280px] border-r border-border bg-white flex flex-col overflow-hidden shrink-0">
          <div className="flex-1 overflow-y-auto">
            {filtered.map(thread => (
              <div
                key={thread.id}
                onClick={() => { setSelectedThread(thread); markRead(thread.id); setDraftOpen(false); setAiPanelOpen(false); setAiSummary(''); }}
                className={cn('flex items-start gap-3 px-4 py-3 border-b border-border/50 cursor-pointer transition-colors', selectedThread.id === thread.id ? 'bg-[#7c3aed08] border-l-2 border-l-[#7c3aed]' : 'hover:bg-[#f7f7f7] border-l-2 border-l-transparent')}
                data-testid={`thread-${thread.id}`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5" style={{ background: thread.fromColor }}>{thread.fromInitials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={cn('text-[12px] truncate', thread.unread ? 'font-bold text-foreground' : 'font-medium text-foreground/70')}>{thread.from}</p>
                    <p className="text-[10px] text-muted-foreground shrink-0">{thread.time}</p>
                  </div>
                  <p className={cn('text-[11px] truncate mt-0.5', thread.unread ? 'font-semibold text-foreground' : 'text-muted-foreground')}>{thread.subject}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5">{thread.preview}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {thread.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]" />}
                    {thread.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    {thread.tag && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#f0f0f0] text-muted-foreground">{thread.tag}</span>}
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No threads match</div>}
          </div>
        </div>

        {/* Thread view */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Thread toolbar */}
          <div className="bg-white border-b border-border px-4 py-2.5 flex items-center gap-2 shrink-0">
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-foreground truncate">{selectedThread.subject}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button onClick={summarise} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#7c3aed] bg-[#7c3aed10] rounded-lg hover:bg-[#7c3aed18] transition-colors" data-testid="btn-summarise"><Sparkles className="w-3.5 h-3.5" /> Summarise</button>
              <button onClick={generateDraft} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted-foreground hover:bg-[#f5f5f5] transition-colors" data-testid="btn-draft-reply"><Reply className="w-3.5 h-3.5" /> Draft reply</button>
              <button onClick={() => toggleStar(selectedThread.id)} className={cn('p-1.5 rounded-lg border border-border transition-colors', selectedThread.starred ? 'text-amber-500' : 'text-muted-foreground hover:bg-[#f5f5f5]')} data-testid="btn-star"><Star className="w-3.5 h-3.5" fill={selectedThread.starred ? 'currentColor' : 'none'} /></button>
              <button onClick={() => archive(selectedThread.id)} className="p-1.5 text-muted-foreground hover:bg-[#f5f5f5] rounded-lg border border-border transition-colors" data-testid="btn-archive"><Archive className="w-3.5 h-3.5" /></button>
              <button onClick={() => setThreads(prev => prev.filter(t => t.id !== selectedThread.id))} className="p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 rounded-lg border border-border transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          {/* Messages + AI summary */}
          <div className="flex-1 overflow-y-auto">
            {/* AI summary panel */}
            <AnimatePresence>
              {aiPanelOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-b border-border overflow-hidden bg-[#7c3aed08]">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" /><span className="text-[11px] font-bold text-[#7c3aed]">AI Summary</span></div>
                      <button onClick={() => { setAiPanelOpen(false); setAiSummary(''); }} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                    </div>
                    {summaryLoading ? (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Summarising thread…</div>
                    ) : (
                      <p className="text-[12px] text-foreground leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="p-6 flex flex-col gap-6 max-w-[760px]">
              {selectedThread.messages.map((msg, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: msg.fromColor }}>{msg.fromInitials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2"><p className="text-sm font-bold text-foreground">{msg.from}</p><span className="text-[11px] text-muted-foreground shrink-0">{msg.time}</span></div>
                    </div>
                  </div>
                  <div className="ml-11 bg-white border border-border rounded-2xl p-4 text-[13px] text-foreground leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Draft composer */}
          <AnimatePresence>
            {draftOpen && (
              <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }} className="border-t border-border bg-white shrink-0">
                <div className="flex items-center gap-2 px-4 py-2 border-b border-border/50">
                  <span className="text-[11px] font-bold text-foreground">Reply to {selectedThread.from}</span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <button onClick={() => generateDraft()} className="flex items-center gap-1 text-[10px] font-semibold text-[#7c3aed] hover:underline" data-testid="btn-ai-draft"><Sparkles className="w-3 h-3" /> AI draft</button>
                    <button onClick={() => setDraftOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <textarea value={draftText} onChange={e => setDraftText(e.target.value)} placeholder="Write your reply…" rows={4} className="w-full text-[13px] px-5 py-3 resize-none outline-none leading-relaxed placeholder:text-muted-foreground/40" data-testid="draft-textarea" />
                <div className="flex items-center gap-2 px-5 py-3 border-t border-border/40">
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#7c3aed] text-white text-xs font-semibold rounded-lg hover:bg-[#6d28d9] transition-colors" data-testid="btn-send-reply"><Send className="w-3.5 h-3.5" /> Send</button>
                  <button className="px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors">Schedule</button>
                  <button className="p-2 text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors"><Paperclip className="w-3.5 h-3.5" /></button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Keyboard shortcuts bar */}
          <div className="border-t border-border bg-[#f7f7f7] px-5 py-1.5 flex items-center gap-4 shrink-0">
            <Keyboard className="w-3 h-3 text-muted-foreground/50 shrink-0" />
            {SHORTCUTS.map(s => (
              <div key={s.key} className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-border text-[9px] font-bold font-mono text-foreground shadow-sm">{s.key}</kbd>
                <span>{s.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Root: AppsView
═══════════════════════════════════════════ */
export function AppsView() {
  const [mode, setMode] = useState<AppMode>('library');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === 'library' && <AppLibrary key="lib" onOpen={setMode} />}
        {mode === 'docs'    && <DocsApp   key="docs"   onBack={() => setMode('library')} />}
        {mode === 'sheets'  && <SpreadsheetView key="sheets" onBack={() => setMode('library')} />}
        {mode === 'inbox'   && <InboxApp  key="inbox"  onBack={() => setMode('library')} />}
      </AnimatePresence>
    </div>
  );
}
