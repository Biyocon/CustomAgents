import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, ChevronRight, ChevronLeft, ChevronDown, ChevronUp,
  Play, Square, Save, ArrowLeft, Clock, Zap, Globe, MousePointer,
  Sparkles, Database, Mail, GitBranch, RefreshCw, Code2, Settings2,
  CheckCircle2, XCircle, Loader2, Timer, MoreHorizontal, Layers,
  TerminalSquare, BarChart2, AlertCircle, Pause, Filter, Copy,
  Cpu, Send, ArrowRight, Webhook, CalendarClock, Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════
   Types
═══════════════════════════════════════════ */
type WorkflowMode = 'home' | 'builder';
type RunStatus = 'success' | 'failed' | 'running' | 'skipped';
type NodeType = 'trigger' | 'action' | 'ai' | 'condition' | 'output';
type BuilderTab = 'builder' | 'logic' | 'runtime';
type TriggerFilter = 'all' | 'scheduled' | 'webhook' | 'event' | 'manual' | 'ai';

interface ConfigField { key: string; label: string; type: 'text' | 'select' | 'textarea' | 'toggle' | 'multi'; value: string; options?: string[]; }
interface WFNode {
  id: string; type: NodeType; label: string; desc: string;
  x: number; y: number; width: number; height: number;
  config: ConfigField[];
}
interface WorkflowTemplate {
  id: string; name: string; desc: string; trigger: TriggerFilter;
  category: string; color: string; runs: number; icon: React.ElementType; nodes: number;
}
interface RunLog { id: string; step: string; status: RunStatus; duration: string; ts: string; msg: string; }

/* ═══════════════════════════════════════════
   Static data
═══════════════════════════════════════════ */
const TEMPLATES: WorkflowTemplate[] = [
  { id: 't1', name: 'Daily Report Generator',   desc: 'Fetches data, runs AI analysis, emails PDF digest',  trigger: 'scheduled', category: 'Reporting',  color: '#004E51', runs: 324, icon: BarChart2,    nodes: 5 },
  { id: 't2', name: 'Webhook → AI Classifier',  desc: 'Classifies inbound payloads and routes to queues',  trigger: 'webhook',   category: 'AI',         color: '#7c3aed', runs: 87,  icon: Cpu,           nodes: 4 },
  { id: 't3', name: 'Design Token Sync',        desc: 'Reads DESIGN.md, pushes tokens to Stitch systems',  trigger: 'event',     category: 'Design',     color: '#2563eb', runs: 12,  icon: Layers,        nodes: 3 },
  { id: 't4', name: 'Feedback Digest',          desc: 'Aggregates feedback, summarises and posts to Slack', trigger: 'scheduled', category: 'Reporting',  color: '#16a34a', runs: 58,  icon: Send,          nodes: 6 },
  { id: 't5', name: 'Content Pipeline',         desc: 'Drafts, reviews, formats and publishes content',    trigger: 'manual',    category: 'Content',    color: '#ea580c', runs: 21,  icon: GitBranch,     nodes: 7 },
  { id: 't6', name: 'Anomaly Alert',            desc: 'Monitors metrics, detects anomalies, fires alerts', trigger: 'scheduled', category: 'Monitoring', color: '#dc2626', runs: 209, icon: AlertCircle,   nodes: 4 },
  { id: 't7', name: 'API Health Monitor',       desc: 'Pings endpoints on schedule, logs and alerts on fail', trigger: 'scheduled', category: 'Monitoring', color: '#0ea5e9', runs: 1840, icon: Globe,       nodes: 3 },
  { id: 't8', name: 'AI Code Reviewer',         desc: 'Runs on PR events, reviews diff and posts comments', trigger: 'event',     category: 'AI',         color: '#8b5cf6', runs: 44,  icon: Code2,        nodes: 5 },
];

const STARTER_PATTERNS = [
  { icon: Clock,       label: 'Scheduled job',         desc: 'Run on a cron schedule' },
  { icon: Webhook,     label: 'Webhook trigger',        desc: 'React to HTTP events' },
  { icon: Sparkles,    label: 'AI pipeline',            desc: 'LLM prompt chain' },
  { icon: GitBranch,   label: 'Conditional branch',     desc: 'If/else decision tree' },
  { icon: Database,    label: 'Data sync',              desc: 'Fetch, transform, write' },
  { icon: Mail,        label: 'Notification flow',      desc: 'Alert via email/Slack' },
];

const RECENT_RUNS = [
  { id: 'r1', workflow: 'Daily Report Generator',  status: 'success' as RunStatus, trigger: 'Scheduled',  duration: '14s',  ts: '09:00',  date: 'Today' },
  { id: 'r2', workflow: 'API Health Monitor',       status: 'success' as RunStatus, trigger: 'Scheduled',  duration: '2s',   ts: '08:45',  date: 'Today' },
  { id: 'r3', workflow: 'Webhook → AI Classifier', status: 'failed'  as RunStatus, trigger: 'Webhook',    duration: '3s',   ts: '08:12',  date: 'Today' },
  { id: 'r4', workflow: 'Anomaly Alert',            status: 'success' as RunStatus, trigger: 'Scheduled',  duration: '8s',   ts: '08:00',  date: 'Today' },
  { id: 'r5', workflow: 'Design Token Sync',        status: 'success' as RunStatus, trigger: 'Manual',     duration: '6s',   ts: 'Yesterday', date: 'Yesterday' },
  { id: 'r6', workflow: 'Feedback Digest',          status: 'running' as RunStatus, trigger: 'Scheduled',  duration: '…',    ts: 'Now',    date: 'Today' },
];

/* ── Default workflow nodes ────────────────── */
const NODE_W = 248;
const NODE_H = 78;
const CX = 360; // center x for node left edge

function makeNodes(): WFNode[] {
  return [
    {
      id: 'n1', type: 'trigger', label: 'Schedule Trigger', desc: 'Daily at 09:00 UTC',
      x: CX, y: 40, width: NODE_W, height: NODE_H,
      config: [
        { key: 'frequency', label: 'Frequency', type: 'select', value: 'Daily', options: ['Hourly','Daily','Weekly','Monthly','Custom'] },
        { key: 'time',      label: 'Time (UTC)', type: 'text',  value: '09:00' },
        { key: 'days',      label: 'Days',       type: 'text',  value: 'Mon–Fri' },
        { key: 'timezone',  label: 'Timezone',   type: 'select', value: 'UTC', options: ['UTC','US/Eastern','Europe/London','Asia/Tokyo'] },
      ],
    },
    {
      id: 'n2', type: 'action', label: 'Fetch Analytics Data', desc: 'GET /api/analytics/summary',
      x: CX, y: 180, width: NODE_W, height: NODE_H,
      config: [
        { key: 'url',     label: 'URL',    type: 'text',   value: 'https://api.example.com/analytics/summary' },
        { key: 'method',  label: 'Method', type: 'select', value: 'GET', options: ['GET','POST','PUT','PATCH','DELETE'] },
        { key: 'headers', label: 'Headers (JSON)', type: 'textarea', value: '{"Authorization":"Bearer {{env.API_KEY}}"}' },
        { key: 'outVar',  label: 'Store as', type: 'text', value: 'analyticsData' },
      ],
    },
    {
      id: 'n3', type: 'ai', label: 'AI Analysis', desc: 'Gemini Flash — generate insights',
      x: CX, y: 320, width: NODE_W, height: NODE_H,
      config: [
        { key: 'model',  label: 'Model',  type: 'select', value: 'gemini-2.0-flash', options: ['gemini-2.0-flash','gemini-2.0-pro','claude-3-5-haiku','gpt-4o-mini'] },
        { key: 'prompt', label: 'System prompt', type: 'textarea', value: 'You are a data analyst. Given the following analytics data: {{analyticsData}}, generate a concise executive summary with 3 key insights and 2 action items.' },
        { key: 'outVar', label: 'Store as', type: 'text', value: 'aiSummary' },
        { key: 'maxTok', label: 'Max tokens', type: 'text', value: '1024' },
      ],
    },
    {
      id: 'n4', type: 'condition', label: 'Check Anomaly Score', desc: 'Route on {{analyticsData.score}} > 70',
      x: CX, y: 460, width: NODE_W, height: NODE_H,
      config: [
        { key: 'expr',      label: 'Condition expression', type: 'text', value: '{{analyticsData.score}} > 70' },
        { key: 'trueLabel', label: 'True branch label',    type: 'text', value: 'High priority' },
        { key: 'falseLabel',label: 'False branch label',   type: 'text', value: 'Routine' },
      ],
    },
    {
      id: 'n5', type: 'output', label: 'Send Report Email', desc: 'Email digest to team@example.com',
      x: CX, y: 600, width: NODE_W, height: NODE_H,
      config: [
        { key: 'channel',    label: 'Channel', type: 'select', value: 'Email', options: ['Email','Slack','Webhook','Notion'] },
        { key: 'to',         label: 'Recipients', type: 'text', value: 'team@example.com' },
        { key: 'subject',    label: 'Subject', type: 'text', value: 'Daily Analytics Report — {{date}}' },
        { key: 'body',       label: 'Body template', type: 'textarea', value: '{{aiSummary}}' },
      ],
    },
  ];
}

const LOGIC_YAML = `name: Daily Report Generator
version: "1.0"
description: Fetches analytics data, runs AI analysis, and emails a digest

trigger:
  type: schedule
  cron: "0 9 * * 1-5"
  timezone: UTC

env:
  API_KEY: "{{secrets.ANALYTICS_API_KEY}}"

steps:
  - id: fetch_data
    name: Fetch Analytics Data
    type: http
    config:
      url: https://api.example.com/analytics/summary
      method: GET
      headers:
        Authorization: "Bearer {{env.API_KEY}}"
    output: analyticsData

  - id: ai_analysis
    name: AI Analysis
    type: ai
    config:
      model: gemini-2.0-flash
      prompt: |
        You are a data analyst. Given the following analytics data:
        {{analyticsData}}
        Generate a concise executive summary with 3 key insights and 2 action items.
      max_tokens: 1024
    output: aiSummary

  - id: check_score
    name: Check Anomaly Score
    type: condition
    config:
      expression: "{{analyticsData.score}} > 70"
    branches:
      true: high_priority
      false: send_report

  - id: high_priority
    name: Flag High Priority
    type: action
    config:
      action: set_var
      key: priority
      value: high

  - id: send_report
    name: Send Report Email
    type: notify
    config:
      channel: email
      to: team@example.com
      subject: "Daily Analytics Report — {{date}}"
      body: "{{aiSummary}}"
`;

const RUN_LOGS: RunLog[] = [
  { id: 'l1', step: 'Schedule Trigger',      status: 'success', duration: '0ms',   ts: '09:00:00.012', msg: 'Triggered by cron schedule (0 9 * * 1-5)' },
  { id: 'l2', step: 'Fetch Analytics Data',  status: 'success', duration: '312ms', ts: '09:00:00.330', msg: 'GET 200 OK — 2.4KB response received' },
  { id: 'l3', step: 'AI Analysis',           status: 'success', duration: '1.8s',  ts: '09:00:02.148', msg: 'gemini-2.0-flash — 847 tokens, 3 insights generated' },
  { id: 'l4', step: 'Check Anomaly Score',   status: 'success', duration: '0ms',   ts: '09:00:02.149', msg: 'score=82 → condition TRUE → high_priority branch' },
  { id: 'l5', step: 'Send Report Email',     status: 'success', duration: '440ms', ts: '09:00:02.589', msg: 'Email delivered to 3 recipients — Message-ID: <abc123>' },
];

/* ═══════════════════════════════════════════
   Node type meta
═══════════════════════════════════════════ */
const NODE_META: Record<NodeType, { color: string; bg: string; Icon: React.ElementType; label: string }> = {
  trigger:   { color: '#004E51', bg: '#004E5118', Icon: CalendarClock,  label: 'Trigger' },
  action:    { color: '#2563eb', bg: '#2563eb18', Icon: Globe,           label: 'Action' },
  ai:        { color: '#7c3aed', bg: '#7c3aed18', Icon: Sparkles,        label: 'AI Step' },
  condition: { color: '#d97706', bg: '#d9770618', Icon: GitBranch,       label: 'Condition' },
  output:    { color: '#16a34a', bg: '#16a34a18', Icon: Send,            label: 'Output' },
};

/* ═══════════════════════════════════════════
   Sub-components
═══════════════════════════════════════════ */

function StatusIcon({ s, size = 14 }: { s: RunStatus; size?: number }) {
  const cls = `w-[${size}px] h-[${size}px]`;
  if (s === 'success') return <CheckCircle2 className={cls} style={{ width: size, height: size, color: '#16a34a' }} />;
  if (s === 'failed')  return <XCircle      className={cls} style={{ width: size, height: size, color: '#dc2626' }} />;
  if (s === 'running') return <Loader2      className={cls} style={{ width: size, height: size, color: '#2563eb' }} />;
  return <Pause className={cls} style={{ width: size, height: size, color: '#9ca3af' }} />;
}

function TriggerBadge({ type }: { type: TriggerFilter }) {
  const map: Record<TriggerFilter, { icon: React.ElementType; color: string }> = {
    all:       { icon: Hash,         color: '#6b7280' },
    scheduled: { icon: Clock,        color: '#2563eb' },
    webhook:   { icon: Webhook,      color: '#7c3aed' },
    event:     { icon: Zap,          color: '#d97706' },
    manual:    { icon: MousePointer, color: '#16a34a' },
    ai:        { icon: Sparkles,     color: '#ec4899' },
  };
  const m = map[type];
  return (
    <div className="flex items-center gap-1" style={{ color: m.color }}>
      <m.icon className="w-3 h-3" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   Workflows Home
═══════════════════════════════════════════ */
function WorkflowsHome({ onOpen }: { onOpen: (templateId?: string) => void }) {
  const [filter, setFilter] = useState<TriggerFilter>('all');
  const [search, setSearch] = useState('');

  const filters: TriggerFilter[] = ['all', 'scheduled', 'webhook', 'event', 'manual', 'ai'];
  const filterLabel: Record<TriggerFilter, string> = {
    all: 'All', scheduled: 'Scheduled', webhook: 'Webhook', event: 'Event', manual: 'Manual', ai: 'AI-triggered'
  };

  const filtered = TEMPLATES.filter(t =>
    (filter === 'all' || t.trigger === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto"
    >
      {/* Header */}
      <div className="border-b border-border bg-white px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Automation Hub</h1>
            <p className="text-sm text-muted-foreground">Build, schedule and monitor AI-powered workflows</p>
          </div>
          <button
            onClick={() => onOpen()}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-[#003a3d] transition-colors shrink-0"
            data-testid="button-new-workflow"
          >
            <Plus className="w-4 h-4" /> New Workflow
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total workflows', value: '8',    sub: '+2 this week' },
            { label: 'Active',          value: '5',    sub: '3 paused' },
            { label: 'Runs today',      value: '2,874', sub: '↑ 12% vs yesterday' },
            { label: 'Success rate',    value: '98.3%', sub: 'Last 7 days' },
          ].map(s => (
            <div key={s.label} className="bg-[#f7f7f7] rounded-xl px-4 py-3 border border-border">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-8 max-w-[1100px]">

        {/* Template browser */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Template Library</h2>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                <input
                  placeholder="Search templates…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="text-xs pl-8 pr-3 py-2 border border-border rounded-lg bg-[#f5f5f5] outline-none w-44 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 placeholder:text-muted-foreground/60 transition-all"
                  data-testid="input-search-templates"
                />
              </div>
            </div>
          </div>

          {/* Filter badges */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all',
                  filter === f
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-white text-muted-foreground border-border hover:border-primary/30 hover:text-foreground'
                )}
                data-testid={`filter-${f}`}
              >
                <TriggerBadge type={f} />
                {filterLabel[f]}
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.03 }}
                  className="group bg-white border border-border rounded-2xl p-4 flex flex-col gap-3 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onOpen(t.id)}
                  data-testid={`template-${t.id}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.color}18` }}>
                      <t.icon className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: t.color }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${t.color}18`, color: t.color }}>
                        {t.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground leading-snug">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{t.desc}</p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-border/50">
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><TriggerBadge type={t.trigger} />{filterLabel[t.trigger]}</span>
                      <span>{t.nodes} steps</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{t.runs.toLocaleString()} runs</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filtered.length === 0 && (
              <div className="col-span-4 py-12 text-center text-muted-foreground text-sm">No templates match your search.</div>
            )}
          </div>
        </section>

        {/* Starter patterns */}
        <section>
          <h2 className="text-base font-bold text-foreground mb-4">Start from a Pattern</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STARTER_PATTERNS.map(p => (
              <button
                key={p.label}
                onClick={() => onOpen()}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-border rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all group"
                data-testid={`starter-${p.label.toLowerCase().replace(/\s/g, '-')}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5f5f5] group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <p.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-[12px] font-semibold text-foreground">{p.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent runs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-foreground">Recent Runs</h2>
            <button className="text-xs font-medium text-primary hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-[#f7f7f7]">
                  {['Workflow', 'Status', 'Trigger', 'Duration', 'Time'].map(col => (
                    <th key={col} className="text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 py-3">{col}</th>
                  ))}
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody>
                {RECENT_RUNS.map((run, i) => (
                  <tr
                    key={run.id}
                    className={cn('border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors cursor-pointer', run.status === 'running' && 'bg-blue-50/40')}
                    data-testid={`run-row-${run.id}`}
                  >
                    <td className="px-4 py-3 text-[13px] font-medium text-foreground">{run.workflow}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'flex items-center gap-1.5 text-[11px] font-semibold w-fit',
                        run.status === 'success' && 'text-green-600',
                        run.status === 'failed'  && 'text-red-600',
                        run.status === 'running' && 'text-blue-600',
                      )}>
                        <StatusIcon s={run.status} size={12} />
                        {run.status === 'success' ? 'Success' : run.status === 'failed' ? 'Failed' : 'Running'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{run.trigger}</td>
                    <td className="px-4 py-3 font-mono text-[12px] text-muted-foreground">{run.duration}</td>
                    <td className="px-4 py-3 text-[12px] text-muted-foreground">{run.ts} {run.date !== 'Today' ? `· ${run.date}` : ''}</td>
                    <td className="px-2 py-3"><MoreHorizontal className="w-4 h-4 text-muted-foreground/50" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Workflow Builder
═══════════════════════════════════════════ */
function WorkflowBuilder({ onBack }: { onBack: () => void }) {
  const [nodes, setNodes] = useState<WFNode[]>(makeNodes());
  const [selectedNode, setSelectedNode] = useState<WFNode | null>(null);
  const [activeTab, setActiveTab] = useState<BuilderTab>('builder');
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState<string[]>([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const [workflowName, setWorkflowName] = useState('Daily Report Generator');
  const [saved, setSaved] = useState(true);
  const [runComplete, setRunComplete] = useState(false);

  /* canvas panning */
  const canvasRef = useRef<HTMLDivElement>(null);
  const CANVAS_W = 968;
  const CANVAS_H = 760;

  /* Simulate run */
  const handleRun = () => {
    setIsRunning(true);
    setRunProgress([]);
    setRunComplete(false);
    setLogsOpen(true);
    nodes.forEach((n, i) => {
      setTimeout(() => {
        setRunProgress(prev => [...prev, n.id]);
        if (i === nodes.length - 1) {
          setTimeout(() => { setIsRunning(false); setRunComplete(true); }, 400);
        }
      }, i * 700);
    });
  };

  /* Update a config field */
  const updateField = (nodeId: string, key: string, value: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId
      ? { ...n, config: n.config.map(f => f.key === key ? { ...f, value } : f) }
      : n
    ));
    setSaved(false);
    if (selectedNode?.id === nodeId) {
      setSelectedNode(prev => prev ? { ...prev, config: prev.config.map(f => f.key === key ? { ...f, value } : f) } : null);
    }
  };

  /* SVG connector path between two nodes (center-bottom → center-top) */
  const connectorPath = (a: WFNode, b: WFNode) => {
    const ax = a.x + a.width / 2;
    const ay = a.y + a.height;
    const bx = b.x + b.width / 2;
    const by = b.y;
    const cy = (ay + by) / 2;
    return `M ${ax} ${ay} C ${ax} ${cy}, ${bx} ${cy}, ${bx} ${by}`;
  };

  return (
    <motion.div
      key="builder"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col overflow-hidden min-h-0"
    >
      {/* ── Builder Topbar ─────────────────────────── */}
      <div className="bg-white border-b border-border px-4 py-2.5 flex items-center gap-3 shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors shrink-0"
          data-testid="button-builder-back"
        >
          <ArrowLeft className="w-4 h-4" /> Workflows
        </button>
        <div className="w-px h-5 bg-border shrink-0" />

        <input
          value={workflowName}
          onChange={e => { setWorkflowName(e.target.value); setSaved(false); }}
          className="text-sm font-semibold text-foreground bg-transparent outline-none border-b border-transparent hover:border-border focus:border-primary/40 transition-colors min-w-0 flex-1 max-w-[240px]"
          data-testid="input-workflow-name"
        />
        {!saved && <span className="text-[10px] text-amber-500 font-medium shrink-0">Unsaved</span>}

        {/* Tabs */}
        <div className="flex items-center bg-[#f0f0f0] p-0.5 rounded-lg ml-2">
          {(['builder', 'logic', 'runtime'] as BuilderTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-md text-[12px] font-medium transition-all capitalize',
                activeTab === tab ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
              data-testid={`tab-builder-${tab}`}
            >
              {tab === 'builder' && <Layers className="w-3 h-3" />}
              {tab === 'logic'   && <Code2  className="w-3 h-3" />}
              {tab === 'runtime' && <BarChart2 className="w-3 h-3" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setSaved(true); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg hover:bg-[#f5f5f5] transition-colors"
            data-testid="button-save-workflow"
          >
            <Save className="w-3.5 h-3.5" />
            {saved ? 'Saved' : 'Save'}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors',
              isRunning
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-primary text-primary-foreground hover:bg-[#003a3d]'
            )}
            data-testid="button-run-workflow"
          >
            {isRunning ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Running…</> : <><Play className="w-3.5 h-3.5" /> Run</>}
          </button>
        </div>
      </div>

      {/* ── Builder body ───────────────────────────── */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ── Left: Node palette ────── */}
        {activeTab === 'builder' && (
          <div className="w-[180px] bg-white border-r border-border flex flex-col shrink-0 overflow-y-auto">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 pt-4 pb-2">Add Step</p>
            <div className="flex flex-col gap-1 px-2 pb-4">
              {(Object.entries(NODE_META) as [NodeType, typeof NODE_META[NodeType]][]).map(([type, meta]) => (
                <div
                  key={type}
                  draggable
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-[#f5f5f5] cursor-grab active:cursor-grabbing transition-colors border border-transparent hover:border-border"
                  data-testid={`palette-${type}`}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                    <meta.Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground">{meta.label}</p>
                    <p className="text-[10px] text-muted-foreground capitalize">{type}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4 mt-auto">
              <div className="h-px bg-border mb-3" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Variables</p>
              {['analyticsData', 'aiSummary', 'date', 'priority'].map(v => (
                <div key={v} className="flex items-center gap-1.5 py-1 text-[11px] font-mono text-muted-foreground">
                  <Hash className="w-2.5 h-2.5 shrink-0" /> {v}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Centre: Canvas / Logic / Runtime ── */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">

          {/* BUILDER TAB */}
          {activeTab === 'builder' && (
            <div className="flex-1 overflow-auto" style={{ background: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
              <div ref={canvasRef} style={{ width: CANVAS_W, height: CANVAS_H, position: 'relative', margin: '0 auto' }}>

                {/* SVG connectors */}
                <svg className="absolute inset-0 pointer-events-none" width={CANVAS_W} height={CANVAS_H}>
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#d1d5db" />
                    </marker>
                  </defs>
                  {nodes.slice(0, -1).map((n, i) => {
                    const next = nodes[i + 1];
                    const isActive = runProgress.includes(n.id) && runProgress.includes(next.id);
                    return (
                      <path
                        key={`edge-${n.id}`}
                        d={connectorPath(n, next)}
                        fill="none"
                        stroke={isActive ? '#43FFC8' : '#e5e7eb'}
                        strokeWidth={isActive ? 2.5 : 2}
                        strokeDasharray={isRunning && runProgress.includes(n.id) && !runProgress.includes(next.id) ? '6 4' : undefined}
                        markerEnd="url(#arrow)"
                        style={{ transition: 'stroke 0.4s' }}
                      />
                    );
                  })}
                  {/* Condition branch line */}
                </svg>

                {/* Nodes */}
                {nodes.map(node => {
                  const meta = NODE_META[node.type];
                  const isSelected = selectedNode?.id === node.id;
                  const isActive = runProgress.includes(node.id);
                  const isPending = isRunning && !isActive;
                  return (
                    <motion.div
                      key={node.id}
                      style={{ position: 'absolute', left: node.x, top: node.y, width: node.width }}
                      onClick={() => setSelectedNode(isSelected ? null : node)}
                      animate={{ scale: isActive ? [1, 1.02, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      data-testid={`node-${node.id}`}
                    >
                      <div className={cn(
                        'flex items-start gap-3 p-3.5 rounded-2xl border-2 cursor-pointer transition-all shadow-sm',
                        isSelected    ? 'border-primary shadow-[0_0_0_3px_rgba(0,78,81,0.12)] bg-white'  : '',
                        !isSelected   ? 'border-border bg-white hover:border-primary/30 hover:shadow-md' : '',
                        isActive      ? '!border-[#43FFC8] !bg-[#43FFC808]' : '',
                        isPending && isRunning ? 'opacity-50' : '',
                      )}>
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: meta.bg }}>
                          {isActive && isRunning && !runComplete
                            ? <Loader2 className="w-4 h-4 animate-spin" style={{ color: meta.color }} />
                            : <meta.Icon className="w-4 h-4" style={{ color: meta.color }} />
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[12px] font-semibold text-foreground truncate">{node.label}</p>
                            {isActive && runComplete && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground truncate mt-0.5">{node.desc}</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block" style={{ background: meta.bg, color: meta.color }}>
                            {meta.label}
                          </span>
                        </div>
                        {isSelected && <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0 mt-1" />}
                      </div>
                    </motion.div>
                  );
                })}

                {/* + Add step button at bottom */}
                <div style={{ position: 'absolute', left: CX + NODE_W / 2 - 48, top: nodes[nodes.length - 1].y + NODE_H + 32 }}>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 border-2 border-dashed border-border rounded-xl text-xs font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                    data-testid="button-add-step"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add step
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOGIC TAB */}
          {activeTab === 'logic' && (
            <div className="flex-1 overflow-auto flex">
              <div className="flex-1 p-6 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Workflow Definition (YAML)</span>
                  <button className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid="button-copy-yaml">
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="bg-[#0f172a] rounded-2xl overflow-hidden border border-border">
                  <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="text-[11px] text-white/40 ml-2 font-mono">workflow.yaml</span>
                  </div>
                  <pre className="p-5 text-[12px] font-mono leading-relaxed overflow-auto text-green-300/90 max-h-[calc(100vh-260px)]">
                    {LOGIC_YAML}
                  </pre>
                </div>
              </div>
              <div className="w-[220px] border-l border-border bg-white p-4 flex flex-col gap-4 shrink-0 hidden lg:flex">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Variables</p>
                  {['analyticsData', 'aiSummary', 'date', 'priority'].map(v => (
                    <div key={v} className="flex items-center gap-1.5 py-1.5 border-b border-border/50 last:border-0">
                      <Hash className="w-3 h-3 text-muted-foreground shrink-0" />
                      <span className="font-mono text-[11px] text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Secrets</p>
                  {['ANALYTICS_API_KEY', 'SMTP_PASSWORD'].map(s => (
                    <div key={s} className="flex items-center gap-1.5 py-1.5 border-b border-border/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span className="font-mono text-[11px] text-foreground">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* RUNTIME TAB */}
          {activeTab === 'runtime' && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 max-w-[900px]">
              {/* Schedule config */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Schedule Configuration</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Frequency', value: 'Daily', desc: 'Every weekday (Mon–Fri)' },
                    { label: 'Time',      value: '09:00 UTC', desc: 'Next run in 16h 23m' },
                    { label: 'Status',    value: 'Active',    desc: 'Will auto-trigger on schedule' },
                    { label: 'Last run',  value: 'Today 09:00', desc: '14.2s — Success' },
                  ].map(s => (
                    <div key={s.label} className="flex flex-col gap-0.5">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
                      <p className="text-sm font-semibold text-foreground">{s.value}</p>
                      <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Run history */}
              <div className="bg-white border border-border rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground">Run History</h3>
                  <span className="text-[11px] text-muted-foreground">Last 7 days</span>
                </div>
                {[...RUN_LOGS, ...RUN_LOGS.slice(0, 3)].reverse().map((log, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border/50 last:border-0 hover:bg-[#f7f7f7] transition-colors">
                    <StatusIcon s="success" size={14} />
                    <span className="font-mono text-[11px] text-muted-foreground w-[80px] shrink-0">{log.ts}</span>
                    <span className="text-[12px] font-medium text-foreground flex-1 truncate">{log.step}</span>
                    <span className="font-mono text-[11px] text-muted-foreground">{log.duration}</span>
                  </div>
                ))}
              </div>

              {/* Environment */}
              <div className="bg-white border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Settings2 className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-foreground">Environment</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { key: 'ANALYTICS_API_KEY', value: '••••••••••••', status: 'set' },
                    { key: 'SMTP_PASSWORD',      value: '••••••••••••', status: 'set' },
                    { key: 'SLACK_WEBHOOK',      value: 'Not configured', status: 'missing' },
                  ].map(env => (
                    <div key={env.key} className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f7f7] border border-border">
                      <div className={cn('w-2 h-2 rounded-full shrink-0', env.status === 'set' ? 'bg-green-500' : 'bg-amber-500')} />
                      <span className="font-mono text-[12px] text-foreground flex-1">{env.key}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">{env.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Bottom logs panel ──── */}
          {activeTab === 'builder' && (
            <div className={cn('border-t border-border bg-[#0f172a] flex flex-col transition-all duration-300', logsOpen ? 'h-[220px]' : 'h-[36px]')}>
              <button
                onClick={() => setLogsOpen(v => !v)}
                className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white text-[11px] font-medium w-full shrink-0 border-b border-white/10"
                data-testid="button-toggle-logs"
              >
                <TerminalSquare className="w-3.5 h-3.5" />
                Run Logs
                {runComplete && <span className="flex items-center gap-1 text-green-400 ml-2"><CheckCircle2 className="w-3 h-3" /> All steps passed</span>}
                {isRunning && <span className="flex items-center gap-1 text-blue-400 ml-2"><Loader2 className="w-3 h-3 animate-spin" /> Running…</span>}
                <div className="ml-auto">{logsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}</div>
              </button>
              {logsOpen && (
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-0.5">
                  {RUN_LOGS.map((log, i) => {
                    const active = runProgress.length > i;
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: active ? 1 : 0.3, x: 0 }}
                        className="flex items-start gap-3 font-mono text-[11px] py-0.5"
                      >
                        <span className="text-white/30 w-[90px] shrink-0">{log.ts}</span>
                        <span className={cn('w-[14px] shrink-0', active ? 'text-green-400' : 'text-white/20')}>
                          {active ? '✓' : '○'}
                        </span>
                        <span className="text-blue-300 w-[160px] shrink-0 truncate">{log.step}</span>
                        <span className="text-white/60 truncate">{log.msg}</span>
                        <span className="text-white/30 ml-auto shrink-0">{log.duration}</span>
                      </motion.div>
                    );
                  })}
                  {!runProgress.length && (
                    <p className="text-white/30 text-[11px] font-mono p-2">Press Run to execute the workflow…</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: Config drawer ──────────────────── */}
        <AnimatePresence>
          {activeTab === 'builder' && selectedNode && (
            <motion.div
              key="config-panel"
              initial={{ x: 280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="w-[280px] bg-white border-l border-border flex flex-col overflow-hidden shrink-0"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  {(() => {
                    const meta = NODE_META[selectedNode.type];
                    return (
                      <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: meta.bg }}>
                        <meta.Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                      </div>
                    );
                  })()}
                  <p className="text-[13px] font-bold text-foreground truncate">{selectedNode.label}</p>
                </div>
                <button onClick={() => setSelectedNode(null)} className="p-1 text-muted-foreground hover:text-foreground rounded-lg transition-colors shrink-0" data-testid="button-close-config">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Fields */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {selectedNode.config.map(field => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{field.label}</label>
                    {field.type === 'select' && (
                      <select
                        value={field.value}
                        onChange={e => updateField(selectedNode.id, field.key, e.target.value)}
                        className="text-xs border border-border rounded-lg px-3 py-2 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                        data-testid={`field-${field.key}`}
                      >
                        {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    )}
                    {field.type === 'textarea' && (
                      <textarea
                        value={field.value}
                        onChange={e => updateField(selectedNode.id, field.key, e.target.value)}
                        rows={4}
                        className="text-xs font-mono border border-border rounded-lg px-3 py-2 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all leading-relaxed"
                        data-testid={`field-${field.key}`}
                      />
                    )}
                    {field.type === 'text' && (
                      <input
                        type="text"
                        value={field.value}
                        onChange={e => updateField(selectedNode.id, field.key, e.target.value)}
                        className="text-xs border border-border rounded-lg px-3 py-2 bg-[#f7f7f7] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                        data-testid={`field-${field.key}`}
                      />
                    )}
                  </div>
                ))}

                {/* Actions */}
                <div className="flex flex-col gap-1.5 pt-2 border-t border-border mt-auto">
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] transition-colors" data-testid="button-duplicate-node">
                    <Copy className="w-3.5 h-3.5" /> Duplicate step
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors" data-testid="button-delete-node">
                    <XCircle className="w-3.5 h-3.5" /> Delete step
                  </button>
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
   Root: WorkflowsView
═══════════════════════════════════════════ */
export function WorkflowsView() {
  const [mode, setMode] = useState<WorkflowMode>('home');

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === 'home' && (
          <WorkflowsHome key="home" onOpen={() => setMode('builder')} />
        )}
        {mode === 'builder' && (
          <WorkflowBuilder key="builder" onBack={() => setMode('home')} />
        )}
      </AnimatePresence>
    </div>
  );
}
