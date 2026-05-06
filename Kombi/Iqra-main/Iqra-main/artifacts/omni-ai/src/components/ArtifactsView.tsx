import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, Copy, Eye, Code2, Upload, ChevronDown, MoreHorizontal,
  ArrowLeft, ThumbsUp, ThumbsDown, RefreshCw, Download, File,
  Mic, AlertCircle, Check, Send, Paperclip, Globe, Gamepad2,
  LayoutDashboard, FileText, Sparkles, ClipboardList, ChevronRight,
  Zap, Database, Monitor, Package as PackageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════
   Data model
═══════════════════════════════════════════ */
type ArtifactType = 'document' | 'code' | 'system-ui' | 'prompt' | 'business';
type ArtifactStatus = 'draft' | 'published';
type PreviewKind = 'document' | 'ui' | 'code';

interface Artifact {
  id: string; title: string; type: ArtifactType; template: string;
  content: string; sourceCode: string; lastEdited: string;
  status: ArtifactStatus; previewKind: PreviewKind; tags?: string[];
}

const MOCK_ARTIFACTS: Artifact[] = [
  { id: '1', title: 'Danish Infrastructure Tender Agent System', type: 'system-ui', template: 'Apps and websites', content: 'AI-powered tender management platform for Banedanmark, Vejdirektoratet and Lokaltog', sourceCode: 'const TenderAgent = () => { ... }', lastEdited: '2 months ago', status: 'published', previewKind: 'ui', tags: ['AI', 'Agents'] },
  { id: '2', title: 'Product Requirements Document — OmniAI v2', type: 'document', template: 'Documents and templates', content: '# OmniAI v2 Product Requirements\n\n## Overview\n\nOmniAI v2 represents a significant leap forward in AI-native productivity...', sourceCode: '', lastEdited: '3 weeks ago', status: 'draft', previewKind: 'document', tags: ['PRD'] },
  { id: '3', title: 'TypeScript API Client Generator', type: 'code', template: 'Productivity tools', content: '', sourceCode: 'import axios from "axios";\n\ntype HttpMethod = "GET" | "POST" | "PUT" | "DELETE";\n\ninterface ApiConfig {\n  baseUrl: string;\n  headers?: Record<string, string>;\n  timeout?: number;\n}\n\nasync function createClient<T>(config: ApiConfig) {\n  const instance = axios.create({\n    baseURL: config.baseUrl,\n    timeout: config.timeout ?? 10000,\n    headers: config.headers,\n  });\n  return instance;\n}', lastEdited: '5 days ago', status: 'published', previewKind: 'code', tags: ['TypeScript'] },
  { id: '4', title: 'Q1 2026 Business Strategy Memo', type: 'business', template: 'Documents and templates', content: '# Q1 2026 Business Strategy\n\n## Executive Summary\n\nThis memo outlines our strategic priorities for Q1 2026, focusing on three core growth vectors...', sourceCode: '', lastEdited: '1 month ago', status: 'draft', previewKind: 'document', tags: ['Strategy'] },
  { id: '5', title: 'Lead Enrichment & Outreach Workflow', type: 'prompt', template: 'Productivity tools', content: 'You are a lead enrichment specialist. Given a company name and domain, research and return structured data including: company size, industry, tech stack, key decision-makers, and recent news.', sourceCode: '', lastEdited: '2 weeks ago', status: 'draft', previewKind: 'document', tags: ['Workflow'] },
  { id: '6', title: 'Revenue Analytics Dashboard', type: 'system-ui', template: 'Apps and websites', content: 'Real-time revenue tracking with cohort analysis', sourceCode: 'const Dashboard = () => <div>...</div>', lastEdited: '4 days ago', status: 'published', previewKind: 'ui', tags: ['Analytics'] },
  { id: '7', title: 'Design System Component Library', type: 'code', template: 'Productivity tools', content: '', sourceCode: 'import { cn } from "./utils";\n\nexport interface ButtonProps\n  extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  variant?: "primary" | "secondary" | "ghost";\n  size?: "sm" | "md" | "lg";\n}\n\nexport function Button({\n  variant = "primary",\n  size = "md",\n  className,\n  children,\n  ...props\n}: ButtonProps) {\n  return (\n    <button\n      className={cn(buttonVariants({ variant, size }), className)}\n      {...props}\n    >\n      {children}\n    </button>\n  );\n}', lastEdited: '1 week ago', status: 'draft', previewKind: 'code', tags: ['React'] },
  { id: '8', title: 'Market Analysis: EU AI Regulation Impact', type: 'document', template: 'Documents and templates', content: '# EU AI Act: Market Impact Analysis\n\n## Introduction\n\nThe European Union AI Act, which entered into force in August 2024, represents the world\'s first comprehensive legal framework for artificial intelligence...', sourceCode: '', lastEdited: '6 weeks ago', status: 'published', previewKind: 'document', tags: ['Research'] },
  { id: '9', title: 'Customer Onboarding Email Sequence', type: 'prompt', template: 'Creative projects', content: 'Generate a 7-email onboarding sequence for a B2B SaaS product. Each email should build on the previous, guiding the user from signup to first meaningful action.', sourceCode: '', lastEdited: '3 days ago', status: 'draft', previewKind: 'document', tags: ['Email'] },
  { id: '10', title: 'NPS Survey & Feedback Collector', type: 'system-ui', template: 'Quiz or survey', content: 'Net Promoter Score survey with conditional follow-up questions', sourceCode: 'const Survey = () => <div>...</div>', lastEdited: '2 weeks ago', status: 'draft', previewKind: 'ui', tags: ['Survey'] },
  { id: '11', title: 'PostgreSQL Schema & Migration Tool', type: 'code', template: 'Productivity tools', content: '', sourceCode: 'import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";\n\nexport const users = pgTable("users", {\n  id: text("id").primaryKey(),\n  email: text("email").notNull().unique(),\n  name: text("name"),\n  role: text("role").$type<"admin"|"member">().default("member"),\n  createdAt: timestamp("created_at").defaultNow(),\n});\n\nexport type User = typeof users.$inferSelect;\nexport type NewUser = typeof users.$inferInsert;', lastEdited: '10 days ago', status: 'published', previewKind: 'code', tags: ['SQL'] },
  { id: '12', title: 'Brand Voice & Tone Guidelines', type: 'document', template: 'Creative projects', content: '# Brand Voice Guidelines\n\n## Our Voice\n\nOmniAI speaks with clarity, confidence, and warmth. We are direct without being cold, technical without being jargon-heavy...', sourceCode: '', lastEdited: '1 month ago', status: 'draft', previewKind: 'document', tags: ['Brand'] },
];

const TEMPLATES = [
  { id: 'app',        label: 'Apps and websites',       icon: Globe,          desc: 'Interactive web apps, landing pages, tools',       color: '#1a1a1a' },
  { id: 'doc',        label: 'Documents and templates', icon: FileText,       desc: 'Reports, PRDs, memos, contracts',                   color: '#1a1a1a' },
  { id: 'game',       label: 'Games',                   icon: Gamepad2,       desc: 'Browser games, puzzles, interactive demos',        color: '#1a1a1a' },
  { id: 'tool',       label: 'Productivity tools',      icon: LayoutDashboard,desc: 'Dashboards, trackers, utilities',                  color: '#1a1a1a' },
  { id: 'creative',   label: 'Creative projects',       icon: Sparkles,       desc: 'Stories, scripts, brand work, prompts',            color: '#1a1a1a' },
  { id: 'quiz',       label: 'Quiz or survey',          icon: ClipboardList,  desc: 'Forms, surveys, knowledge checks',                 color: '#1a1a1a' },
  { id: 'scratch',    label: 'Start from scratch',      icon: PackageIcon,    desc: 'Blank canvas, your own structure',                 color: '#1a1a1a' },
];

type ChatMsgType = 'text' | 'progress' | 'error' | 'file';
interface ChatMessage { id: string; role: 'user' | 'assistant' | 'system'; content: string; type: ChatMsgType }

const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'm1', role: 'user', content: 'Build me a comprehensive tender agent system for Danish infrastructure procurement — covering Banedanmark, Vejdirektoratet, and Lokaltog procurement procedures.', type: 'text' },
  { id: 'm2', role: 'assistant', content: 'Analysed procurement regulations for Banedanmark and Vejdirektoratet…', type: 'progress' },
  { id: 'm3', role: 'assistant', content: 'Mapped agent roles to tender categories and CV requirements…', type: 'progress' },
  { id: 'm4', role: 'assistant', content: 'Orchestrated specialised agents for compliance and bid generation…', type: 'progress' },
  { id: 'm5', role: 'assistant', content: "I've built a comprehensive Danish Infrastructure Tender Agent System with 8 specialised agents across three groups. The system covers bid agents for each procurement authority, CV generation agents for qualification documents, and standard agents for regulatory compliance.", type: 'text' },
  { id: 'm6', role: 'assistant', content: '', type: 'file' },
  { id: 'm7', role: 'user', content: 'Can you add a dark mode toggle and improve the agent card hover states?', type: 'text' },
  { id: 'm8', role: 'assistant', content: 'Updating card interaction states and implementing theme toggle…', type: 'progress' },
];

/* ═══════════════════════════════════════════
   Dashboard card preview thumbnails
═══════════════════════════════════════════ */
function DocumentThumbnail({ title }: { title: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-[75%] h-[85%] bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm flex flex-col p-3 gap-1.5">
        <div className="h-2 bg-[#1a1a1a] rounded-full w-[60%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[85%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[70%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[80%]" />
        <div className="mt-2 h-1.5 bg-[#e5e5e5] rounded-full w-[40%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[90%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[65%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[75%]" />
        <div className="mt-2 h-1.5 bg-[#e5e5e5] rounded-full w-[50%]" />
        <div className="h-1.5 bg-[#d0d0d0] rounded-full w-[80%]" />
      </div>
    </div>
  );
}

function CodeThumbnail() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-[78%] h-[88%] bg-[#1e1e2e] rounded-xl overflow-hidden shadow-sm flex flex-col p-3 gap-1.5 font-mono">
        <div className="flex gap-1.5 mb-2"><div className="w-2 h-2 rounded-full bg-[#ff5f57]" /><div className="w-2 h-2 rounded-full bg-[#febc2e]" /><div className="w-2 h-2 rounded-full bg-[#28c840]" /></div>
        <div className="flex gap-2"><div className="h-1.5 bg-[#7c3aed] rounded w-[20%]" /><div className="h-1.5 bg-[#60a5fa] rounded w-[30%]" /></div>
        <div className="flex gap-2 pl-3"><div className="h-1.5 bg-[#a78bfa] rounded w-[15%]" /><div className="h-1.5 bg-[#34d399] rounded w-[25%]" /></div>
        <div className="flex gap-2 pl-6"><div className="h-1.5 bg-[#f87171] rounded w-[20%]" /><div className="h-1.5 bg-[#fbbf24] rounded w-[15%]" /><div className="h-1.5 bg-[#60a5fa] rounded w-[20%]" /></div>
        <div className="flex gap-2 pl-3"><div className="h-1.5 bg-[#94a3b8] rounded w-[40%]" /></div>
        <div className="flex gap-2"><div className="h-1.5 bg-[#7c3aed] rounded w-[12%]" /><div className="h-1.5 bg-[#94a3b8] rounded w-[20%]" /></div>
        <div className="flex gap-2 pl-3"><div className="h-1.5 bg-[#34d399] rounded w-[30%]" /></div>
        <div className="flex gap-2 pl-6"><div className="h-1.5 bg-[#60a5fa] rounded w-[18%]" /><div className="h-1.5 bg-[#fbbf24] rounded w-[25%]" /></div>
      </div>
    </div>
  );
}

function UiThumbnail() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-[78%] h-[88%] bg-[#0d1117] rounded-xl overflow-hidden shadow-sm flex flex-col p-3 gap-2">
        <div className="h-1.5 bg-[#58a6ff] rounded w-[55%]" />
        <div className="h-1 bg-[#8b949e] rounded w-[75%]" />
        <div className="mt-1 flex gap-1.5">
          <div className="flex-1 bg-[#161b22] rounded-lg p-2 flex flex-col gap-1">
            <div className="h-1 bg-[#58a6ff] rounded w-[60%]" />
            <div className="h-1 bg-[#8b949e] rounded w-[80%]" />
          </div>
          <div className="flex-1 bg-[#161b22] rounded-lg p-2 flex flex-col gap-1">
            <div className="h-1 bg-[#3fb950] rounded w-[50%]" />
            <div className="h-1 bg-[#8b949e] rounded w-[70%]" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="bg-[#21262d] rounded-md p-1.5 flex items-center gap-1.5"><div className="w-2 h-2 bg-[#58a6ff] rounded-sm shrink-0" /><div className="h-1 bg-[#c9d1d9] rounded flex-1" /></div>
          <div className="bg-[#21262d] rounded-md p-1.5 flex items-center gap-1.5"><div className="w-2 h-2 bg-[#3fb950] rounded-sm shrink-0" /><div className="h-1 bg-[#c9d1d9] rounded flex-1" /></div>
          <div className="bg-[#21262d] rounded-md p-1.5 flex items-center gap-1.5"><div className="w-2 h-2 bg-[#f78166] rounded-sm shrink-0" /><div className="h-1 bg-[#c9d1d9] rounded flex-1" /></div>
        </div>
      </div>
    </div>
  );
}

function PromptThumbnail() {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <div className="w-[75%] h-[85%] bg-white border border-[#e0e0e0] rounded-xl overflow-hidden shadow-sm flex flex-col p-3 gap-2">
        <div className="flex items-center gap-1.5"><div className="w-4 h-4 bg-[#1a1a1a] rounded-md flex items-center justify-center"><div className="w-2 h-2 bg-white rounded-sm" /></div><div className="h-1.5 bg-[#1a1a1a] rounded w-[40%]" /></div>
        <div className="bg-[#f5f5f5] rounded-lg p-2 flex flex-col gap-1">
          <div className="h-1 bg-[#ccc] rounded w-full" />
          <div className="h-1 bg-[#ccc] rounded w-[80%]" />
          <div className="h-1 bg-[#ccc] rounded w-[90%]" />
        </div>
        <div className="h-1.5 bg-[#e0e0e0] rounded w-[50%]" />
        <div className="bg-[#f5f5f5] rounded-lg p-2 flex flex-col gap-1">
          <div className="h-1 bg-[#ccc] rounded w-[70%]" />
          <div className="h-1 bg-[#ccc] rounded w-full" />
        </div>
      </div>
    </div>
  );
}

function ArtifactPreviewThumb({ type, previewKind }: { type: ArtifactType; previewKind: PreviewKind }) {
  if (previewKind === 'code') return <CodeThumbnail />;
  if (previewKind === 'ui') return <UiThumbnail />;
  if (type === 'prompt') return <PromptThumbnail />;
  return <DocumentThumbnail title="" />;
}

/* ═══════════════════════════════════════════
   1. Dashboard
═══════════════════════════════════════════ */
function ArtifactCard({ artifact, onClick }: { artifact: Artifact; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="text-left group"
      data-testid={`artifact-card-${artifact.id}`}
    >
      {/* Preview container */}
      <div
        className="w-full rounded-2xl border overflow-hidden mb-3 transition-all duration-200"
        style={{
          aspectRatio: '1.55',
          background: '#fafafa',
          borderColor: hovered ? '#c0c0c0' : '#e8e8e8',
          transform: hovered ? 'scale(1.015)' : 'scale(1)',
          boxShadow: hovered ? '0 4px 20px rgba(0,0,0,0.10)' : '0 1px 4px rgba(0,0,0,0.04)',
        }}
      >
        <ArtifactPreviewThumb type={artifact.type} previewKind={artifact.previewKind} />
      </div>
      {/* Meta */}
      <div className="px-0.5">
        <p className="text-[15px] font-semibold text-foreground truncate leading-tight mb-1">{artifact.title}</p>
        <p className="text-[12px] text-muted-foreground">Last edited {artifact.lastEdited}</p>
        {artifact.tags && (
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {artifact.tags.slice(0,2).map(t => (
              <span key={t} className="text-[10px] font-medium text-muted-foreground bg-[#f0f0f0] px-1.5 py-0.5 rounded-md">{t}</span>
            ))}
            <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-md', artifact.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-[#f0f0f0] text-muted-foreground')}>{artifact.status}</span>
          </div>
        )}
      </div>
    </button>
  );
}

function ArtifactsDashboard({ onNew, onOpen }: { onNew: () => void; onOpen: (a: Artifact) => void }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? MOCK_ARTIFACTS : MOCK_ARTIFACTS.slice(0, 9);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1140px] mx-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-[36px] font-bold text-foreground tracking-tight" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>Artifacts</h1>
            <p className="text-[13px] text-muted-foreground mt-1">Your generated apps, documents, and code</p>
          </div>
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] text-white text-[13px] font-semibold rounded-xl hover:bg-black transition-colors"
            data-testid="btn-new-artifact"
          >
            <Plus className="w-4 h-4" /> New artifact
          </button>
        </div>

        {/* Section label */}
        <div className="mb-5">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Your artifacts</p>
          <div className="h-px bg-border" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-9">
          {visible.map(a => (
            <ArtifactCard key={a.id} artifact={a} onClick={() => onOpen(a)} />
          ))}
        </div>

        {!showAll && MOCK_ARTIFACTS.length > 9 && (
          <div className="flex justify-center mt-10">
            <button onClick={() => setShowAll(true)} className="flex items-center gap-2 px-5 py-2.5 border border-border text-[13px] font-semibold text-muted-foreground rounded-xl hover:bg-[#f5f5f5] transition-colors">
              View {MOCK_ARTIFACTS.length - 9} more <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   2. Template selector
═══════════════════════════════════════════ */
function ArtifactNewView({ onSelect, onBack }: { onSelect: (template: string) => void; onBack: () => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[900px] mx-auto px-8 py-12">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to artifacts
        </button>
        <h1 className="text-[28px] font-bold text-foreground leading-snug mb-2 max-w-[640px]" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          Let's get cooking. Pick an artifact category or start building your idea from scratch.
        </h1>
        <p className="text-[13px] text-muted-foreground mb-10">OmniAI will scaffold your artifact with the right structure and get you started instantly.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => onSelect(t.label)}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              className="group text-left"
              data-testid={`template-${t.id}`}
            >
              <div
                className="flex flex-col justify-between p-5 rounded-2xl border bg-white transition-all duration-200 h-[160px]"
                style={{
                  borderColor: hovered === t.id ? '#aaa' : '#e8e8e8',
                  transform: hovered === t.id ? 'translateY(-2px)' : 'none',
                  boxShadow: hovered === t.id ? '0 6px 24px rgba(0,0,0,0.09)' : '0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div>
                  <p className="text-[14px] font-bold text-foreground leading-tight mb-1.5">{t.label}</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-xl bg-[#f5f5f5] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors">
                    <t.icon className="w-4 h-4 text-muted-foreground group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. Editor — Chat panel
═══════════════════════════════════════════ */
function ChatPanel({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [input, setInput] = useState('');
  const [model, setModel] = useState<'Opus 4.6' | 'Sonnet 4.5'>('Sonnet 4.5');
  const [usageLimited] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { id: `m${Date.now()}`, role: 'user', content: input, type: 'text' }]);
    setInput('');
    setTimeout(() => {
      setMessages(p => [...p, { id: `mp${Date.now()}`, role: 'assistant', content: 'Processing your request…', type: 'progress' }]);
    }, 400);
    setTimeout(() => {
      setMessages(p => {
        const filtered = p.filter(m => m.type !== 'progress');
        return [...filtered, { id: `mr${Date.now()}`, role: 'assistant', content: "I've updated the artifact based on your feedback.", type: 'text' }];
      });
    }, 1800);
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-border">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <span className="text-[12px] font-semibold text-muted-foreground">Conversation</span>
        <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map(msg => (
          <div key={msg.id}>
            {msg.role === 'user' && (
              <div className="flex justify-end">
                <div className="max-w-[88%] bg-[#f0f0f0] rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13px] text-foreground leading-relaxed">{msg.content}</div>
              </div>
            )}
            {msg.role === 'assistant' && msg.type === 'progress' && (
              <div className="flex items-center gap-2 px-1">
                <div className="w-1 h-1 rounded-full bg-muted-foreground/40 animate-pulse" />
                <p className="text-[12px] text-muted-foreground italic">{msg.content}</p>
              </div>
            )}
            {msg.role === 'assistant' && msg.type === 'text' && (
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 mt-0.5"><Sparkles className="w-3 h-3 text-white" /></div>
                  <p className="text-[13px] text-foreground leading-relaxed">{msg.content}</p>
                </div>
                <div className="flex items-center gap-1 pl-8">
                  <button className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                  <button className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
                  <button className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
                  <button className="p-1 text-muted-foreground/50 hover:text-foreground transition-colors"><RefreshCw className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
            {msg.role === 'assistant' && msg.type === 'error' && (
              <div className="flex flex-col gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                <div className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-500 shrink-0" /><p className="text-[12px] font-semibold text-red-700">Response could not be fully generated</p></div>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-red-600 hover:text-red-700 self-start"><RefreshCw className="w-3 h-3" /> Retry</button>
              </div>
            )}
            {msg.role === 'assistant' && msg.type === 'file' && (
              <div className="pl-8">
                <div className="flex items-center gap-3 p-3 border border-border rounded-xl bg-[#f9fafb] max-w-[260px]">
                  <div className="w-8 h-8 bg-primary/8 rounded-lg flex items-center justify-center shrink-0"><File className="w-4 h-4 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-foreground truncate">{artifact.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Document · MD</p>
                  </div>
                  <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"><Download className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Usage warning */}
      {usageLimited && (
        <div className="px-4 py-2.5 bg-amber-50 border-t border-amber-100">
          <p className="text-[11px] text-amber-700">Your org is out of extra usage for the month · Your limit resets at 11:50 PM · <span className="font-semibold cursor-pointer hover:underline">Buy more</span></p>
        </div>
      )}

      {/* Composer */}
      <div className="px-3 pb-3 pt-2 border-t border-border shrink-0">
        <div className="border border-border rounded-2xl bg-[#fafafa] overflow-hidden focus-within:ring-2 focus-within:ring-primary/15 transition-all">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Write a message…"
            rows={2}
            className="w-full px-4 py-3 text-[13px] bg-transparent outline-none resize-none placeholder:text-muted-foreground/50"
            data-testid="chat-input"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-1">
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-[#eee]"><Paperclip className="w-3.5 h-3.5" /></button>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <select value={model} onChange={e => setModel(e.target.value as typeof model)} className="appearance-none text-[11px] font-semibold text-muted-foreground bg-transparent pr-5 cursor-pointer outline-none">
                  <option>Sonnet 4.5</option>
                  <option>Opus 4.6</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-muted-foreground pointer-events-none" />
              </div>
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Mic className="w-3.5 h-3.5" /></button>
              <button
                onClick={send}
                className={cn('p-1.5 rounded-lg transition-all', input.trim() ? 'bg-[#1a1a1a] text-white hover:bg-black' : 'text-muted-foreground/30')}
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground/60 text-center mt-2">OmniAI is AI and can make mistakes. Please double-check responses.</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   3. Editor — Preview panel content
═══════════════════════════════════════════ */
function DocumentPreview({ artifact }: { artifact: Artifact }) {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-[740px] mx-auto px-10 py-12">
        <article className="prose prose-sm max-w-none" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, lineHeight: 1.3, marginBottom: '12px', fontFamily: 'Georgia, "Times New Roman", serif', color: '#0a0a0a' }}>{artifact.title}</h1>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#f0f0f0]" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="text-[11px] text-muted-foreground">Last edited {artifact.lastEdited}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full', artifact.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-[#f0f0f0] text-muted-foreground')}>{artifact.status}</span>
          </div>

          {artifact.id === '2' && (
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#1a1a1a' }}>Overview</h2>
              <p style={{ lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>OmniAI v2 represents a significant leap forward in AI-native productivity tooling. This document outlines the complete product requirements, design principles, and technical architecture for the next major release.</p>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#1a1a1a' }}>Problem Statement</h2>
              <p style={{ lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>Knowledge workers today switch between 8-12 tools daily. Context is lost at every boundary. AI is bolted on rather than native. The result is fragmented workflows, duplicated effort, and cognitive overhead that erodes deep work capacity.</p>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#1a1a1a' }}>Core Features</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: 'Inter, sans-serif', marginBottom: '24px' }}>
                <thead><tr style={{ borderBottom: '2px solid #e5e7eb' }}><th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#0a0a0a' }}>Feature</th><th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#0a0a0a' }}>Priority</th><th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: '#0a0a0a' }}>Status</th></tr></thead>
                <tbody>
                  {[['Universal Composer', 'P0', 'In progress'], ['Artifact Editor', 'P0', 'Complete'], ['Agent Builder', 'P1', 'Planned'], ['Design Systems', 'P1', 'Complete'], ['Explore Hub', 'P2', 'Complete']].map(([f, p, s]) => (
                    <tr key={f} style={{ borderBottom: '1px solid #f0f0f0' }}><td style={{ padding: '7px 12px', color: '#374151' }}>{f}</td><td style={{ padding: '7px 12px', color: '#6b7280', fontFamily: 'Inter, sans-serif', fontSize: '11px' }}>{p}</td><td style={{ padding: '7px 12px' }}><span style={{ background: s === 'Complete' ? '#dcfce7' : s === 'In progress' ? '#dbeafe' : '#f3f4f6', color: s === 'Complete' ? '#16a34a' : s === 'In progress' ? '#2563eb' : '#6b7280', padding: '2px 8px', borderRadius: '999px', fontSize: '10px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{s}</span></td></tr>
                  ))}
                </tbody>
              </table>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#1a1a1a' }}>Success Metrics</h2>
              <p style={{ lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>
                Time-to-first-artifact under 90 seconds.{'  '}<span style={{ background: '#f0f0f0', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>OmniAI +2</span>{'  '}
                DAU/MAU ratio above 0.45.{'  '}<span style={{ background: '#f0f0f0', padding: '1px 6px', borderRadius: '4px', fontSize: '11px', fontFamily: 'Inter, sans-serif', color: '#6b7280' }}>Benchmark +2</span>
              </p>
            </>
          )}
          {artifact.id !== '2' && (
            <>
              <p style={{ lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>{artifact.content}</p>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#1a1a1a' }}>Summary</h2>
              <p style={{ lineHeight: '1.7', color: '#374151', marginBottom: '16px' }}>This artifact was generated by OmniAI based on your instructions. The content above represents the primary output. You can continue the conversation to refine or expand any section.</p>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginTop: '32px', marginBottom: '12px', color: '#1a1a1a' }}>Next Steps</h2>
              <p style={{ lineHeight: '1.7', color: '#374151' }}>Share this document with collaborators, export it as PDF or DOCX, or continue refining it through the chat panel on the left.</p>
            </>
          )}
        </article>
      </div>
    </div>
  );
}

function SystemUIPreview({ artifact }: { artifact: Artifact }) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const AGENT_GROUPS = [
    {
      label: 'Tilbudsagenter', color: '#3b82f6', agents: [
        { id: 'bdk', label: 'BDK TilbudsAgent', desc: 'Banedanmark udbudsprocedurer og krav', icon: '🚂' },
        { id: 'vd', label: 'VD TilbudsAgent', desc: 'Vejdirektoratet infrastrukturudbud', icon: '🛣️' },
        { id: 'lt', label: 'Lokaltog TilbudsAgent', desc: 'Regional jernbane og stationsudbud', icon: '🚋' },
      ]
    },
    {
      label: 'CV Agenter', color: '#10b981', agents: [
        { id: 'vdcv', label: 'VD CV Agent', desc: 'CV-strukturering til Vejdirektoratet', icon: '📄' },
        { id: 'bdkcv', label: 'BDK CV Agent', desc: 'Specialiseret CV til Banedanmark', icon: '📋' },
        { id: 'ltcv', label: 'Lokaltog CV Agent', desc: 'Lokal CV- og kvalifikationsagent', icon: '📝' },
      ]
    },
    {
      label: 'Standard Agenter', color: '#8b5cf6', agents: [
        { id: 'bane', label: 'Banenormer Agent', desc: 'DS/EN-standarder og regler', icon: '⚖️' },
        { id: 'dsen', label: 'DS/EN Agent', desc: 'Europæiske standarder og compliance', icon: '🔍' },
      ]
    },
  ];
  return (
    <div className="h-full overflow-y-auto" style={{ background: '#0d1117' }}>
      <div className="max-w-[760px] mx-auto px-8 py-10">
        <div className="mb-8">
          <p className="text-[10px] font-bold text-[#58a6ff] uppercase tracking-widest mb-2">AI Agent Platform</p>
          <h1 className="text-[22px] font-bold text-white leading-tight mb-2">{artifact.title}</h1>
          <p className="text-[13px] text-[#8b949e] leading-relaxed">Specialiserede AI agenter til Banedanmark, Vejdirektoratet og Lokaltog udbudsprocedurer</p>
        </div>

        <div className="rounded-2xl border border-[#21262d] bg-[#161b22] p-5">
          <p className="text-[13px] font-bold text-[#c9d1d9] mb-4">Vælg Agent</p>
          <div className="flex flex-col gap-5">
            {AGENT_GROUPS.map(group => (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: group.color }}>{group.label}</p>
                <div className="grid grid-cols-1 gap-2">
                  {group.agents.map(agent => (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                      className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                      style={{
                        background: selectedAgent === agent.id ? `${group.color}15` : '#21262d',
                        borderColor: selectedAgent === agent.id ? group.color : '#30363d',
                      }}
                    >
                      <span className="text-lg shrink-0">{agent.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#c9d1d9] truncate">{agent.label}</p>
                        <p className="text-[11px] text-[#8b949e] mt-0.5">{agent.desc}</p>
                      </div>
                      {selectedAgent === agent.id && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: group.color }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {selectedAgent && (
            <button className="mt-5 w-full py-2.5 rounded-xl text-[13px] font-semibold text-white transition-colors" style={{ background: '#238636' }}>
              Start agent session →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CodePreview({ artifact }: { artifact: Artifact }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const lines = artifact.sourceCode.split('\n');
  return (
    <div className="h-full overflow-y-auto bg-[#1e1e2e] flex flex-col">
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#2a2a3e] shrink-0">
        <span className="text-[11px] font-bold text-[#7c7c9c] uppercase tracking-wider">Source</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-[11px] font-semibold text-[#7c7c9c] hover:text-white transition-colors">
          {copied ? <><Check className="w-3 h-3 text-green-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
        </button>
      </div>
      <div className="flex-1 overflow-auto p-5">
        <pre className="text-[12px] leading-relaxed font-mono">
          {lines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 text-[#4a4a6a] shrink-0 select-none text-right pr-4">{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

function syntaxHighlight(line: string): string {
  return line
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(import|export|const|type|interface|function|async|await|return|from|extends|default)\b/g, '<span style="color:#c792ea">$1</span>')
    .replace(/(".*?"|'.*?'|`.*?`)/g, '<span style="color:#c3e88d">$1</span>')
    .replace(/\b(true|false|null|undefined)\b/g, '<span style="color:#ff5370">$1</span>')
    .replace(/(\/\/.*$)/g, '<span style="color:#546e7a">$1</span>')
    .replace(/<(?!span|\/span)/g, '&lt;')
    || `<span style="color:#a6accd">${line}</span>`;
}

/* ═══════════════════════════════════════════
   3. Editor — root
═══════════════════════════════════════════ */
type PreviewMode = 'preview' | 'code';

function ArtifactEditorView({ artifact, onClose }: { artifact: Artifact; onClose: () => void }) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('preview');
  const [published, setPublished] = useState(artifact.status === 'published');
  const [publishing, setPublishing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [splitPct, setSplitPct] = useState(42);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const publish = () => {
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); }, 1200);
  };

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDragStart = useCallback(() => { isDragging.current = true; document.body.style.cursor = 'col-resize'; }, []);
  const handleDragEnd = useCallback(() => { isDragging.current = false; document.body.style.cursor = ''; }, []);
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(25, Math.min(70, pct)));
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
    return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleDragEnd); };
  }, [handleMouseMove, handleDragEnd]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#fafafa]">
      {/* Editor topbar */}
      <div className="flex items-center justify-between px-4 h-[52px] bg-white border-b border-border shrink-0 gap-3">
        {/* Left: back + title */}
        <div className="flex items-center gap-2 min-w-0">
          <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0" data-testid="btn-editor-back">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-1.5 text-[13px] font-semibold text-foreground hover:bg-[#f5f5f5] px-2 py-1 rounded-lg transition-colors truncate max-w-[300px]">
            <span className="truncate">{artifact.title}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          </button>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Preview / Code toggle */}
          <div className="flex items-center border border-border rounded-xl overflow-hidden mr-1">
            <button onClick={() => setPreviewMode('preview')} className={cn('p-2 transition-colors', previewMode === 'preview' ? 'bg-[#f0f0f0] text-foreground' : 'text-muted-foreground hover:bg-[#f5f5f5]')} title="Preview" data-testid="btn-preview-mode"><Eye className="w-3.5 h-3.5" /></button>
            <button onClick={() => setPreviewMode('code')} className={cn('p-2 transition-colors border-l border-border', previewMode === 'code' ? 'bg-[#f0f0f0] text-foreground' : 'text-muted-foreground hover:bg-[#f5f5f5]')} title="Source" data-testid="btn-code-mode"><Code2 className="w-3.5 h-3.5" /></button>
          </div>

          <button onClick={copy} className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold border border-border rounded-xl hover:bg-[#f5f5f5] transition-colors" data-testid="btn-copy-artifact">
            {copied ? <><Check className="w-3.5 h-3.5 text-green-600" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
          </button>

          <button onClick={publish} disabled={published || publishing} className={cn('flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-xl transition-all', published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-[#1a1a1a] text-white hover:bg-black')} data-testid="btn-publish">
            {publishing ? <><div className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Publishing…</> : published ? <><Check className="w-3.5 h-3.5" /> Published</> : <><Upload className="w-3.5 h-3.5" /> Publish</>}
          </button>

          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors" data-testid="btn-more"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Split pane */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* Left: chat */}
        <div style={{ width: `${splitPct}%`, minWidth: '280px' }} className="flex flex-col overflow-hidden">
          <ChatPanel artifact={artifact} onClose={onClose} />
        </div>

        {/* Resize handle */}
        <div
          onMouseDown={handleDragStart}
          className="w-[5px] bg-border hover:bg-primary/30 cursor-col-resize flex-shrink-0 transition-colors relative group"
          data-testid="resize-handle"
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-primary/10 transition-colors" />
        </div>

        {/* Right: preview */}
        <div className="flex-1 overflow-hidden">
          {previewMode === 'code' ? (
            <CodePreview artifact={artifact} />
          ) : artifact.previewKind === 'ui' ? (
            <SystemUIPreview artifact={artifact} />
          ) : (
            <DocumentPreview artifact={artifact} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Root: ArtifactsView
═══════════════════════════════════════════ */
type ArtifactsMode = 'dashboard' | 'new' | 'editor';

export function ArtifactsView() {
  const [mode, setMode] = useState<ArtifactsMode>('dashboard');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

  const openEditor = (a: Artifact) => { setSelectedArtifact(a); setMode('editor'); };
  const createFromTemplate = (template: string) => {
    const newArtifact: Artifact = {
      id: `new-${Date.now()}`,
      title: `New ${template} Artifact`,
      type: 'document',
      template,
      content: `# New ${template} Artifact\n\nStart building here…`,
      sourceCode: '',
      lastEdited: 'Just now',
      status: 'draft',
      previewKind: 'document',
      tags: ['New'],
    };
    setSelectedArtifact(newArtifact);
    setMode('editor');
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {mode === 'dashboard' && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
            <ArtifactsDashboard onNew={() => setMode('new')} onOpen={openEditor} />
          </motion.div>
        )}
        {mode === 'new' && (
          <motion.div key="new" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }} className="flex-1 flex flex-col overflow-hidden">
            <ArtifactNewView onSelect={createFromTemplate} onBack={() => setMode('dashboard')} />
          </motion.div>
        )}
        {mode === 'editor' && selectedArtifact && (
          <motion.div key="editor" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex-1 flex flex-col overflow-hidden">
            <ArtifactEditorView artifact={selectedArtifact} onClose={() => setMode('dashboard')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
