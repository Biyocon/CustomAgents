import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Download, TrendingUp, Zap, Shield, CheckCircle2,
  Code2, Database, Layers, FileText, BarChart2, Bot, Palette,
  Globe, GitBranch, CreditCard, Mail, MessageSquare, Slack, Figma,
  ChevronRight, Filter, SortAsc, Package, Users, Sparkles,
  ArrowUpRight, Plus, Check, LayoutGrid, Link2, Flame, Award,
  Puzzle, Cpu, RefreshCw, Lock, Eye, Heart, BookOpen, Wand2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════
   Types
═══════════════════════════════════════════ */
type ExploreTab = 'home' | 'skills' | 'experts' | 'templates' | 'artifacts' | 'connectors';

/* ═══════════════════════════════════════════
   DATA — Skills (from the platform catalog)
═══════════════════════════════════════════ */
interface SkillItem {
  id: string; name: string; category: string; description: string;
  icon: React.ElementType; color: string; stars: number; installs: string;
  tags: string[]; verified: boolean; trending?: boolean; featured?: boolean;
  author: string; compatibility: string[];
}
const SKILL_CATEGORIES = ['All', 'Building', 'Design & UI', 'Backend & Data', 'AI', 'Payments', 'DevOps', 'Research', 'Business'];
const SKILLS: SkillItem[] = [
  { id: 's1',  name: 'React + Vite',        category: 'Building',       description: 'Build fast React web apps with Vite — dashboards, CRUD apps, and landing pages', icon: Code2,        color: '#61dafb', stars: 4.9, installs: '84K', tags: ['react','vite','frontend'], verified: true,  featured: true,   trending: true,  author: 'Replit', compatibility: ['Docs','Projects'] },
  { id: 's2',  name: 'Expo Mobile',          category: 'Building',       description: 'Build cross-platform mobile apps using Expo and React Native with full device access', icon: Layers,       color: '#0075ff', stars: 4.8, installs: '52K', tags: ['mobile','expo','react-native'], verified: true, featured: true, author: 'Replit', compatibility: ['Projects'] },
  { id: 's3',  name: 'Data Visualization',   category: 'Building',       description: 'Build interactive dashboards with charts, tables, and live data integrations', icon: BarChart2,    color: '#f59e0b', stars: 4.7, installs: '41K', tags: ['charts','recharts','dashboards'], verified: true, trending: true, author: 'Replit', compatibility: ['Sheets','Projects'] },
  { id: 's4',  name: 'Streamlit',            category: 'Building',       description: 'Build interactive Python web apps for data science and ML demos in minutes', icon: Zap,          color: '#ff4b4b', stars: 4.6, installs: '29K', tags: ['python','data','ml'], verified: true, author: 'Replit', compatibility: ['Projects'] },
  { id: 's5',  name: 'Design System',        category: 'Design & UI',    description: 'Delegate frontend design work to a specialised design subagent using your brand tokens', icon: Palette,    color: '#ec4899', stars: 4.8, installs: '38K', tags: ['design','ui','tokens'], verified: true, featured: true, author: 'Replit', compatibility: ['Design Systems','Stitch'] },
  { id: 's6',  name: 'Mockup Sandbox',       category: 'Design & UI',    description: 'Prototype UI components on the canvas with live side-by-side variant previews', icon: Layers,       color: '#8b5cf6', stars: 4.7, installs: '22K', tags: ['ui','canvas','preview'], verified: true, trending: true, author: 'Replit', compatibility: ['Stitch','Projects'] },
  { id: 's7',  name: 'PostgreSQL Database',  category: 'Backend & Data', description: 'Create and manage built-in PostgreSQL databases with migrations and SQL query tools', icon: Database,    color: '#336791', stars: 4.9, installs: '71K', tags: ['postgres','sql','database'], verified: true, featured: true, trending: true, author: 'Replit', compatibility: ['Projects','Workflows'] },
  { id: 's8',  name: 'Replit Auth',          category: 'Backend & Data', description: 'Add full user authentication with login, sign-up, and session management in one command', icon: Lock,       color: '#004E51', stars: 4.8, installs: '55K', tags: ['auth','login','oauth'], verified: true, author: 'Replit', compatibility: ['Projects'] },
  { id: 's9',  name: 'OpenAI Integration',   category: 'AI',             description: 'Use GPT-4o and o3 via Replit managed proxy — no API key, billing, or rate limits', icon: Bot,         color: '#10b981', stars: 4.9, installs: '93K', tags: ['gpt','openai','llm'], verified: true, featured: true, trending: true, author: 'Replit', compatibility: ['Agents','Workflows','Chat'] },
  { id: 's10', name: 'Anthropic Claude',     category: 'AI',             description: 'Access Claude 3.5 Haiku and Sonnet through Replits secure proxy for any AI task', icon: Sparkles,    color: '#c084fc', stars: 4.8, installs: '61K', tags: ['claude','anthropic','llm'], verified: true, trending: true, author: 'Replit', compatibility: ['Agents','Chat'] },
  { id: 's11', name: 'Gemini AI',            category: 'AI',             description: 'Use Gemini 2.0 Flash and Pro models for multimodal tasks through Replit proxy', icon: Wand2,        color: '#4285f4', stars: 4.7, installs: '48K', tags: ['gemini','google','multimodal'], verified: true, author: 'Replit', compatibility: ['Agents','Chat'] },
  { id: 's12', name: 'Stripe Payments',      category: 'Payments',       description: 'Integrate full Stripe checkout, subscriptions, and webhooks into any web or mobile app', icon: CreditCard, color: '#635bff', stars: 4.8, installs: '44K', tags: ['stripe','payments','billing'], verified: true, featured: true, author: 'Replit', compatibility: ['Projects','Apps'] },
  { id: 's13', name: 'Deployment',           category: 'DevOps',         description: 'Publish apps to production with TLS, health checks, and custom domains in one step', icon: Globe,       color: '#f97316', stars: 4.9, installs: '88K', tags: ['deploy','production','hosting'], verified: true, trending: true, author: 'Replit', compatibility: ['Projects'] },
  { id: 's14', name: 'Playwright Testing',   category: 'DevOps',         description: 'Run automated end-to-end UI tests against your running app with AI-powered test generation', icon: CheckCircle2, color: '#22c55e', stars: 4.7, installs: '31K', tags: ['testing','e2e','playwright'], verified: true, author: 'Replit', compatibility: ['Projects'] },
  { id: 's15', name: 'Security Scan',        category: 'DevOps',         description: 'Scan for dependency vulnerabilities, SAST issues, and secret leaks before shipping', icon: Shield,      color: '#ef4444', stars: 4.6, installs: '27K', tags: ['security','sast','vulnerabilities'], verified: true, author: 'Replit', compatibility: ['Projects'] },
  { id: 's16', name: 'Deep Research',        category: 'Research',       description: 'Multi-source research with citations, synthesis, and structured output on any topic', icon: BookOpen,    color: '#0ea5e9', stars: 4.7, installs: '19K', tags: ['research','citations','synthesis'], verified: true, author: 'Replit', compatibility: ['Docs','Chat'] },
  { id: 's17', name: 'Branding Generator',   category: 'Business',       description: 'Create full brand identity kits — colours, typography, logo concepts, and guidelines', icon: Palette,    color: '#f43f5e', stars: 4.5, installs: '14K', tags: ['branding','design','identity'], verified: false, author: 'community', compatibility: ['Design Systems','Docs'] },
  { id: 's18', name: 'Media Generation',     category: 'Research',       description: 'Generate AI images and videos, or find stock photography for any project', icon: Sparkles,    color: '#a855f7', stars: 4.6, installs: '24K', tags: ['images','video','ai-art'], verified: true, trending: true, author: 'Replit', compatibility: ['Docs','Projects'] },
];

/* ═══════════════════════════════════════════
   DATA — Experts
═══════════════════════════════════════════ */
interface Expert { id: string; name: string; role: string; initials: string; color: string; skills: string[]; rating: number; reviews: number; projects: number; verified: boolean; following: boolean; badge?: string; }
const EXPERT_CATEGORIES = ['All', 'Frontend', 'Backend', 'AI/ML', 'Design', 'DevOps', 'Data'];
const EXPERTS: Expert[] = [
  { id: 'e1',  name: 'Maya Goldstein',  role: 'Senior Frontend Engineer',  initials: 'MG', color: '#7c3aed', skills: ['React','Vite','Framer Motion'],         rating: 4.9, reviews: 214, projects: 38, verified: true,  following: true,  badge: 'Top Contributor' },
  { id: 'e2',  name: 'Jin Park',        role: 'AI/ML Engineer',            initials: 'JP', color: '#2563eb', skills: ['OpenAI','Agents','Python'],             rating: 4.9, reviews: 187, projects: 52, verified: true,  following: false, badge: 'Expert' },
  { id: 'e3',  name: 'Lena Müller',     role: 'Design Systems Lead',       initials: 'LM', color: '#ea580c', skills: ['Figma','Tokens','CSS'],                rating: 4.8, reviews: 143, projects: 29, verified: true,  following: true,  badge: 'Featured' },
  { id: 'e4',  name: 'Carlos Reyes',    role: 'Full Stack Developer',      initials: 'CR', color: '#16a34a', skills: ['Node.js','PostgreSQL','React'],         rating: 4.8, reviews: 98,  projects: 44, verified: true,  following: false },
  { id: 'e5',  name: 'Priya Nair',      role: 'Data Engineer',             initials: 'PN', color: '#dc2626', skills: ['SQL','Python','Recharts'],             rating: 4.7, reviews: 76,  projects: 31, verified: true,  following: false },
  { id: 'e6',  name: 'Tom Svensson',    role: 'DevOps & Security',         initials: 'TS', color: '#0891b2', skills: ['Playwright','Deploy','GitHub'],         rating: 4.7, reviews: 64,  projects: 22, verified: true,  following: false },
  { id: 'e7',  name: 'Aisha Obi',       role: 'Mobile Developer',          initials: 'AO', color: '#b45309', skills: ['Expo','React Native','RevenueCat'],   rating: 4.8, reviews: 119, projects: 18, verified: true,  following: false, badge: 'Rising Star' },
  { id: 'e8',  name: 'Nikolai Petrov',  role: 'Workflow Architect',        initials: 'NP', color: '#6d28d9', skills: ['Workflows','Automation','APIs'],       rating: 4.6, reviews: 52,  projects: 27, verified: false, following: false },
  { id: 'e9',  name: 'Fiona Walsh',     role: 'Content & SEO Specialist',  initials: 'FW', color: '#be185d', skills: ['SEO','Content','Markdown'],            rating: 4.5, reviews: 41,  projects: 16, verified: false, following: false },
  { id: 'e10', name: 'Rami Khalil',     role: 'Backend Engineer',          initials: 'RK', color: '#065f46', skills: ['PostgreSQL','Auth','APIs'],            rating: 4.7, reviews: 88,  projects: 33, verified: true,  following: false },
  { id: 'e11', name: 'Sophia Chen',     role: 'UX Researcher',             initials: 'SC', color: '#9f1239', skills: ['Design Thinking','UX','Research'],    rating: 4.6, reviews: 61,  projects: 14, verified: true,  following: false },
  { id: 'e12', name: 'Marcus Brown',    role: 'Game Developer',            initials: 'MB', color: '#1d4ed8', skills: ['Three.js','React Three Fiber','GSAP'], rating: 4.5, reviews: 33,  projects: 11, verified: false, following: false },
];

/* ═══════════════════════════════════════════
   DATA — Templates
═══════════════════════════════════════════ */
type TemplateType = 'workflow' | 'document' | 'agent' | 'sheet' | 'app';
interface Template { id: string; name: string; type: TemplateType; category: string; uses: number; author: string; color: string; accentColor: string; description: string; tags: string[]; featured?: boolean; }
const TEMPLATE_CATEGORIES = ['All', 'Workflow', 'Document', 'Agent', 'Sheet', 'App'];
const TEMPLATES: Template[] = [
  { id: 'tpl1',  name: 'Daily Standup Report',       type: 'workflow',  category: 'Workflow',  uses: 8420,  author: 'OmniAI',   color: '#004E51', accentColor: '#43FFC8', description: 'Automatically pulls status from GitHub + Linear and drafts a standup summary', tags: ['automation','reports','github'], featured: true },
  { id: 'tpl2',  name: 'PRD Generator',              type: 'agent',    category: 'Agent',    uses: 6210,  author: 'Jin Park',  color: '#2563eb', accentColor: '#93c5fd', description: 'Interview-based agent that turns product ideas into structured PRDs', tags: ['product','documents','ai'], featured: true },
  { id: 'tpl3',  name: 'Quarterly Revenue Tracker',  type: 'sheet',    category: 'Sheet',    uses: 5890,  author: 'Priya N.', color: '#16a34a', accentColor: '#86efac', description: 'Multi-product revenue grid with auto-calculated YoY growth and charts', tags: ['finance','kpis','revenue'] },
  { id: 'tpl4',  name: 'Meeting Notes Doc',          type: 'document', category: 'Document', uses: 12800, author: 'OmniAI',   color: '#7c3aed', accentColor: '#c4b5fd', description: 'Structured meeting notes with agenda, decisions, and action item tracking', tags: ['meetings','notes','teams'], featured: true },
  { id: 'tpl5',  name: 'Lead Enrichment Workflow',   type: 'workflow',  category: 'Workflow',  uses: 3970,  author: 'Carlos R.', color: '#ea580c', accentColor: '#fdba74', description: 'Pulls lead from CRM, enriches via web search, drafts a personalised outreach email', tags: ['sales','crm','outreach'] },
  { id: 'tpl6',  name: 'Brand Voice Agent',          type: 'agent',    category: 'Agent',    uses: 4440,  author: 'Lena M.',  color: '#f43f5e', accentColor: '#fda4af', description: 'Chat agent trained on your brand guidelines that rewrites any content on-brand', tags: ['brand','content','writing'] },
  { id: 'tpl7',  name: 'Bug Triage Workflow',        type: 'workflow',  category: 'workflow',  uses: 2880,  author: 'Tom S.',   color: '#0891b2', accentColor: '#67e8f9', description: 'Monitors GitHub issues, auto-labels severity, and assigns to the right team member', tags: ['bugs','github','devops'] },
  { id: 'tpl8',  name: 'Competitive Analysis Doc',   type: 'document', category: 'Document', uses: 3120,  author: 'Sophia C.', color: '#6d28d9', accentColor: '#c4b5fd', description: 'Research-backed template for documenting competitor strengths, weaknesses, and pricing', tags: ['research','strategy','competitive'] },
  { id: 'tpl9',  name: 'Invoice Generator App',      type: 'app',      category: 'App',      uses: 7200,  author: 'OmniAI',   color: '#635bff', accentColor: '#a5b4fc', description: 'Full invoice creation UI with PDF export, client records, and Stripe payment links', tags: ['invoices','stripe','finance'] },
  { id: 'tpl10', name: 'OKR Tracker Sheet',          type: 'sheet',    category: 'Sheet',    uses: 4510,  author: 'Marcus B.', color: '#b45309', accentColor: '#fcd34d', description: 'Quarterly OKR grid with progress bars, owner tracking, and status rollup', tags: ['okrs','planning','goals'] },
  { id: 'tpl11', name: 'Blog Post Agent',            type: 'agent',    category: 'Agent',    uses: 5670,  author: 'Fiona W.', color: '#be185d', accentColor: '#f9a8d4', description: 'Research-then-write agent: searches the web, builds an outline, then drafts a full post', tags: ['content','writing','seo'] },
  { id: 'tpl12', name: 'API Status Page App',        type: 'app',      category: 'App',      uses: 2930,  author: 'Rami K.',  color: '#065f46', accentColor: '#6ee7b7', description: 'Real-time service status dashboard with uptime history and incident management', tags: ['devops','monitoring','api'] },
];

/* ═══════════════════════════════════════════
   DATA — Artifacts
═══════════════════════════════════════════ */
interface ArtifactItem { id: string; name: string; type: string; language: string; stars: number; forks: number; uses: number; description: string; category: string; color: string; author: string; updated: string; }
const ARTIFACT_CATS = ['All', 'Web App', 'API', 'Mobile', 'Component', 'Script'];
const ARTIFACTS: ArtifactItem[] = [
  { id: 'a1',  name: 'omni-dashboard',       type: 'Web App',   language: 'TypeScript', stars: 1240, forks: 88,  uses: 4200,  description: 'Full analytics dashboard with recharts, live data, and dark mode', category: 'Web App',   color: '#004E51', author: 'alex-chen', updated: '2d ago' },
  { id: 'a2',  name: 'ai-chat-api',          type: 'API',       language: 'Node.js',    stars: 984,  forks: 122, uses: 6800,  description: 'OpenAI-backed chat REST API with streaming, memory, and function calling', category: 'API',       color: '#10b981', author: 'jin-park',  updated: '5d ago' },
  { id: 'a3',  name: 'token-explorer',       type: 'Component', language: 'React',      stars: 542,  forks: 34,  uses: 1900,  description: 'Interactive design token browser — copy values, preview swatches', category: 'Component', color: '#7c3aed', author: 'lena-m',    updated: '1w ago' },
  { id: 'a4',  name: 'pg-migrator',          type: 'Script',    language: 'TypeScript', stars: 318,  forks: 28,  uses: 2400,  description: 'Database migration runner with dry-run, rollback, and schema diff', category: 'Script',    color: '#336791', author: 'carlos-r',  updated: '1w ago' },
  { id: 'a5',  name: 'expo-starter',         type: 'Mobile',    language: 'TypeScript', stars: 2100, forks: 241, uses: 9200,  description: 'Production-ready Expo template with auth, navigation, and dark mode', category: 'Mobile',    color: '#0075ff', author: 'aisha-o',   updated: '3d ago' },
  { id: 'a6',  name: 'stripe-subscriptions', type: 'Web App',   language: 'TypeScript', stars: 888,  forks: 97,  uses: 3700,  description: 'Subscription billing UI with plan picker, upgrade/downgrade, and portal', category: 'Web App',   color: '#635bff', author: 'rami-k',    updated: '4d ago' },
  { id: 'a7',  name: 'workflow-runner',      type: 'API',       language: 'Node.js',    stars: 476,  forks: 52,  uses: 2100,  description: 'Lightweight workflow execution engine with retry, delay, and webhook triggers', category: 'API',       color: '#f97316', author: 'nikolai-p', updated: '2w ago' },
  { id: 'a8',  name: 'data-grid',            type: 'Component', language: 'React',      stars: 612,  forks: 41,  uses: 3300,  description: 'Spreadsheet-style data grid with sorting, filtering, inline editing, and CSV export', category: 'Component', color: '#16a34a', author: 'priya-n',   updated: '1w ago' },
];

/* ═══════════════════════════════════════════
   DATA — Connectors
═══════════════════════════════════════════ */
interface Connector { id: string; name: string; category: string; description: string; color: string; icon: React.ElementType; connected: boolean; authType: string; popular?: boolean; }
const CONNECTOR_CATS = ['All', 'Productivity', 'Communication', 'Dev', 'Data', 'Finance', 'AI'];
const CONNECTORS: Connector[] = [
  { id: 'c1',  name: 'GitHub',      category: 'Dev',          description: 'Access repos, issues, PRs, and CI status in any workflow or agent', color: '#1c1c1c', icon: GitBranch,    connected: true,  authType: 'OAuth',   popular: true },
  { id: 'c2',  name: 'Stripe',      category: 'Finance',      description: 'Manage payments, subscriptions, invoices, and customer records',    color: '#635bff', icon: CreditCard,   connected: true,  authType: 'API Key', popular: true },
  { id: 'c3',  name: 'Slack',       category: 'Communication',description: 'Send messages, read channels, and trigger workflows from Slack',   color: '#4a154b', icon: Slack,        connected: false, authType: 'OAuth',   popular: true },
  { id: 'c4',  name: 'Figma',       category: 'Dev',          description: 'Read design files, extract tokens, and sync components to code',   color: '#f24e1e', icon: Figma,        connected: false, authType: 'OAuth' },
  { id: 'c5',  name: 'Linear',      category: 'Productivity', description: 'Create issues, update cycles, and read project status in agents', color: '#5e6ad2', icon: Zap,          connected: true,  authType: 'OAuth' },
  { id: 'c6',  name: 'Notion',      category: 'Productivity', description: 'Read and write Notion pages, databases, and blocks from any workflow', color: '#1c1c1c', icon: FileText,  connected: false, authType: 'OAuth',   popular: true },
  { id: 'c7',  name: 'PostgreSQL',  category: 'Data',         description: 'Query any Postgres database and use results inside agents or workflows', color: '#336791', icon: Database, connected: true,  authType: 'Connection string' },
  { id: 'c8',  name: 'OpenAI',      category: 'AI',           description: 'Direct GPT-4o and Whisper access alongside the managed proxy',    color: '#10b981', icon: Bot,         connected: true,  authType: 'API Key' },
  { id: 'c9',  name: 'Google Sheets', category: 'Data',       description: 'Read, write, and sync Google Sheets as a live data source',       color: '#34a853', icon: LayoutGrid,  connected: false, authType: 'OAuth',   popular: true },
  { id: 'c10', name: 'Jira',        category: 'Productivity', description: 'Create tickets, update sprints, and track epics in any workflow', color: '#0052cc', icon: Package,     connected: false, authType: 'OAuth' },
  { id: 'c11', name: 'HubSpot',     category: 'Productivity', description: 'Access CRM records, deals, and contacts from agents and workflows', color: '#ff7a59', icon: Users,      connected: false, authType: 'OAuth' },
  { id: 'c12', name: 'SendGrid',    category: 'Communication',description: 'Send transactional and marketing emails from workflows or apps',   color: '#1a82e2', icon: Mail,       connected: false, authType: 'API Key' },
  { id: 'c13', name: 'Anthropic',   category: 'AI',           description: 'Direct Claude 3.5 Sonnet and Haiku access for advanced reasoning', color: '#c084fc', icon: Sparkles,   connected: false, authType: 'API Key' },
  { id: 'c14', name: 'Twilio',      category: 'Communication',description: 'Send SMS, WhatsApp messages, and make voice calls from workflows', color: '#f22f46', icon: MessageSquare, connected: false, authType: 'API Key' },
  { id: 'c15', name: 'Airtable',    category: 'Data',         description: 'Use Airtable bases as structured data sources in any agent',       color: '#f82b60', icon: LayoutGrid,  connected: false, authType: 'API Key' },
  { id: 'c16', name: 'Vercel',      category: 'Dev',          description: 'Trigger deployments, check preview URLs, and monitor build logs',  color: '#1c1c1c', icon: Globe,       connected: false, authType: 'API Key' },
];

/* ═══════════════════════════════════════════
   Shared: Filter + Sort bar
═══════════════════════════════════════════ */
const SORT_OPTIONS = ['Most Popular', 'Highest Rated', 'Recently Added', 'Trending'];

function FilterBar({ cats, activeCat, onCat, sort, onSort, count, noun }: { cats: string[]; activeCat: string; onCat: (c: string) => void; sort: string; onSort: (s: string) => void; count: number; noun: string; }) {
  const [sortOpen, setSortOpen] = useState(false);
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex gap-1.5 flex-wrap flex-1">
        {cats.map(c => (
          <button key={c} onClick={() => onCat(c)} className={cn('px-3 py-1 text-[11px] font-semibold rounded-full border transition-all whitespace-nowrap', activeCat === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground bg-white')}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-muted-foreground">{count} {noun}</span>
        <div className="relative">
          <button onClick={() => setSortOpen(v => !v)} className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 border border-border rounded-lg hover:bg-[#f5f5f5] text-muted-foreground transition-colors">
            <SortAsc className="w-3 h-3" />{sort}
          </button>
          <AnimatePresence>
            {sortOpen && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-20 min-w-[160px] overflow-hidden">
                {SORT_OPTIONS.map(o => (
                  <button key={o} onClick={() => { onSort(o); setSortOpen(false); }} className={cn('w-full text-left px-4 py-2.5 text-[12px] transition-colors', sort === o ? 'text-primary font-semibold bg-primary/5' : 'text-foreground hover:bg-[#f5f5f5]')}>
                    {sort === o && <Check className="w-3 h-3 inline mr-1.5" />}{o}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Skills tab
═══════════════════════════════════════════ */
function SkillsTab({ search }: { search: string }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Most Popular');
  const items = useMemo(() => {
    let list = SKILLS.filter(s =>
      (cat === 'All' || s.category === cat) &&
      (s.name.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'Highest Rated') list = [...list].sort((a, b) => b.stars - a.stars);
    else if (sort === 'Trending') list = [...list].filter(s => s.trending).concat(list.filter(s => !s.trending));
    return list;
  }, [cat, sort, search]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar cats={SKILL_CATEGORIES} activeCat={cat} onCat={setCat} sort={sort} onSort={setSort} count={items.length} noun="skills" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(skill => (
          <motion.div key={skill.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer" data-testid={`skill-${skill.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${skill.color}18` }}>
                  <skill.icon className="w-4.5 h-4.5" style={{ color: skill.color }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground truncate">{skill.name}</p>
                    {skill.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-[10px] text-muted-foreground">{skill.category}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                {skill.featured && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Featured</span>}
                {skill.trending && !skill.featured && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-50 text-orange-600 flex items-center gap-0.5"><Flame className="w-2.5 h-2.5" />Hot</span>}
              </div>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{skill.description}</p>
            <div className="flex flex-wrap gap-1">
              {skill.tags.map(t => <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#f0f0f0] text-muted-foreground">#{t}</span>)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {skill.stars}</span>
                <span className="flex items-center gap-0.5"><Download className="w-3 h-3" /> {skill.installs}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">by {skill.author}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Experts tab
═══════════════════════════════════════════ */
function ExpertsTab({ search }: { search: string }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Most Popular');
  const [following, setFollowing] = useState<Set<string>>(new Set(EXPERTS.filter(e => e.following).map(e => e.id)));

  const items = useMemo(() => {
    let list = EXPERTS.filter(e =>
      (cat === 'All' || e.skills.some(s => s.toLowerCase().includes(cat.toLowerCase()))) &&
      (e.name.toLowerCase().includes(search.toLowerCase()) || e.role.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'Highest Rated') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sort === 'Most Popular') list = [...list].sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [cat, sort, search]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar cats={EXPERT_CATEGORIES} activeCat={cat} onCat={setCat} sort={sort} onSort={setSort} count={items.length} noun="experts" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(expert => {
          const isFollowing = following.has(expert.id);
          return (
            <motion.div key={expert.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-primary/20 hover:shadow-md transition-all" data-testid={`expert-${expert.id}`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: expert.color }}>{expert.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground truncate">{expert.name}</p>
                    {expert.verified && <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{expert.role}</p>
                  {expert.badge && <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${expert.color}18`, color: expert.color }}>{expert.badge}</span>}
                </div>
                <button onClick={() => setFollowing(prev => { const next = new Set(prev); isFollowing ? next.delete(expert.id) : next.add(expert.id); return next; })}
                  className={cn('shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all', isFollowing ? 'bg-primary/8 text-primary border-primary/20' : 'border-border text-muted-foreground hover:border-primary/30 hover:text-primary')} data-testid={`follow-${expert.id}`}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {expert.skills.map(s => <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#f0f0f0] text-muted-foreground">{s}</span>)}
              </div>
              <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
                <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {expert.rating}</span>
                <span>{expert.reviews} reviews</span>
                <span>{expert.projects} projects</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Templates tab
═══════════════════════════════════════════ */
const TYPE_ICON: Record<TemplateType, React.ElementType> = { workflow: Zap, document: FileText, agent: Bot, sheet: LayoutGrid, app: Globe };
const TYPE_COLOR: Record<TemplateType, string> = { workflow: '#004E51', document: '#2563eb', agent: '#7c3aed', sheet: '#16a34a', app: '#ea580c' };

function TemplatesTab({ search }: { search: string }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Most Popular');

  const items = useMemo(() => {
    let list = TEMPLATES.filter(t =>
      (cat === 'All' || t.type === cat.toLowerCase() || t.category === cat) &&
      (t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'Most Popular') list = [...list].sort((a, b) => b.uses - a.uses);
    return list;
  }, [cat, sort, search]);

  return (
    <div className="flex flex-col gap-4">
      <FilterBar cats={TEMPLATE_CATEGORIES} activeCat={cat} onCat={setCat} sort={sort} onSort={setSort} count={items.length} noun="templates" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(tpl => {
          const TypeIcon = TYPE_ICON[tpl.type];
          const typeColor = TYPE_COLOR[tpl.type];
          return (
            <motion.div key={tpl.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-border rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-md transition-all group cursor-pointer" data-testid={`template-${tpl.id}`}>
              {/* Colour band */}
              <div className="h-20 flex items-center px-5 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${tpl.color}, ${tpl.accentColor}22)` }}>
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <TypeIcon className="w-5 h-5 text-white" />
                </div>
                {tpl.featured && <span className="absolute top-3 right-3 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white/30 text-white backdrop-blur-sm">Featured</span>}
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-bold text-foreground leading-snug">{tpl.name}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 mt-0.5" style={{ background: `${typeColor}14`, color: typeColor }}>{tpl.type}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{tpl.description}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {tpl.tags.map(t => <span key={t} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-[#f0f0f0] text-muted-foreground">#{t}</span>)}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-1">
                  <span className="text-[10px] text-muted-foreground">{tpl.uses.toLocaleString()} uses</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-muted-foreground">by {tpl.author}</span>
                    <button className="ml-2 flex items-center gap-1 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity"><Plus className="w-3 h-3" /> Use</button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Artifacts tab
═══════════════════════════════════════════ */
function ArtifactsTab({ search }: { search: string }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Most Popular');

  const items = useMemo(() => {
    let list = ARTIFACTS.filter(a =>
      (cat === 'All' || a.category === cat) &&
      (a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()))
    );
    if (sort === 'Most Popular') list = [...list].sort((a, b) => b.uses - a.uses);
    else if (sort === 'Highest Rated') list = [...list].sort((a, b) => b.stars - a.stars);
    return list;
  }, [cat, sort, search]);

  const LANG_COLORS: Record<string, string> = { TypeScript: '#3178c6', 'Node.js': '#68a063', React: '#61dafb' };

  return (
    <div className="flex flex-col gap-4">
      <FilterBar cats={ARTIFACT_CATS} activeCat={cat} onCat={setCat} sort={sort} onSort={setSort} count={items.length} noun="artifacts" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(a => (
          <motion.div key={a.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/20 hover:shadow-md transition-all group" data-testid={`artifact-${a.id}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}18` }}>
                  <Package className="w-4 h-4" style={{ color: a.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground font-mono">{a.name}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: `${a.color}14`, color: a.color }}>{a.type}</span>
                </div>
              </div>
              <button className="shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:border-primary/30 hover:text-primary transition-all flex items-center gap-1 opacity-0 group-hover:opacity-100"><ArrowUpRight className="w-3 h-3" /> Fork</button>
            </div>
            <p className="text-[12px] text-muted-foreground leading-relaxed">{a.description}</p>
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground pt-2 border-t border-border/40">
              <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {a.stars.toLocaleString()}</span>
              <span className="flex items-center gap-0.5"><GitBranch className="w-3 h-3" /> {a.forks}</span>
              <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {a.uses.toLocaleString()}</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: LANG_COLORS[a.language] ?? '#888' }} />
                <span>{a.language}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Connectors tab
═══════════════════════════════════════════ */
function ConnectorsTab({ search }: { search: string }) {
  const [cat, setCat] = useState('All');
  const [sort, setSort] = useState('Most Popular');
  const [connected, setConnected] = useState<Set<string>>(new Set(CONNECTORS.filter(c => c.connected).map(c => c.id)));

  const items = useMemo(() => {
    let list = CONNECTORS.filter(c =>
      (cat === 'All' || c.category === cat) &&
      (c.name.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase()))
    );
    return list;
  }, [cat, sort, search]);

  const connectedCount = items.filter(c => connected.has(c.id)).length;

  return (
    <div className="flex flex-col gap-4">
      <FilterBar cats={CONNECTOR_CATS} activeCat={cat} onCat={setCat} sort={sort} onSort={setSort} count={items.length} noun="connectors" />
      <div className="bg-[#f5f5f5] rounded-2xl px-4 py-2.5 flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">{connectedCount} of {items.length} connectors active in this workspace</span>
        <button className="text-[11px] font-semibold text-primary hover:underline">Manage all</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map(conn => {
          const isConnected = connected.has(conn.id);
          return (
            <motion.div key={conn.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-border rounded-2xl p-4 flex items-center gap-4 hover:border-primary/20 hover:shadow-sm transition-all" data-testid={`connector-${conn.id}`}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${conn.color}18` }}>
                <conn.icon className="w-5 h-5" style={{ color: conn.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[13px] font-bold text-foreground">{conn.name}</p>
                  {conn.popular && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600">Popular</span>}
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 truncate">{conn.description}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">Auth: {conn.authType}</p>
              </div>
              <button
                onClick={() => setConnected(prev => { const next = new Set(prev); isConnected ? next.delete(conn.id) : next.add(conn.id); return next; })}
                className={cn('shrink-0 text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1', isConnected ? 'bg-[#22c55e10] text-[#22c55e] border-[#22c55e30]' : 'border-border text-muted-foreground hover:border-primary/30 hover:text-primary')}
                data-testid={`connect-${conn.id}`}
              >
                {isConnected ? <><Check className="w-3 h-3" /> Connected</> : <><Link2 className="w-3 h-3" /> Connect</>}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Explore Home
═══════════════════════════════════════════ */
function ExploreHome({ onTab }: { onTab: (t: ExploreTab) => void }) {
  const featured = SKILLS.filter(s => s.featured).slice(0, 3);
  const trending = SKILLS.filter(s => s.trending).slice(0, 4);
  const popularTpls = [...TEMPLATES].sort((a, b) => b.uses - a.uses).slice(0, 4);
  const popularConns = CONNECTORS.filter(c => c.popular).slice(0, 4);

  const SECTIONS = [
    { tab: 'skills' as ExploreTab, label: 'Skills', icon: Sparkles, count: SKILLS.length, desc: 'Extend your workspace capabilities', color: '#004E51' },
    { tab: 'experts' as ExploreTab, label: 'Experts', icon: Users, count: EXPERTS.length, desc: 'Hire or follow top contributors', color: '#7c3aed' },
    { tab: 'templates' as ExploreTab, label: 'Templates', icon: LayoutGrid, count: TEMPLATES.length, desc: 'Pre-built starting points for any task', color: '#ea580c' },
    { tab: 'artifacts' as ExploreTab, label: 'Artifacts', icon: Package, count: ARTIFACTS.length, desc: 'Apps, APIs and components to fork', color: '#2563eb' },
    { tab: 'connectors' as ExploreTab, label: 'Connectors', icon: Link2, count: CONNECTORS.length, desc: 'Third-party integrations and APIs', color: '#16a34a' },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Section cards */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SECTIONS.map(s => (
            <button key={s.tab} onClick={() => onTab(s.tab)} className="text-left bg-white border border-border rounded-2xl p-4 hover:border-primary/20 hover:shadow-md transition-all group flex flex-col gap-2" data-testid={`home-section-${s.tab}`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}14` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-[13px] font-bold text-foreground">{s.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{s.desc}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] font-bold text-muted-foreground">{s.count} items</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured skills */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Featured Skills</h2>
          <button onClick={() => onTab('skills')} className="text-[12px] font-semibold text-primary hover:underline flex items-center gap-1">See all <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featured.map(skill => (
            <div key={skill.id} className="bg-white border border-border rounded-2xl p-4 flex flex-col gap-2 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${skill.color}18` }}>
                  <skill.icon className="w-4 h-4" style={{ color: skill.color }} />
                </div>
                <div><p className="text-[13px] font-bold text-foreground">{skill.name}</p><p className="text-[10px] text-muted-foreground">{skill.installs} installs</p></div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{skill.description}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {skill.stars} · {skill.category}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending + Popular templates */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-500" /> Trending This Week</h2>
            <button onClick={() => onTab('skills')} className="text-[12px] font-semibold text-primary hover:underline">See all</button>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {trending.map((skill, i) => (
              <div key={skill.id} className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors cursor-pointer">
                <span className="text-[12px] font-bold text-muted-foreground w-5 text-center">{i + 1}</span>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${skill.color}18` }}>
                  <skill.icon className="w-3.5 h-3.5" style={{ color: skill.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-foreground truncate">{skill.name}</p>
                  <p className="text-[10px] text-muted-foreground">{skill.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] font-semibold text-foreground">{skill.installs}</p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end"><Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />{skill.stars}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular templates */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Flame className="w-4 h-4 text-red-500" /> Popular Templates</h2>
            <button onClick={() => onTab('templates')} className="text-[12px] font-semibold text-primary hover:underline">See all</button>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            {popularTpls.map(tpl => {
              const TypeIcon = TYPE_ICON[tpl.type];
              const typeColor = TYPE_COLOR[tpl.type];
              return (
                <div key={tpl.id} className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors cursor-pointer">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${tpl.color}18` }}>
                    <TypeIcon className="w-3.5 h-3.5" style={{ color: tpl.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{tpl.name}</p>
                    <span className="text-[9px] font-bold px-1 py-0.5 rounded" style={{ color: typeColor }}>{tpl.type}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground shrink-0">{tpl.uses.toLocaleString()} uses</span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Popular Connectors */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2"><Link2 className="w-4 h-4 text-primary" /> Popular Connectors</h2>
          <button onClick={() => onTab('connectors')} className="text-[12px] font-semibold text-primary hover:underline">See all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularConns.map(conn => (
            <div key={conn.id} className="bg-white border border-border rounded-2xl p-4 flex flex-col items-center gap-2 hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer text-center">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${conn.color}18` }}>
                <conn.icon className="w-5 h-5" style={{ color: conn.color }} />
              </div>
              <p className="text-[12px] font-bold text-foreground">{conn.name}</p>
              <p className="text-[10px] text-muted-foreground">{conn.category}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Root: ExploreView
═══════════════════════════════════════════ */
const TABS: { id: ExploreTab; label: string; icon: React.ElementType }[] = [
  { id: 'home',       label: 'Home',       icon: Sparkles },
  { id: 'skills',     label: 'Skills',     icon: Puzzle },
  { id: 'experts',    label: 'Experts',    icon: Users },
  { id: 'templates',  label: 'Templates',  icon: LayoutGrid },
  { id: 'artifacts',  label: 'Artifacts',  icon: Package },
  { id: 'connectors', label: 'Connectors', icon: Link2 },
];

export function ExploreView() {
  const [tab, setTab] = useState<ExploreTab>('home');
  const [search, setSearch] = useState('');

  const activeTab = TABS.find(t => t.id === tab)!;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-6 py-4 shrink-0">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Explore</h1>
            <p className="text-sm text-muted-foreground">Discover skills, experts, templates, and integrations</p>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Search ${activeTab.label.toLowerCase()}…`}
              className="text-xs pl-8 pr-3 py-2 border border-border rounded-xl bg-[#f5f5f5] outline-none w-52 focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 transition-all"
              data-testid="input-explore-search" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1" data-testid="explore-tabs">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSearch(''); }}
              className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all relative', tab === t.id ? 'text-primary bg-primary/8' : 'text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5]')}
              data-testid={`tab-${t.id}`}>
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
              {tab === t.id && <motion.div layoutId="explore-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1100px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
              {tab === 'home'       && <ExploreHome onTab={setTab} />}
              {tab === 'skills'     && <SkillsTab     search={search} />}
              {tab === 'experts'    && <ExpertsTab    search={search} />}
              {tab === 'templates'  && <TemplatesTab  search={search} />}
              {tab === 'artifacts'  && <ArtifactsTab  search={search} />}
              {tab === 'connectors' && <ConnectorsTab  search={search} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
