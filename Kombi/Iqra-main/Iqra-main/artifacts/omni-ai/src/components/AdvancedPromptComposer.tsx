import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Paperclip, ArrowUp, Plus, ChevronDown, X, Check,
  Users, Globe, Palette, Trophy, FileText, Image, Code2,
  Presentation, Bot, Sparkles, Database, Zap, File,
  Link, Layers, Grid3x3, ChevronRight,
  Folder, Camera, Github, Feather, Wrench, Building2, Puzzle, Server,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SpeechBackend } from '@/hooks/useSpeechCapture';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  useComposerVoice,
  VoiceModeOverlay,
  DictateIndicator,
  VoiceModeButton,
  DictateButton,
  TranscriptionBackendToggle,
  TranscriptionLanguagePicker,
} from '@/components/composer/voice';
import { ProjectPicker } from '@/components/composer/popovers/ProjectPicker';
import { StylePicker } from '@/components/composer/popovers/StylePicker';
import { ModelSelector } from '@/components/composer/popovers/ModelSelector';
import { ToolAccessMenu } from '@/components/composer/popovers/ToolAccessMenu';
import { GitHubSourcePicker } from '@/components/composer/popovers/GitHubSourcePicker';
import { DirectoryModal } from '@/components/composer/directory/DirectoryModal';
import {
  mockStyles, mockModels, mockCompanyKnowledgeItems,
} from '@/data/mockComposerData';
import type {
  ProjectMeta, StyleMeta, ModelMeta, ToolAccessMode,
  Plugin, ContextItem, DirectoryState, DirectoryTab,
} from '@/types/composer';
import {
  getSelectableAgents,
  type AgentScope,
  type WorkspaceAgent,
} from '@workspace/agents';
// when conversationType === 'Agent'). Lightweight metadata is
// derived from @workspace/agents so roster data stays canonical.

// ──────────────────────────────────────────────────────────
// Built-in selectable agents (shown in the Agent picker
// when conversationType === 'Agent'). Lightweight metadata
// only — full agent definitions live in AgentsView.
// ──────────────────────────────────────────────────────────
interface ComposerAgent {
  id: string;
  name: string;
  role: string;
  organization?: string;
  department?: string;
  scope: Extract<AgentScope, 'official' | 'team'>;
  avatarSrc?: string;
  /** Fallback initial when no avatar is available. */
  initial?: string;
  accentColor: string;
}

function getComposerAvatarSrc(agent: WorkspaceAgent): string | undefined {
  return agent.avatar?.src;
}

function getComposerInitial(agent: WorkspaceAgent): string {
  return agent.avatar?.fallbackInitial ?? agent.name
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

function toComposerAgent(agent: WorkspaceAgent): ComposerAgent {
  return {
    id: agent.id,
    name: agent.name,
    role: agent.role ?? agent.category ?? agent.name,
    organization: agent.organization,
    department: agent.department,
    scope: agent.scope as Extract<AgentScope, 'official' | 'team'>,
    avatarSrc: getComposerAvatarSrc(agent),
    initial: getComposerInitial(agent),
    accentColor: agent.avatar?.accentColor ?? agent.color,
  };
}

const COMPOSER_AGENTS: ComposerAgent[] = getSelectableAgents().map(toComposerAgent);

function ComposerAgentAvatar({ agent, size }: { agent: ComposerAgent; size: 'chip' | 'option' }) {
  const [failed, setFailed] = useState(false);
  const sizeClass = size === 'chip' ? 'w-4 h-4 text-[8px]' : 'w-7 h-7 text-[11px]';

  if (agent.avatarSrc && !failed) {
    return (
      <img
        src={agent.avatarSrc}
        alt={agent.name}
        onError={() => setFailed(true)}
        className={cn(sizeClass, 'rounded-full object-cover shrink-0 border')}
        style={{ borderColor: `${agent.accentColor}55` }}
        data-testid={size === 'chip' ? 'agent-chip-avatar' : undefined}
      />
    );
  }

  return (
    <span
      className={cn(sizeClass, 'rounded-full flex items-center justify-center font-bold text-white shrink-0')}
      style={{ background: agent.accentColor }}
    >
      {agent.initial ?? agent.name.charAt(0)}
    </span>
  );
}

// ──────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────

type Mode = 'Instant' | 'Fast' | 'Expert' | 'Heavy' | 'Auto';
type ConversationType = 'Chat' | 'Agent' | 'Research' | 'Build';
type OutputTarget = 'chat' | 'document' | 'code' | 'ui' | 'spreadsheet' | 'slides' | 'pdf' | 'image' | 'workflow';
type ToolsMode = 'off' | 'ask' | 'auto' | 'all';
type ConversationTypeSetBy = 'user' | 'team-mode' | 'deep-research' | 'slash-command' | 'quick-prompt' | null;
type ModeSetBy = 'user' | 'deep-research' | 'slash-command' | null;
type ActivePopover =
  | null | 'slash' | 'attachment' | 'context' | 'skill' | 'tool'
  | 'template' | 'output' | 'mode' | 'conversation' | 'quick-actions'
  | 'theme' | 'race'
  | 'project' | 'github-source' | 'style' | 'model' | 'tool-access'
  | 'agent';

type ContextItemStatus = 'connected' | 'disconnected' | 'requires-auth';
type QuickPromptId = 'create-slide-deck' | 'design-system' | 'document-to-skill' | 'analyze-data';

interface Attachment {
  id: string;
  name: string;
  fileType: string;
  size: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

interface QuickPromptMeta {
  id: QuickPromptId;
  label: string;
}

interface SelectedTemplate {
  id: string;
  title: string;
  category: string;
}

interface NormalizedSubmitPayload {
  prompt: string;
  mode: Mode;
  conversationType: ConversationType;
  outputTarget: OutputTarget;
  attachments: Attachment[];
  contextItems: string[];
  skills: string[];
  toolsPolicy: {
    toolsMode: ToolsMode;
    allowedTools: string[];
    requireConfirmation: boolean;
    toolAccessMode: ToolAccessMode;
  };
  selectedTemplate?: SelectedTemplate;
  voiceEnabled: boolean;
  teamModeEnabled: boolean;
  deepResearchEnabled: boolean;
  theme: { id: string; name: string; palette: string };
  raceMode?: RaceModeConfig;
  quickPrompt?: QuickPromptMeta;
  // Lightweight management metadata
  project?: { id: string; name: string; workspace?: string };
  style?: { id: string; label: string };
  model?: { id: string; label: string };
  adaptiveThinkingEnabled: boolean;
  plugins?: { id: string; name: string }[];
  /** Lightweight metadata of the agent the user selected when conversationType === 'Agent'. */
  agent?: { id: string; name: string; role?: string; organization?: string; department?: string };
  createdAt: string;
}

interface SlashCommand {
  id: string;
  command: string;
  title: string;
  description: string;
  category: 'Prompts' | 'Artifacts' | 'Tools' | 'Skills' | 'Agents' | 'Modes' | 'Manage';
  badge?: string;
  action: 'insert-template' | 'set-mode' | 'set-conversation-type' | 'set-output-target' | 'open-picker' | 'enable-tool' | 'open-directory';
  opens?: 'attachment' | 'context' | 'skill' | 'tool' | 'template' | 'output' | 'theme' | 'race' | 'project' | 'github-source' | 'style' | 'model' | 'tool-access';
  opensDirectory?: DirectoryTab;
}

interface RaceModeConfig {
  enabled: boolean;
  strategy: 'compare-models' | 'compare-agents' | 'parallel-drafts';
  candidates: string[];
}

// ──────────────────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────────────────

const MODES: Mode[] = ['Instant', 'Fast', 'Expert', 'Heavy', 'Auto'];
const CONVERSATION_TYPES: ConversationType[] = ['Chat', 'Agent', 'Research', 'Build'];

const CT_COLORS: Record<ConversationType, string> = {
  Chat: '#6b7280',
  Agent: '#7c3aed',
  Research: '#0284c7',
  Build: '#15803d',
};

const MODE_COLORS: Record<Mode, string> = {
  Instant: '#6b7280',
  Fast: '#d97706',
  Expert: '#7c3aed',
  Heavy: '#dc2626',
  Auto: '#004E51',
};

const SLASH_COMMANDS: SlashCommand[] = [
  { id: 'instant',  command: '/instant',  title: 'Instant',       description: 'Fast, snappy responses',                                            category: 'Modes',     badge: 'Mode',     action: 'set-mode' },
  { id: 'fast',     command: '/fast',     title: 'Fast',          description: 'Balanced speed and quality',                                        category: 'Modes',     badge: 'Mode',     action: 'set-mode' },
  { id: 'expert',   command: '/expert',   title: 'Expert',        description: 'Deep, thorough analysis',                                           category: 'Modes',     badge: 'Mode',     action: 'set-mode' },
  { id: 'auto',     command: '/auto',     title: 'Auto',          description: 'Let IQRA pick the best mode',                                       category: 'Modes',     badge: 'Mode',     action: 'set-mode' },
  { id: 'chat',     command: '/chat',     title: 'Chat',          description: 'Standard conversation',                                             category: 'Agents',    badge: 'Type',     action: 'set-conversation-type' },
  { id: 'agent',    command: '/agent',    title: 'Agent',         description: 'Autonomous task execution',                                         category: 'Agents',    badge: 'Agent',    action: 'set-conversation-type' },
  { id: 'research', command: '/research', title: 'Research',      description: 'Comprehensive research mode',                                       category: 'Agents',    badge: 'Research', action: 'set-conversation-type' },
  { id: 'build',    command: '/build',    title: 'Build',         description: 'Generate code or UI artifacts',                                     category: 'Artifacts', badge: 'Build',    action: 'set-conversation-type' },
  { id: 'attach',   command: '/attach',   title: 'Attach files',  description: 'Upload files or images',                                            category: 'Tools',     badge: 'File',     action: 'open-picker', opens: 'attachment' },
  { id: 'context',  command: '/context',  title: 'Add context',   description: 'Pull in documents or connectors',                                   category: 'Tools',     badge: 'Ctx',      action: 'open-picker', opens: 'context' },
  { id: 'skill',    command: '/skill',    title: 'Add skill',     description: 'Activate a prompt skill',                                           category: 'Skills',    badge: 'Skill',    action: 'open-picker', opens: 'skill' },
  { id: 'tool',     command: '/tool',     title: 'Tool policy',   description: 'Configure tool permissions',                                        category: 'Tools',     badge: 'Tool',     action: 'open-picker', opens: 'tool' },
  { id: 'template', command: '/template', title: 'Template',      description: 'Choose a prompt template',                                          category: 'Prompts',   badge: 'Tpl',      action: 'open-picker', opens: 'template' },
  { id: 'output',   command: '/output',   title: 'Output target', description: 'Where to send the result',                                          category: 'Artifacts', badge: 'Out',      action: 'open-picker', opens: 'output' },
  { id: 'theme',    command: '/theme',    title: 'Theme',         description: 'Choose a visual theme for this task or generated output.',           category: 'Modes',     badge: 'Theme',    action: 'open-picker', opens: 'theme' },
  { id: 'race',     command: '/race',     title: 'Race Mode',     description: 'Compare multiple models, agents or draft strategies.',               category: 'Agents',    badge: 'P2',       action: 'open-picker', opens: 'race' },
  { id: 'style',    command: '/style',    title: 'Use style',     description: 'Choose response tone and format.',                                    category: 'Prompts',   badge: 'Style',    action: 'open-picker', opens: 'style' },
  { id: 'model',    command: '/model',    title: 'Model',         description: 'Pick the underlying AI model.',                                       category: 'Modes',     badge: 'Model',    action: 'open-picker', opens: 'model' },
  { id: 'project',  command: '/project',  title: 'Add to project',description: 'Associate this prompt with a project.',                               category: 'Manage',    badge: 'Project',  action: 'open-picker', opens: 'project' },
  { id: 'github',   command: '/github',   title: 'Add from GitHub', description: 'Reference a repository or file as context.',                        category: 'Tools',     badge: 'Source',   action: 'open-picker', opens: 'github-source' },
  { id: 'tool-access', command: '/tool-access', title: 'Tool access', description: 'Choose how tools are loaded.',                                  category: 'Tools',     badge: 'Policy',   action: 'open-picker', opens: 'tool-access' },
  { id: 'directory',  command: '/directory',  title: 'Directory',  description: 'Browse skills, connectors and plugins.',                            category: 'Manage',    badge: 'Browse',   action: 'open-directory' },
  { id: 'skills',     command: '/skills',     title: 'Manage skills',     description: 'Browse and install skills.',                                  category: 'Manage',    badge: 'Skills',   action: 'open-directory', opensDirectory: 'skills' },
  { id: 'connectors', command: '/connectors', title: 'Manage connectors', description: 'Browse and connect external services.',                       category: 'Manage',    badge: 'Connect',  action: 'open-directory', opensDirectory: 'connectors' },
  { id: 'plugins',    command: '/plugins',    title: 'Manage plugins',    description: 'Browse plugins by category.',                                 category: 'Manage',    badge: 'Plugins',  action: 'open-directory', opensDirectory: 'plugins' },
  { id: 'mcps',       command: '/mcps',       title: 'Manage MCP servers', description: 'Browse and connect Model Context Protocol servers.',         category: 'Manage',    badge: 'MCP',      action: 'open-directory', opensDirectory: 'mcps' },
  { id: 'mcp',        command: '/mcp',        title: 'Add MCP server',     description: 'Connect a new MCP server (stdio, SSE or HTTP).',             category: 'Manage',    badge: 'MCP',      action: 'open-directory', opensDirectory: 'mcps' },
];

const MOCK_CONTEXT_ITEMS: { id: string; label: string; type: string; status: ContextItemStatus }[] = [
  { id: 'c1', label: 'Q2 Revenue Report',      type: 'document',  status: 'connected' },
  { id: 'c2', label: 'Product Roadmap',        type: 'document',  status: 'connected' },
  { id: 'c3', label: 'Notion — Design Specs',  type: 'connector', status: 'connected' },
  { id: 'c4', label: 'GitHub — omni-ai repo',  type: 'connector', status: 'requires-auth' },
  { id: 'c5', label: 'https://docs.iqra.ai',   type: 'url',       status: 'connected' },
];

// ── Quick prompt pill configuration ──
const QUICK_PROMPTS: Record<string, {
  id: QuickPromptId;
  outputTarget: OutputTarget;
  conversationType: ConversationType;
  hint: string;
  opensPicker: ActivePopover;
}> = {
  'Create slide deck':  { id: 'create-slide-deck',  outputTarget: 'slides',      conversationType: 'Build',    hint: 'Create a slide deck about ', opensPicker: null },
  'Design system':      { id: 'design-system',      outputTarget: 'ui',          conversationType: 'Build',    hint: 'Design a system for ',     opensPicker: null },
  'Document to skill':  { id: 'document-to-skill',  outputTarget: 'workflow',    conversationType: 'Build',    hint: '',                         opensPicker: 'skill' },
  'Analyze data':       { id: 'analyze-data',       outputTarget: 'spreadsheet', conversationType: 'Research', hint: 'Analyze this data: ',      opensPicker: 'attachment' },
};

const MOCK_SKILLS = [
  { id: 's1', label: 'Copywriting',        desc: 'Marketing-focused writing'    },
  { id: 's2', label: 'Code Review',        desc: 'Structured code feedback'     },
  { id: 's3', label: 'Research Synthesis', desc: 'Summarise multiple sources'   },
  { id: 's4', label: 'Meeting Notes',      desc: 'Extract action items'         },
];

const MOCK_THEMES = [
  { id: 'default',  label: 'Default',    color: '#004E51' },
  { id: 'midnight', label: 'Midnight',   color: '#1a1a2e' },
  { id: 'warm',     label: 'Warm Sand',  color: '#c9a96e' },
  { id: 'bloom',    label: 'Bloom',      color: '#e879a0' },
  { id: 'ocean',    label: 'Ocean',      color: '#0077b6' },
  { id: 'forest',   label: 'Forest',     color: '#2d6a4f' },
];

const RACE_STRATEGIES = [
  { id: 'compare-models'  as const, label: 'Compare models',   desc: 'Same prompt across multiple models' },
  { id: 'compare-agents'  as const, label: 'Compare agents',   desc: 'Multiple specialised agents'        },
  { id: 'parallel-drafts' as const, label: 'Parallel drafts',  desc: 'Generate output variations'         },
];

const RACE_CANDIDATES = ['Claude 4', 'GPT-4o', 'Gemini Ultra', 'IQRA Expert', 'IQRA Agent'];

const OUTPUT_TARGETS: { id: OutputTarget; label: string; icon: React.ReactNode }[] = [
  { id: 'chat',        label: 'Chat',        icon: <Bot className="w-4 h-4" />          },
  { id: 'document',    label: 'Document',    icon: <FileText className="w-4 h-4" />     },
  { id: 'code',        label: 'Code',        icon: <Code2 className="w-4 h-4" />        },
  { id: 'ui',          label: 'UI',          icon: <Layers className="w-4 h-4" />       },
  { id: 'spreadsheet', label: 'Spreadsheet', icon: <Grid3x3 className="w-4 h-4" />     },
  { id: 'slides',      label: 'Slides',      icon: <Presentation className="w-4 h-4" /> },
  { id: 'image',       label: 'Image',       icon: <Image className="w-4 h-4" />        },
  { id: 'workflow',    label: 'Workflow',     icon: <Zap className="w-4 h-4" />          },
];

// ──────────────────────────────────────────────────────────
// Shared popover wrapper
// ──────────────────────────────────────────────────────────

function PopoverPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={cn(
        'absolute z-50 bg-white border border-border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────
// QuickActionMenu
// ──────────────────────────────────────────────────────────

interface QuickActionMenuProps {
  isTeamModeEnabled: boolean;
  isDeepResearchEnabled: boolean;
  onToggleTeamMode: () => void;
  onToggleDeepResearch: () => void;
  onOpenAttachment: () => void;
  onOpenRace: () => void;
  onOpenTheme: () => void;
  onOpenProject: () => void;
  onTakeScreenshot: () => void;
  onOpenGitHubSource: () => void;
  onOpenCompanyKnowledge: () => void;
  onOpenStyle: () => void;
  onOpenToolAccess: () => void;
  onOpenMCPs: () => void;
  onClose: () => void;
}

function QuickActionMenu({
  isTeamModeEnabled, isDeepResearchEnabled,
  onToggleTeamMode, onToggleDeepResearch,
  onOpenAttachment, onOpenRace, onOpenTheme,
  onOpenProject, onTakeScreenshot, onOpenGitHubSource,
  onOpenCompanyKnowledge, onOpenStyle, onOpenToolAccess,
  onOpenMCPs,
  onClose,
}: QuickActionMenuProps) {
  // NOTE: items that open another popover MUST NOT call onClose(), because
  // onClose() sets activePopover to null and would overwrite the new popover
  // state. They simply transition activePopover to the next id.
  const items = [
    {
      label: 'Add to project',
      desc: 'Associate this prompt with a project',
      icon: <Folder className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenProject,
      testId: 'qam-project',
    },
    {
      label: 'Attachments',
      desc: 'Upload files or images',
      icon: <Paperclip className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenAttachment,
      testId: 'qam-attachments',
    },
    {
      label: 'Take a screenshot',
      desc: 'Attach a screenshot as context',
      icon: <Camera className="w-4 h-4" />,
      toggle: false,
      sub: false,
      onClick: () => { onTakeScreenshot(); onClose(); },
      testId: 'qam-screenshot',
    },
    {
      label: 'Add from GitHub',
      desc: 'Reference a repo or file',
      icon: <Github className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenGitHubSource,
      testId: 'qam-github',
    },
    {
      label: 'Company Knowledge',
      desc: 'Virksomhedsviden',
      icon: <Building2 className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenCompanyKnowledge,
      testId: 'qam-company-knowledge',
    },
    {
      label: 'Use style',
      desc: 'Response tone and format',
      icon: <Feather className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenStyle,
      testId: 'qam-style',
    },
    {
      label: 'Tool access',
      desc: 'How tools are loaded',
      icon: <Wrench className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenToolAccess,
      testId: 'qam-tool-access',
    },
    {
      label: 'MCP servers',
      desc: 'Manage Model Context Protocol servers',
      icon: <Server className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenMCPs,
      testId: 'qam-mcps',
    },
    {
      label: 'Team Mode',
      desc: 'Multi-agent collaboration',
      icon: <Users className="w-4 h-4" />,
      active: isTeamModeEnabled,
      toggle: true,
      onClick: onToggleTeamMode,
      testId: 'qam-team-mode',
    },
    {
      label: 'Deep Research',
      desc: 'Web-search enhanced analysis',
      icon: <Globe className="w-4 h-4" />,
      active: isDeepResearchEnabled,
      toggle: true,
      onClick: onToggleDeepResearch,
      testId: 'qam-deep-research',
    },
    {
      label: 'Race Mode',
      desc: 'Compare models or agents',
      icon: <Trophy className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenRace,
      testId: 'qam-race',
    },
    {
      label: 'Theme',
      desc: 'Visual theme for this task',
      icon: <Palette className="w-4 h-4" />,
      toggle: false,
      sub: true,
      onClick: onOpenTheme,
      testId: 'qam-theme',
    },
  ];

  return (
    <div className="py-1 max-h-[260px] overflow-y-auto overscroll-contain" data-testid="qam-scroll">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5 sticky top-0 bg-white z-10">Quick actions</p>
      {items.map(item => (
        <button
          key={item.label}
          onMouseDown={e => e.preventDefault()}
          onClick={item.onClick}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted group',
            item.active ? 'text-primary' : 'text-foreground'
          )}
          data-testid={item.testId}
        >
          <span className={cn('shrink-0', item.active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')}>{item.icon}</span>
          <div className="flex-1 text-left min-w-0">
            <p className="font-medium text-sm leading-none">{item.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-none">{item.desc}</p>
          </div>
          {item.toggle && (
            <div className={cn('w-8 h-4 rounded-full transition-colors shrink-0 flex items-center', item.active ? 'bg-primary' : 'bg-muted-foreground/20')}>
              <div className={cn('w-3 h-3 bg-white rounded-full shadow transition-transform mx-0.5', item.active ? 'translate-x-4' : 'translate-x-0')} />
            </div>
          )}
          {item.sub && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
        </button>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// AttachmentMenuContent
// ──────────────────────────────────────────────────────────

const ATTACHMENT_OPTIONS = [
  { label: 'Upload from device', icon: <File className="w-4 h-4" />, type: 'device' },
  { label: 'Paste URL',          icon: <Link className="w-4 h-4" />, type: 'url'    },
  { label: 'From connectors',    icon: <Database className="w-4 h-4" />, type: 'connector' },
];

const MOCK_NAMES = ['Q2_report.pdf', 'design-specs.png', 'data.csv', 'wireframe.fig', 'notes.docx'];
const MOCK_TYPES = ['PDF', 'PNG', 'CSV', 'FIG', 'DOCX'];
const MOCK_SIZES = ['1.2 MB', '340 KB', '88 KB', '2.1 MB', '56 KB'];

function AttachmentMenuContent({
  onAddAttachment,
  onClose,
}: { onAddAttachment: (name: string, type: string, size: string) => void; onClose: () => void }) {
  const handlePick = (optType: string) => {
    const i = Math.floor(Math.random() * MOCK_NAMES.length);
    onAddAttachment(MOCK_NAMES[i], MOCK_TYPES[i], MOCK_SIZES[i]);
    if (optType !== 'connector') onClose();
  };

  return (
    <div className="py-1">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">Attach</p>
      {ATTACHMENT_OPTIONS.map(opt => (
        <button
          key={opt.label}
          onMouseDown={e => e.preventDefault()}
          onClick={() => handlePick(opt.type)}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors group"
          data-testid={`attach-${opt.type}`}
        >
          <span className="text-muted-foreground group-hover:text-foreground shrink-0">{opt.icon}</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// SlashCommandMenu
// ──────────────────────────────────────────────────────────

const CATEGORY_ORDER = ['Modes', 'Agents', 'Artifacts', 'Prompts', 'Skills', 'Tools', 'Manage'] as const;

function SlashCommandMenu({ commands, onSelect }: { commands: SlashCommand[]; onSelect: (cmd: SlashCommand) => void }) {
  const grouped = CATEGORY_ORDER.reduce<Record<string, SlashCommand[]>>((acc, cat) => {
    const cmds = commands.filter(c => c.category === cat);
    if (cmds.length) acc[cat] = cmds;
    return acc;
  }, {});

  if (!commands.length) {
    return <div className="px-4 py-8 text-center text-sm text-muted-foreground">No commands found</div>;
  }

  return (
    <div className="py-1">
      {Object.entries(grouped).map(([cat, cmds]) => (
        <div key={cat}>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5 mt-1">{cat}</p>
          {cmds.map(cmd => (
            <button
              key={cmd.id}
              onMouseDown={e => e.preventDefault()}
              onClick={() => onSelect(cmd)}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors group"
              data-testid={`slash-${cmd.id}`}
            >
              <span className="font-mono text-primary text-xs font-bold w-20 shrink-0 text-left">{cmd.command}</span>
              <div className="flex-1 text-left min-w-0">
                <p className="font-medium text-foreground leading-none">{cmd.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{cmd.description}</p>
              </div>
              {cmd.badge && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">{cmd.badge}</span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Context Picker
// ──────────────────────────────────────────────────────────

function ContextPickerContent({
  items, companyKnowledge, selected, onToggle, onClose, onManageConnectors,
}: {
  items: typeof MOCK_CONTEXT_ITEMS;
  companyKnowledge: ContextItem[];
  selected: string[];
  onToggle: (item: { id: string; title: string; sourceType: 'company-knowledge' | 'document' | 'connector' | 'url' }) => void;
  onClose: () => void;
  onManageConnectors?: () => void;
  filter?: 'all' | 'company-knowledge';
}) {
  const iconFor = (type: string) => {
    if (type === 'connector') return <Database className="w-3.5 h-3.5 text-sky-500" />;
    if (type === 'url') return <Link className="w-3.5 h-3.5 text-emerald-500" />;
    if (type === 'company-knowledge') return <Building2 className="w-3.5 h-3.5 text-violet-500" />;
    return <FileText className="w-3.5 h-3.5 text-blue-500" />;
  };

  return (
    <div className="py-1">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">Add context</p>
      {items.map(item => {
        const active = selected.includes(item.id);
        return (
          <button
            key={item.id}
            onMouseDown={e => e.preventDefault()}
            onClick={() => onToggle({
              id: item.id,
              title: item.label,
              sourceType: (item.type as 'document' | 'connector' | 'url'),
            })}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            data-testid={`ctx-${item.id}`}
          >
            {iconFor(item.type)}
            <span className="flex-1 text-left truncate text-foreground">{item.label}</span>
            {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
          </button>
        );
      })}
      {companyKnowledge.length > 0 && (
        <>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">Company Knowledge</p>
          {companyKnowledge.map(item => {
            const active = selected.includes(item.id);
            return (
              <button
                key={item.id}
                onMouseDown={e => e.preventDefault()}
                onClick={() => onToggle({ id: item.id, title: item.title, sourceType: 'company-knowledge' })}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                data-testid={`ctx-${item.id}`}
              >
                {iconFor('company-knowledge')}
                <span className="flex-1 text-left truncate text-foreground">{item.title}</span>
                {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </>
      )}
      {selected.length > 0 && (
        <div className="border-t border-border/50 px-4 py-2">
          <button onClick={onClose} className="w-full py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-[#003a3d] transition-colors">
            Add {selected.length} item{selected.length > 1 ? 's' : ''}
          </button>
        </div>
      )}
      {onManageConnectors && (
        <div className="border-t border-border/50">
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={onManageConnectors}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            data-testid="ctx-manage-connectors"
          >
            <Database className="w-3.5 h-3.5" />
            Manage connectors
          </button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Skill Picker
// ──────────────────────────────────────────────────────────

function SkillPickerContent({
  skills, selected, onToggle, onManageSkills,
}: {
  skills: typeof MOCK_SKILLS;
  selected: string[];
  onToggle: (id: string) => void;
  onClose: () => void;
  onManageSkills?: () => void;
}) {
  return (
    <div className="py-1">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">Skills</p>
      {skills.map(skill => {
        const active = selected.includes(skill.id);
        return (
          <button
            key={skill.id}
            onMouseDown={e => e.preventDefault()}
            onClick={() => onToggle(skill.id)}
            className={cn('w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-muted', active && 'bg-primary/5')}
            data-testid={`skill-${skill.id}`}
          >
            <Sparkles className={cn('w-4 h-4 shrink-0', active ? 'text-primary' : 'text-muted-foreground')} />
            <div className="flex-1 text-left min-w-0">
              <p className="font-medium text-foreground leading-none">{skill.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{skill.desc}</p>
            </div>
            {active && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
          </button>
        );
      })}
      {onManageSkills && (
        <div className="border-t border-border/50 mt-1">
          <button
            onMouseDown={e => e.preventDefault()}
            onClick={onManageSkills}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            data-testid="skill-manage"
          >
            <Puzzle className="w-3.5 h-3.5" />
            Manage skills
          </button>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Theme Picker
// ──────────────────────────────────────────────────────────

function ThemePickerContent({
  themes, selected, onSelect,
}: { themes: typeof MOCK_THEMES; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="p-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 pb-2">Theme</p>
      <div className="grid grid-cols-3 gap-2">
        {themes.map(t => (
          <button
            key={t.id}
            onMouseDown={e => e.preventDefault()}
            onClick={() => onSelect(t.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all',
              selected === t.id ? 'border-primary bg-primary/5' : 'border-transparent hover:border-border hover:bg-muted'
            )}
            data-testid={`theme-${t.id}`}
          >
            <div className="w-8 h-8 rounded-lg shadow-sm" style={{ background: t.color }} />
            <span className="text-[10px] font-semibold text-foreground leading-none text-center">{t.label}</span>
            {selected === t.id && <Check className="w-3 h-3 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Race Mode Picker
// ──────────────────────────────────────────────────────────

function RaceModePickerContent({
  config, candidates, strategies, onUpdate, onClose,
}: {
  config: RaceModeConfig;
  candidates: string[];
  strategies: typeof RACE_STRATEGIES;
  onUpdate: (updates: Partial<RaceModeConfig>) => void;
  onClose: () => void;
}) {
  return (
    <div className="p-3 flex flex-col gap-3">
      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Race Mode</p>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-foreground">Strategy</p>
        {strategies.map(s => (
          <button
            key={s.id}
            onMouseDown={e => e.preventDefault()}
            onClick={() => onUpdate({ strategy: s.id })}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors text-left border',
              config.strategy === s.id ? 'border-primary/30 bg-primary/5 text-primary' : 'border-transparent hover:bg-muted text-foreground'
            )}
            data-testid={`race-strategy-${s.id}`}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm leading-none">{s.label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{s.desc}</p>
            </div>
            {config.strategy === s.id && <Check className="w-3.5 h-3.5 shrink-0" />}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold text-foreground">Candidates</p>
        <div className="flex flex-wrap gap-1.5">
          {candidates.map(c => {
            const active = config.candidates.includes(c);
            return (
              <button
                key={c}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  const next = active
                    ? config.candidates.filter(x => x !== c)
                    : [...config.candidates, c];
                  onUpdate({ candidates: next });
                }}
                className={cn(
                  'px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all',
                  active ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                )}
                data-testid={`race-candidate-${c.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onMouseDown={e => e.preventDefault()}
        onClick={() => { onUpdate({ enabled: true }); onClose(); }}
        disabled={config.candidates.length < 2}
        className="w-full py-2 bg-primary text-white text-xs font-bold rounded-xl hover:bg-[#003a3d] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        data-testid="race-start"
      >
        Start Race ({config.candidates.length} candidates)
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Props
// ──────────────────────────────────────────────────────────

export interface AdvancedPromptComposerProps {
  placeholder?: string;
  onSubmit?: (value: string, payload: NormalizedSubmitPayload) => void;
  suggestions?: Array<{ icon: React.ReactNode; label: string; onClick?: () => void }>;
  maxHeight?: number;
  /**
   * Optional. When voice mode (Stemmetilstand) is active, this is invoked with
   * the user's transcribed turn so the host can produce an assistant reply.
   * The returned text is read aloud through the browser's SpeechSynthesis API.
   * If not provided, a localised acknowledgement is spoken instead.
   */
  getVoiceReply?: (transcript: string) => string | Promise<string>;
  /** Locale for SpeechRecognition + SpeechSynthesis. Defaults to 'da-DK'. */
  speechLang?: string;
  /**
   * Optional preferred TTS voice URI (matches `SpeechSynthesisVoice.voiceURI`).
   * If omitted or unavailable, the browser picks a default voice for `speechLang`.
   */
  speechVoiceURI?: string | null;
  /**
   * Which transcription backend to use for the mic.
   *  - `'browser'` — Web Speech API (Chrome/Edge only, free, low-latency).
   *  - `'server'` — POSTs recorded audio to `/api/transcribe` which proxies
   *     to OpenAI's Whisper-class transcription model. Works in Safari and
   *     Firefox.
   * If omitted, the user's last choice from the in-composer toggle is used,
   * defaulting to `'browser'`.
   */
  transcriptionBackend?: SpeechBackend;
  /**
   * BCP-47 locale code used for transcription (browser SpeechRecognition +
   * `language` field on POST /api/transcribe). When omitted, the user's
   * last choice from the in-composer language picker is used, defaulting to
   * `speechLang`.
   */
  transcriptionLanguage?: string;
  /**
   * Optional. Fires once when voice mode (Stemmetilstand) transitions from
   * active to inactive — whether via the overlay's Afslut button, the
   * VoiceModeButton toggle, or any internal cleanup path. Hosts use this to
   * surface the spoken conversation in the visible chat thread once the
   * overlay closes.
  */
  onVoiceEnd?: () => void;
  /** Active agent controlled by the host when a user selects an agent elsewhere. */
  selectedAgentId?: string | null;
  /** Notifies the host when the composer agent chip changes. */
  onSelectedAgentIdChange?: (agentId: string | null) => void;
}

// ──────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────

export function AdvancedPromptComposer({
  placeholder = "Ask anything or type '/' for commands…",
  onSubmit,
  suggestions = [],
  maxHeight = 200,
  getVoiceReply,
  speechLang = 'da-DK',
  speechVoiceURI = null,
  transcriptionBackend: transcriptionBackendProp,
  transcriptionLanguage: transcriptionLanguageProp,
  onVoiceEnd,
  selectedAgentId,
  onSelectedAgentIdChange,
}: AdvancedPromptComposerProps) {
  // ── Core ──────────────────────────────────
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // Voice callback routes transcripts back through handleSubmit — kept in a
  // ref so the speech hook never sees a stale closure. Assigned after handleSubmit is defined below.
  const handleSubmitRef = useRef<(override?: string) => void>(() => {});

  // ── Conversation type + guard ─────────────
  const [selectedConversationType, setSelectedConversationType] = useState<ConversationType>('Chat');
  const [selectedComposerAgent, setSelectedComposerAgent] = useState<ComposerAgent | null>(null);
  const [lastConversationTypeSetBy, setLastConversationTypeSetBy] = useState<ConversationTypeSetBy>(null);

  // ── Mode + guard ──────────────────────────
  const [selectedMode, setSelectedMode] = useState<Mode>('Instant');
  const [lastModeSetBy, setLastModeSetBy] = useState<ModeSetBy>(null);

  // ── Capabilities ──────────────────────────
  const [isTeamModeEnabled, setIsTeamModeEnabled] = useState(false);
  const [isDeepResearchEnabled, setIsDeepResearchEnabled] = useState(false);

  // ── Race mode ─────────────────────────────
  const [raceMode, setRaceMode] = useState<RaceModeConfig>({
    enabled: false,
    strategy: 'compare-models',
    candidates: ['Claude 4', 'GPT-4o'],
  });

  // ── Output / tools ────────────────────────
  const [outputTarget, setOutputTarget] = useState<OutputTarget>('chat');
  const [_toolsMode, _setToolsMode] = useState<ToolsMode>('ask');

  // ── Single attachment state ───────────────
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // ── Context + skills ─────────────────────
  const [selectedContextItems, setSelectedContextItems] = useState<string[]>([]);
  // Context items that aren't part of MOCK_CONTEXT_ITEMS — e.g. GitHub
  // sources, company knowledge. selectedContextItems still holds the IDs;
  // this map provides display metadata + status for those non-mock entries.
  const [extraContextItems, setExtraContextItems] = useState<Record<string, ContextItem>>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // ── Theme ─────────────────────────────────
  const [selectedTheme, setSelectedTheme] = useState<string>('default');

  // ── Project, Style, Model (management metadata) ──
  const [selectedProject, setSelectedProject] = useState<ProjectMeta | undefined>(undefined);
  const [selectedStyle, setSelectedStyle] = useState<StyleMeta>(mockStyles[0]); // 'normal'
  const [selectedModel, setSelectedModel] = useState<ModelMeta>(mockModels[1]); // Sonnet 4.6
  const [adaptiveThinkingEnabled, setAdaptiveThinkingEnabled] = useState(false);

  // ── Tool access (loading policy — separate from toolsMode) ──
  const [toolAccessMode, setToolAccessMode] = useState<ToolAccessMode>('load-when-needed');

  // ── Plugins (enabled set; only web/mock count) ──
  const [enabledPlugins, _setEnabledPlugins] = useState<Plugin[]>([]);

  // ── Directory modal (separate from activePopover) ──
  const [directoryState, setDirectoryState] = useState<DirectoryState>({
    isOpen: false,
    activeTab: 'skills',
    searchQuery: '',
    selectedCategory: 'Anthropic & Partners',
  });

  // ── Context picker filter (company knowledge entry point) ──
  const [contextFilter, setContextFilter] = useState<'all' | 'company-knowledge'>('all');

  // ── Selected template (for send-validity) ──
  const [selectedTemplate, _setSelectedTemplate] = useState<SelectedTemplate | undefined>(undefined);

  // ── Selected quick prompt (lightweight historical metadata) ──
  const [selectedQuickPrompt, setSelectedQuickPrompt] = useState<QuickPromptMeta | undefined>(undefined);

  // ── Popover (single source of truth) ──────
  const [activePopover, setActivePopoverState] = useState<ActivePopover>(null);

  // ── Agent picker search ────────────────────
  const [agentQuery, setAgentQuery] = useState('');

  // ── Slash ─────────────────────────────────
  const [slashQuery, setSlashQuery] = useState('');

  // ── Voice + dictate (shared machinery) ────
  // Stemmetilstand (overlay) and Dikter (inline) are mutually exclusive —
  // see `useComposerVoice` for state, error surfaces and TTS pipeline. The
  // hook is wired up further down once `handleSubmit` exists so the voice
  // callback can route transcripts back through the regular submit pipeline.

  // ── Guard: apply conversation type ────────
  const applyConversationType = useCallback((type: ConversationType, setBy: ConversationTypeSetBy) => {
    if (setBy === 'user') {
      setSelectedConversationType(type);
      setLastConversationTypeSetBy('user');
      return;
    }
    // System capabilities: only apply if user has not set manually
    setLastConversationTypeSetBy(prev => {
      if (prev !== 'user') {
        setSelectedConversationType(type);
        return setBy;
      }
      return prev;
    });
  }, []);

  // ── Guard: apply mode ─────────────────────
  useEffect(() => {
    if (selectedAgentId === undefined) return;
    const nextAgent = selectedAgentId
      ? COMPOSER_AGENTS.find(agent => agent.id === selectedAgentId) ?? null
      : null;
    setSelectedComposerAgent(nextAgent);
    if (nextAgent) applyConversationType('Agent', 'user');
  }, [applyConversationType, selectedAgentId]);

  const chooseComposerAgent = useCallback((agent: ComposerAgent | null) => {
    setSelectedComposerAgent(agent);
    onSelectedAgentIdChange?.(agent?.id ?? null);
    if (agent) applyConversationType('Agent', 'user');
  }, [applyConversationType, onSelectedAgentIdChange]);
  
  const applyMode = useCallback((mode: Mode, setBy: ModeSetBy) => {
    if (setBy === 'user') {
      setSelectedMode(mode);
      setLastModeSetBy('user');
      return;
    }
    setLastModeSetBy(prev => {
      if (prev !== 'user') {
        setSelectedMode(mode);
        return setBy;
      }
      return prev;
    });
  }, []);

  // ── Team Mode auto-effect ─────────────────
  useEffect(() => {
    if (isTeamModeEnabled) applyConversationType('Agent', 'team-mode');
  }, [isTeamModeEnabled, applyConversationType]);

  // ── Deep Research auto-effect ─────────────
  useEffect(() => {
    if (isDeepResearchEnabled) {
      applyConversationType('Research', 'deep-research');
      applyMode('Expert', 'deep-research');
    }
  }, [isDeepResearchEnabled, applyConversationType, applyMode]);

  // ── Popover: single open at a time ────────
  const setActivePopover = useCallback((p: ActivePopover) => {
    setActivePopoverState(prev => (prev === p ? null : p));
  }, []);

  const closePopover = useCallback(() => setActivePopoverState(null), []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        closePopover();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closePopover]);

  // Close on Escape + Cmd/Ctrl+K opens slash palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopover();
      // Cmd/Ctrl+K: focus textarea, insert "/" trigger, open slash palette.
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const ta = textareaRef.current;
        if (ta) {
          ta.focus();
          // Inject "/" if not already on a slash token to trigger slash palette
          setValue(prev => (prev.endsWith('/') || /\/\w*$/.test(prev)) ? prev : (prev.length === 0 || prev.endsWith(' ') ? prev + '/' : prev + ' /'));
          setSlashQuery('');
          setActivePopoverState('slash');
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [closePopover]);

  // Refocus textarea when a popover closes (improves keyboard / picker flow).
  // Skips initial mount and the slash popover (textarea already keeps focus there).
  const prevPopoverRef = useRef<ActivePopover>(null);
  useEffect(() => {
    const prev = prevPopoverRef.current;
    if (prev !== null && activePopover === null && prev !== 'slash') {
      // Delay one tick so a click that closed the popover doesn't immediately steal focus back.
      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    }
    prevPopoverRef.current = activePopover;
  }, [activePopover]);

  // ── Input handling + slash detection ──────
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
    }
    const slashMatch = val.match(/\/(\w*)$/);
    if (slashMatch) {
      setSlashQuery(slashMatch[1]);
      setActivePopoverState('slash');
    } else if (activePopover === 'slash') {
      setActivePopoverState(null);
    }
  };

  // ── Slash command execution ────────────────
  const executeSlashCommand = useCallback((cmd: SlashCommand) => {
    if (cmd.action === 'open-picker') {
      if (!cmd.opens) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(`[AdvancedPromptComposer] open-picker command "${cmd.command}" is missing required 'opens' field — not executing.`);
        }
        return;
      }
      setActivePopoverState(cmd.opens);
    } else if (cmd.action === 'set-mode') {
      const modeMap: Record<string, Mode> = { instant: 'Instant', fast: 'Fast', expert: 'Expert', heavy: 'Heavy', auto: 'Auto' };
      const m = modeMap[cmd.id];
      if (m) applyMode(m, 'slash-command');
      setActivePopoverState(null);
    } else if (cmd.action === 'set-conversation-type') {
      const typeMap: Record<string, ConversationType> = { chat: 'Chat', agent: 'Agent', research: 'Research', build: 'Build' };
      const t = typeMap[cmd.id];
      if (t) {
        applyConversationType(t, 'slash-command');
        if (t !== 'Agent') chooseComposerAgent(null);
      }
      setActivePopoverState(null);
    } else if (cmd.action === 'open-directory') {
      setActivePopoverState(null);
      setDirectoryState(prev => ({
        ...prev,
        isOpen: true,
        activeTab: cmd.opensDirectory ?? prev.activeTab,
        searchQuery: '',
      }));
    }
    setValue(prev => prev.replace(/\/\w*$/, '').trimEnd());
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [applyMode, applyConversationType, chooseComposerAgent]);

  // ── Screenshot helper (mock — bypasses upload progress) ──
  const takeScreenshot = useCallback(() => {
    const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const ts = new Date().toISOString().slice(11, 19).replace(/:/g, '-');
    setAttachments(prev => [...prev, {
      id,
      name: `Screenshot ${ts}.png`,
      fileType: 'PNG',
      size: '420 KB',
      progress: 100,
      status: 'complete',
    }]);
  }, []);

  // ── Context toggle helper (handles mock + extra) ──
  const toggleContextItem = useCallback((item: { id: string; title: string; sourceType: ContextItem['sourceType'] }) => {
    setSelectedContextItems(prev => {
      const present = prev.includes(item.id);
      if (present) return prev.filter(i => i !== item.id);
      return [...prev, item.id];
    });
    // Track extra (non-mock) items so chips and payload can resolve them.
    if (!MOCK_CONTEXT_ITEMS.find(c => c.id === item.id)) {
      setExtraContextItems(prev => {
        if (prev[item.id]) {
          // Already known — no-op (toggle off will leave it cached but unselected).
          return prev;
        }
        return {
          ...prev,
          [item.id]: {
            id: item.id,
            title: item.title,
            sourceType: item.sourceType,
            status: 'available',
          },
        };
      });
    }
  }, []);

  // Reset contextFilter whenever the context popover closes by ANY path
  // (Escape, outside click, popover-to-popover transition). Without this,
  // the filter set when entering via "Company Knowledge" leaks into a
  // subsequent normal context-popover open.
  useEffect(() => {
    if (activePopover !== 'context' && contextFilter !== 'all') {
      setContextFilter('all');
    }
  }, [activePopover, contextFilter]);

  const addExtraContextItem = useCallback((item: ContextItem) => {
    setExtraContextItems(prev => ({ ...prev, [item.id]: item }));
    setSelectedContextItems(prev => prev.includes(item.id) ? prev : [...prev, item.id]);
  }, []);

  // ── Submit ─────────────────────────────────
  // Note: we intentionally do NOT clear selectedQuickPrompt here.
  // Per spec (Section D): "If composer is fully reset, clear selectedQuickPrompt."
  // Submit is not a full reset — it's a single send while the rest of state
  // (conversationType, mode, outputTarget, attachments, etc.) persists.
  // selectedQuickPrompt is preserved as historical trigger metadata until
  // the user explicitly clicks another pill or a full reset occurs.
  const handleSubmit = (override?: string) => {
    if (override === undefined) {
      // Normal path: send button / Enter / programmatic submit.
      // canSend already handles attachment-/template-/context-only sends, so
      // we must NOT add an extra "non-empty text" guard here.
      if (!canSend) return;
    } else {
      // Voice path: refuse empty transcripts only.
      if (!override.trim()) return;
    }
    setIsSubmitting(true);
    const payload = buildNormalizedPayload(override);
    onSubmit?.(payload.prompt, payload);
    if (override === undefined) {
      setValue('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
    setTimeout(() => setIsSubmitting(false), 600);
  };
  handleSubmitRef.current = handleSubmit;

  // ── Mock upload (single attachment state) ──
  const addAttachment = (name: string, fileType: string, size: string) => {
    const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setAttachments(prev => [...prev, { id, name, fileType, size, progress: 0, status: 'uploading' }]);
    let pct = 0;
    const tick = setInterval(() => {
      pct += Math.random() * 30;
      if (pct >= 100) {
        clearInterval(tick);
        setAttachments(prev => prev.map(a => a.id === id ? { ...a, progress: 100, status: 'complete' } : a));
      } else {
        setAttachments(prev => prev.map(a => a.id === id ? { ...a, progress: pct } : a));
      }
    }, 180);
  };

  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id));

  // ── Quick prompt pill click handler (Section A) ──
  const applyQuickPrompt = useCallback((label: string) => {
    const cfg = QUICK_PROMPTS[label];
    if (!cfg) return false;

    // 1. Always set outputTarget — primary intention of the pill
    setOutputTarget(cfg.outputTarget);

    // 2. Lightweight historical metadata
    setSelectedQuickPrompt({ id: cfg.id, label });

    // 3. Auto-set conversation type only if user hasn't manually chosen
    setLastConversationTypeSetBy(prev => {
      if (prev !== 'user') {
        setSelectedConversationType(cfg.conversationType);
        return 'quick-prompt';
      }
      return prev;
    });

    // 4. Insert hint into the textarea if defined
    if (cfg.hint) {
      setValue(prev => {
        if (prev.trim().length === 0) return cfg.hint;
        if (prev.endsWith(' ')) return prev + cfg.hint.trimStart();
        return prev + ' ' + cfg.hint.trimStart();
      });
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
        }
      });
    }

    // 5. Optionally open a picker (skill / attachment)
    if (cfg.opensPicker) setActivePopoverState(cfg.opensPicker);

    return true;
  }, [maxHeight]);

  // ── Speech capture wiring ─────────────────
  // (handleSubmitRef is hoisted above handleSubmit; assigned below.)

  const onDictateFinal = useCallback((text: string) => {
    // Append to textarea with smart spacing + capitalisation of the first chunk.
    setValue(prev => {
      const trimmed = text.trim();
      if (!trimmed) return prev;
      if (prev.length === 0) {
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      }
      const needsSpace = !/\s$/.test(prev);
      return prev + (needsSpace ? ' ' : '') + trimmed;
    });
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, maxHeight)}px`;
      }
    });
  }, [maxHeight]);

  const onVoiceFinal = useCallback((transcript: string) => {
    handleSubmitRef.current(transcript);
  }, []);

  const voice = useComposerVoice({
    onDictateFinal,
    onVoiceFinal,
    getVoiceReply,
    speechLang,
    speechVoiceURI,
    transcriptionBackend: transcriptionBackendProp,
    transcriptionLanguage: transcriptionLanguageProp,
  });
  const {
    voiceMode, dictateMode, voiceError, dictateError,
    voiceSpeaking, voiceLastReply, voiceCapture, dictateCapture,
    toggleVoiceMode, toggleDictateMode, endVoiceMode, clearDictateError,
    transcriptionBackend, setTranscriptionBackend,
    transcriptionBackendLocked,
    transcriptionLanguage, setTranscriptionLanguage,
    transcriptionLanguageLocked,
  } = voice;

  // Notify the host once voice mode transitions from active → inactive,
  // regardless of which path closed it (overlay Afslut, toggle, etc.).
  // Hosts (HomeView, ChatView) use this to surface the spoken conversation
  // in the visible chat thread after the overlay disappears.
  const onVoiceEndRef = useRef(onVoiceEnd);
  onVoiceEndRef.current = onVoiceEnd;
  const prevVoiceModeRef = useRef(voiceMode);
  useEffect(() => {
    if (prevVoiceModeRef.current && !voiceMode) {
      onVoiceEndRef.current?.();
    }
    prevVoiceModeRef.current = voiceMode;
  }, [voiceMode]);

  const buildNormalizedPayload = useCallback((promptOverride?: string): NormalizedSubmitPayload => {
    const validAttachments = attachments.filter(a => a.status === 'complete');
    const validContextItems = selectedContextItems.filter(id => {
      const mock = MOCK_CONTEXT_ITEMS.find(c => c.id === id);
      if (mock) return mock.status !== 'disconnected' && mock.status !== 'requires-auth';
      const extra = extraContextItems[id];
      return !!extra && extra.status !== 'disconnected' && extra.status !== 'requires-auth';
    });

    const themeMeta = MOCK_THEMES.find(t => t.id === selectedTheme) ?? MOCK_THEMES[0];

    const toolsPolicy = {
      toolsMode: _toolsMode,
      allowedTools: _toolsMode === 'off' ? [] : ['*'],
      requireConfirmation: _toolsMode === 'ask',
      toolAccessMode,
    };

    const payload: NormalizedSubmitPayload = {
      prompt: (promptOverride ?? value).trim(),
      mode: selectedMode,
      conversationType: selectedConversationType,
      outputTarget,
      attachments: validAttachments,
      contextItems: validContextItems,
      skills: selectedSkills,
      toolsPolicy,
      voiceEnabled: voiceMode || dictateMode,
      teamModeEnabled: isTeamModeEnabled,
      deepResearchEnabled: isDeepResearchEnabled,
      theme: { id: themeMeta.id, name: themeMeta.label, palette: themeMeta.color },
      adaptiveThinkingEnabled,
      createdAt: new Date().toISOString(),
    };

    if (selectedProject) {
      payload.project = { id: selectedProject.id, name: selectedProject.name, workspace: selectedProject.workspace };
    }
    payload.style = { id: selectedStyle.id, label: selectedStyle.label };
    payload.model = { id: selectedModel.id, label: selectedModel.label };

    const activePlugins = enabledPlugins.filter(p => p.enabled && p.availability !== 'desktop-only');
    if (activePlugins.length) {
      payload.plugins = activePlugins.map(p => ({ id: p.id, name: p.name }));
    }

    if (selectedTemplate) {
      payload.selectedTemplate = {
        id: selectedTemplate.id,
        title: selectedTemplate.title,
        category: selectedTemplate.category,
      };
    }

    if (raceMode.enabled) payload.raceMode = raceMode;

    if (selectedQuickPrompt) {
      payload.quickPrompt = { id: selectedQuickPrompt.id, label: selectedQuickPrompt.label };
    }

    if (selectedConversationType === 'Agent' && selectedComposerAgent) {
      payload.agent = {
        id: selectedComposerAgent.id,
        name: selectedComposerAgent.name,
        role: selectedComposerAgent.role,
        organization: selectedComposerAgent.organization,
        department: selectedComposerAgent.department,
      };
    }

    return payload;
  }, [
    attachments, selectedContextItems, extraContextItems, selectedTheme, _toolsMode, value,
    selectedMode, selectedConversationType, outputTarget, selectedSkills,
    voiceMode, dictateMode, isTeamModeEnabled, isDeepResearchEnabled, raceMode,
    selectedTemplate, selectedQuickPrompt,
    selectedProject, selectedStyle, selectedModel, adaptiveThinkingEnabled,
    toolAccessMode, enabledPlugins, selectedComposerAgent,
  ]);

  // ── Send button enable logic (Section B) ──
  const validAttachmentsCount = attachments.filter(a => a.status === 'complete').length;
  const validContextCount = selectedContextItems.filter(id => {
    const mock = MOCK_CONTEXT_ITEMS.find(c => c.id === id);
    if (mock) return mock.status !== 'disconnected' && mock.status !== 'requires-auth';
    const extra = extraContextItems[id];
    return !!extra && extra.status !== 'disconnected' && extra.status !== 'requires-auth';
  }).length;
  const hasUploadingAttachment = attachments.some(a => a.status === 'uploading');

  const canSend =
    !isSubmitting &&
    !hasUploadingAttachment &&
    (
      value.trim().length > 0 ||
      validAttachmentsCount > 0 ||
      !!selectedTemplate ||
      validContextCount > 0
    );

  // ── Slash filter ───────────────────────────
  const filteredSlashCmds = slashQuery
    ? SLASH_COMMANDS.filter(c =>
        c.command.slice(1).startsWith(slashQuery.toLowerCase()) ||
        c.title.toLowerCase().includes(slashQuery.toLowerCase())
      )
    : SLASH_COMMANDS;

  const ctColor = CT_COLORS[selectedConversationType];
  const modeColor = MODE_COLORS[selectedMode];

  // ──────────────────────────────────────────
  return (
    <div className="w-full flex flex-col gap-6" ref={containerRef}>
      <div className={cn(
        'bg-white rounded-[31px] border shadow-[var(--shadow-input)] transition-all duration-300 flex flex-col overflow-visible relative',
        isFocused ? 'ring-2 ring-primary/30 border-primary/40 shadow-lg' : 'border-border'
      )}>

        {/* Voice mode overlay (Wispr Flow style) */}
        <VoiceModeOverlay
          active={voiceMode}
          capture={voiceCapture}
          error={voiceError}
          speaking={voiceSpeaking}
          lastReply={voiceLastReply}
          onEnd={endVoiceMode}
        />

        {/* Attachment chips */}
        <AnimatePresence>
          {attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-3 flex flex-wrap gap-2 overflow-hidden"
            >
              {attachments.map(att => (
                <div
                  key={att.id}
                  className="relative flex items-center gap-2 bg-[#f5f5f5] border border-border rounded-xl px-3 py-1.5 text-xs font-medium text-foreground max-w-[200px]"
                  data-testid={`attachment-chip-${att.id}`}
                >
                  <File className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate">{att.name}</span>
                  {att.status === 'uploading' && (
                    <div
                      className="absolute bottom-0 left-0 h-0.5 bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${att.progress}%` }}
                    />
                  )}
                  {att.status === 'complete' && <Check className="w-3 h-3 text-green-500 shrink-0" />}
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors ml-0.5 shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Management chips: Project, Style, Model */}
        {(selectedProject || selectedStyle.id !== 'normal' || selectedModel.id !== 'sonnet-4-6' || adaptiveThinkingEnabled) && (
          <div className="px-4 pt-3 flex flex-wrap gap-1.5">
            {selectedProject && (
              <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-2.5 py-1 text-[11px] font-semibold" data-testid="chip-project">
                <Folder className="w-3 h-3" />
                {selectedProject.name}
                <button onClick={() => setSelectedProject(undefined)} aria-label="Remove project"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {selectedStyle.id !== 'normal' && (
              <span className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg px-2.5 py-1 text-[11px] font-semibold" data-testid="chip-style">
                <Feather className="w-3 h-3" />
                {selectedStyle.label}
                <button onClick={() => setSelectedStyle(mockStyles[0])} aria-label="Reset style"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {selectedModel.id !== 'sonnet-4-6' && (
              <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg px-2.5 py-1 text-[11px] font-semibold" data-testid="chip-model">
                <Sparkles className="w-3 h-3" />
                {selectedModel.label}
                <button onClick={() => setSelectedModel(mockModels[1])} aria-label="Reset model"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
            {adaptiveThinkingEnabled && (
              <span className="flex items-center gap-1.5 bg-primary/5 border border-primary/20 text-primary rounded-lg px-2.5 py-1 text-[11px] font-semibold" data-testid="chip-adaptive-thinking">
                <Zap className="w-3 h-3" />
                Adaptive thinking
                <button onClick={() => setAdaptiveThinkingEnabled(false)} aria-label="Disable adaptive thinking"><X className="w-2.5 h-2.5" /></button>
              </span>
            )}
          </div>
        )}

        {/* Context / skill chips */}
        <AnimatePresence>
          {(selectedContextItems.length > 0 || selectedSkills.length > 0) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pt-2 flex flex-wrap gap-1.5 overflow-hidden"
            >
              {selectedContextItems.map(id => {
                const mock = MOCK_CONTEXT_ITEMS.find(c => c.id === id);
                if (mock) {
                  return (
                    <span key={id} className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg px-2.5 py-1 text-[11px] font-semibold">
                      <Database className="w-3 h-3" />
                      {mock.label}
                      <button onClick={() => setSelectedContextItems(p => p.filter(i => i !== id))}><X className="w-2.5 h-2.5" /></button>
                    </span>
                  );
                }
                const extra = extraContextItems[id];
                if (!extra) return null;
                const isGitHub = extra.connectorId === 'github';
                const isCK = extra.sourceType === 'company-knowledge';
                const Icon = isGitHub ? Github : isCK ? Building2 : Database;
                const palette = isGitHub
                  ? 'bg-slate-100 border-slate-200 text-slate-700'
                  : isCK
                    ? 'bg-violet-50 border-violet-200 text-violet-700'
                    : 'bg-sky-50 border-sky-200 text-sky-700';
                return (
                  <span key={id} className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold border', palette)} data-testid={`chip-ctx-${id}`}>
                    <Icon className="w-3 h-3" />
                    <span className="max-w-[180px] truncate">{extra.title}</span>
                    <button onClick={() => setSelectedContextItems(p => p.filter(i => i !== id))}><X className="w-2.5 h-2.5" /></button>
                  </span>
                );
              })}
              {selectedSkills.map(id => {
                const skill = MOCK_SKILLS.find(s => s.id === id);
                return skill ? (
                  <span key={id} className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 rounded-lg px-2.5 py-1 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    {skill.label}
                    <button onClick={() => setSelectedSkills(p => p.filter(i => i !== id))}><X className="w-2.5 h-2.5" /></button>
                  </span>
                ) : null;
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Textarea */}
        <div className="px-5 pt-4 pb-2 relative">
          {/* Inline dictation indicator + interim transcript preview */}
          <DictateIndicator
            active={dictateMode}
            capture={dictateCapture}
            error={dictateError}
            onDismissError={clearDictateError}
            pillPositionClassName="top-1 right-5"
          />
          <textarea
            ref={textareaRef}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInput}
            onKeyDown={e => {
              // IME guard: do not submit while user is composing (Japanese/Korean/Chinese IME).
              const composing = e.nativeEvent.isComposing || (e.nativeEvent as unknown as { keyCode?: number }).keyCode === 229;
              if (e.key === 'Enter' && !e.shiftKey && !composing) {
                if (activePopover === 'slash') {
                  // Slash menu open → select first filtered command (or close if none).
                  e.preventDefault();
                  const first = filteredSlashCmds[0];
                  if (first) executeSlashCommand(first);
                  else closePopover();
                } else {
                  e.preventDefault();
                  handleSubmit();
                }
              }
              if ((e.key === 'Tab') && activePopover === 'slash' && !composing) {
                // Tab also confirms the first slash suggestion.
                const first = filteredSlashCmds[0];
                if (first) {
                  e.preventDefault();
                  executeSlashCommand(first);
                }
              }
              if (e.key === 'Escape' && activePopover === 'slash') {
                e.preventDefault();
                closePopover();
              }
            }}
            placeholder={placeholder}
            className="w-full resize-none outline-none bg-transparent text-foreground placeholder:text-muted-foreground text-[16px] leading-relaxed min-h-[48px]"
            style={{ maxHeight: `${maxHeight}px` }}
            rows={1}
            data-testid="input-composer"
          />
        </div>

        {/* Slash command popover */}
        <AnimatePresence>
          {activePopover === 'slash' && (
            <PopoverPanel className="bottom-full left-4 right-4 mb-2 max-h-80 overflow-y-auto">
              <SlashCommandMenu commands={filteredSlashCmds} onSelect={executeSlashCommand} />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3 pt-1 relative z-10">

          {/* ── Left cluster ── */}
          <div className="flex items-center gap-0.5 flex-wrap">

            {/* 1. Quick Action Button (Plus) */}
            <div className="relative">
              <button
                aria-label="Open quick actions"
                onClick={() => setActivePopover('quick-actions')}
                className={cn(
                  'p-2 rounded-full transition-colors',
                  activePopover === 'quick-actions' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
                data-testid="button-quick-actions"
              >
                <Plus className="w-5 h-5" />
              </button>
              <AnimatePresence>
                {activePopover === 'quick-actions' && (
                  <PopoverPanel className="bottom-full left-0 mb-2 w-60">
                    <QuickActionMenu
                      isTeamModeEnabled={isTeamModeEnabled}
                      isDeepResearchEnabled={isDeepResearchEnabled}
                      onToggleTeamMode={() => setIsTeamModeEnabled(v => !v)}
                      onToggleDeepResearch={() => setIsDeepResearchEnabled(v => !v)}
                      onOpenAttachment={() => setActivePopoverState('attachment')}
                      onOpenRace={() => setActivePopoverState('race')}
                      onOpenTheme={() => setActivePopoverState('theme')}
                      onOpenProject={() => setActivePopoverState('project')}
                      onTakeScreenshot={takeScreenshot}
                      onOpenGitHubSource={() => setActivePopoverState('github-source')}
                      onOpenCompanyKnowledge={() => { setContextFilter('company-knowledge'); setActivePopoverState('context'); }}
                      onOpenStyle={() => setActivePopoverState('style')}
                      onOpenToolAccess={() => setActivePopoverState('tool-access')}
                      onOpenMCPs={() => setDirectoryState(prev => ({ ...prev, isOpen: true, activeTab: 'mcps' }))}
                      onClose={closePopover}
                    />
                  </PopoverPanel>
                )}
              </AnimatePresence>
            </div>

            {/* 2. Attachment Button (Paperclip) — separate from Quick Action */}
            <div className="relative">
              <button
                aria-label="Attach files"
                onClick={() => setActivePopover('attachment')}
                className={cn(
                  'relative p-2 rounded-full transition-colors',
                  activePopover === 'attachment' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  attachments.length > 0 && activePopover !== 'attachment' && 'text-primary'
                )}
                data-testid="button-attach"
              >
                <Paperclip className="w-5 h-5" />
                {attachments.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {attachments.length}
                  </span>
                )}
              </button>
              <AnimatePresence>
                {activePopover === 'attachment' && (
                  <PopoverPanel className="bottom-full left-0 mb-2 w-60">
                    <AttachmentMenuContent onAddAttachment={addAttachment} onClose={closePopover} />
                  </PopoverPanel>
                )}
              </AnimatePresence>
            </div>

            <div className="w-px h-5 bg-border mx-1 shrink-0" />

            {/* 3. Conversation Type pill */}
            <div className="relative">
              <button
                onClick={() => setActivePopover('conversation')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors hover:bg-muted"
                style={{ color: ctColor }}
                data-testid="button-conversation-type"
              >
                {selectedConversationType}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {activePopover === 'conversation' && (
                  <PopoverPanel className="bottom-full left-0 mb-2 w-44">
                    <div className="py-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">Conversation Type</p>
                      {CONVERSATION_TYPES.map(type => (
                        <button
                          key={type}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => {
                            applyConversationType(type, 'user');
                            if (type !== 'Agent') chooseComposerAgent(null);
                            closePopover();
                          }}
                          className="w-full flex items-center justify-between px-4 py-2 rounded-none text-sm font-medium transition-colors hover:bg-muted"
                          style={{ color: CT_COLORS[type] }}
                          data-testid={`conv-type-${type.toLowerCase()}`}
                        >
                          {type}
                          {selectedConversationType === type && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </PopoverPanel>
                )}
              </AnimatePresence>
            </div>

            {/* 3b. Agent picker — only when conversationType === 'Agent' */}
            <AnimatePresence>
              {selectedConversationType === 'Agent' && (
                <motion.div
                  key="agent-picker"
                  initial={{ opacity: 0, scale: 0.85, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 'auto' }}
                  exit={{ opacity: 0, scale: 0.85, width: 0 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                  className="relative shrink-0"
                >
                  <button
                    onClick={() => setActivePopover('agent')}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold border transition-colors',
                      selectedComposerAgent
                        ? 'bg-violet-50 border-violet-200 text-violet-800 hover:bg-violet-100'
                        : 'bg-white border-dashed border-violet-300 text-violet-700 hover:bg-violet-50',
                    )}
                    style={selectedComposerAgent ? { borderColor: `${selectedComposerAgent.accentColor}55` } : undefined}
                    data-testid="button-agent-picker"
                  >
                    {selectedComposerAgent ? (
                      <>
                        <ComposerAgentAvatar agent={selectedComposerAgent} size="chip" />
                        <span className="truncate max-w-[110px]" data-testid="agent-chip-name">Agent: {selectedComposerAgent.name}</span>
                        <X
                          className="w-3 h-3 text-muted-foreground hover:text-foreground"
                          onClick={(e) => { e.stopPropagation(); chooseComposerAgent(null); }}
                          data-testid="button-clear-agent"
                        />
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3" />
                        Pick agent
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                  <AnimatePresence>
                    {activePopover === 'agent' && (
                      <PopoverPanel className="bottom-full left-0 mb-2 w-80 p-0">
                        <Command
                          className="rounded-2xl"
                          filter={(value, search) => {
                            if (!search) return 1;
                            const q = search.toLowerCase();
                            return value.toLowerCase().includes(q) ? 1 : 0;
                          }}
                          data-testid="agent-picker-panel"
                        >
                          <div className="px-3 pt-3 pb-2">
                            <CommandInput
                              placeholder="Søg agent, rolle eller kategori…"
                              value={agentQuery}
                              onValueChange={setAgentQuery}
                              className="h-8 text-sm"
                            />
                          </div>
                          <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden px-1 pb-2">
                            <CommandEmpty className="py-6 text-center text-xs text-muted-foreground">
                              Ingen agenter fundet.
                            </CommandEmpty>
                            {(['team', 'official'] as const).map(scope => {
                              const list = COMPOSER_AGENTS.filter(a => a.scope === scope);
                              if (list.length === 0) return null;
                              return (
                                <CommandGroup
                                  key={scope}
                                  heading={scope === 'team' ? 'Team' : 'Official'}
                                  className="[&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5"
                                >
                                  {list.map(a => {
                                    const active = selectedComposerAgent?.id === a.id;
                                    return (
                                      <CommandItem
                                        key={a.id}
                                        value={`${a.name} ${a.role ?? ''} ${a.organization ?? ''}`}
                                        onSelect={() => { chooseComposerAgent(a); closePopover(); setAgentQuery(''); }}
                                        className={cn(
                                          'flex items-center gap-2.5 px-2 py-2 rounded-lg cursor-pointer aria-selected:bg-violet-50',
                                          active && 'bg-violet-50',
                                        )}
                                        data-testid={`agent-option-${a.id}`}
                                      >
                                        <ComposerAgentAvatar agent={a} size="option" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-sm font-semibold text-foreground truncate">{a.name}</p>
                                          <p className="text-[11px] text-muted-foreground truncate">
                                            {a.role}
                                            {a.organization && (
                                              <span className="text-muted-foreground/70"> · {a.organization}{a.department ? ` / ${a.department.split(' ')[0]}` : ''}</span>
                                            )}
                                          </p>
                                        </div>
                                        {active && <Check className="w-3.5 h-3.5 text-violet-600 shrink-0" />}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              );
                            })}
                          </CommandList>
                        </Command>
                      </PopoverPanel>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 4. Mode pill */}
            <div className="relative">
              <button
                onClick={() => setActivePopover('mode')}
                className="flex items-center gap-1 bg-[#f5f5f5] hover:bg-[#e8e8e8] px-2.5 py-1.5 rounded-full text-xs font-semibold transition-colors"
                style={{ color: modeColor }}
                data-testid="button-mode"
              >
                {selectedMode}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {activePopover === 'mode' && (
                  <PopoverPanel className="bottom-full left-0 mb-2 w-44">
                    <div className="py-1">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">Mode</p>
                      {MODES.map(mode => (
                        <button
                          key={mode}
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => { applyMode(mode, 'user'); closePopover(); }}
                          className="w-full flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                          style={{ color: MODE_COLORS[mode] }}
                          data-testid={`mode-${mode.toLowerCase()}`}
                        >
                          {mode}
                          {selectedMode === mode && <Check className="w-3.5 h-3.5" />}
                        </button>
                      ))}
                    </div>
                  </PopoverPanel>
                )}
              </AnimatePresence>
            </div>

            {/* Active capability badges */}
            <AnimatePresence>
              {isTeamModeEnabled && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setIsTeamModeEnabled(false)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold hover:bg-violet-100 transition-all"
                  data-testid="badge-team-mode"
                >
                  <Users className="w-3 h-3" />
                  Team
                  <X className="w-2.5 h-2.5" />
                </motion.button>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isDeepResearchEnabled && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setIsDeepResearchEnabled(false)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-bold hover:bg-sky-100 transition-all"
                  data-testid="badge-deep-research"
                >
                  <Globe className="w-3 h-3" />
                  Research
                  <X className="w-2.5 h-2.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right cluster ── */}
          <div className="flex items-center gap-1 shrink-0">
            <TooltipProvider delayDuration={150}>
              <VoiceModeButton active={voiceMode} onToggle={toggleVoiceMode} />
              <TranscriptionBackendToggle
                backend={transcriptionBackend}
                onChange={setTranscriptionBackend}
                locked={transcriptionBackendLocked}
              />
              <TranscriptionLanguagePicker
                language={transcriptionLanguage}
                onChange={setTranscriptionLanguage}
                locked={transcriptionLanguageLocked}
              />
              <DictateButton active={dictateMode} onToggle={toggleDictateMode} />
            </TooltipProvider>

            {/* Send button */}
            <button
              onClick={() => handleSubmit()}
              disabled={!canSend}
              className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300',
                canSend
                  ? 'bg-primary text-white hover:bg-[#003a3d] shadow-md hover:shadow-lg hover:-translate-y-[1px]'
                  : 'bg-[#f0f0f0] text-muted-foreground cursor-not-allowed'
              )}
              data-testid="button-send"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Remaining popovers (anchored to left of composer) ── */}

        {/* Context picker */}
        <AnimatePresence>
          {activePopover === 'context' && (
            <PopoverPanel className="bottom-full left-0 mb-2 w-72">
              <ContextPickerContent
                items={contextFilter === 'company-knowledge' ? [] : MOCK_CONTEXT_ITEMS}
                companyKnowledge={mockCompanyKnowledgeItems}
                selected={selectedContextItems}
                onToggle={toggleContextItem}
                onClose={() => { setContextFilter('all'); closePopover(); }}
                onManageConnectors={() => {
                  setContextFilter('all');
                  closePopover();
                  setDirectoryState(prev => ({ ...prev, isOpen: true, activeTab: 'connectors' }));
                }}
                filter={contextFilter}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Skill picker */}
        <AnimatePresence>
          {activePopover === 'skill' && (
            <PopoverPanel className="bottom-full left-0 mb-2 w-64">
              <SkillPickerContent
                skills={MOCK_SKILLS}
                selected={selectedSkills}
                onToggle={id => setSelectedSkills(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])}
                onClose={closePopover}
                onManageSkills={() => {
                  closePopover();
                  setDirectoryState(prev => ({ ...prev, isOpen: true, activeTab: 'skills' }));
                }}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Project picker */}
        <AnimatePresence>
          {activePopover === 'project' && (
            <PopoverPanel className="bottom-full left-0 mb-2">
              <ProjectPicker
                selected={selectedProject}
                onSelect={setSelectedProject}
                onClose={closePopover}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Style picker */}
        <AnimatePresence>
          {activePopover === 'style' && (
            <PopoverPanel className="bottom-full left-0 mb-2">
              <StylePicker
                selected={selectedStyle}
                onSelect={setSelectedStyle}
                onClose={closePopover}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Model selector */}
        <AnimatePresence>
          {activePopover === 'model' && (
            <PopoverPanel className="bottom-full left-0 mb-2">
              <ModelSelector
                selected={selectedModel}
                adaptiveThinkingEnabled={adaptiveThinkingEnabled}
                onSelectModel={setSelectedModel}
                onToggleAdaptiveThinking={() => setAdaptiveThinkingEnabled(v => !v)}
                onClose={closePopover}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Tool access menu */}
        <AnimatePresence>
          {activePopover === 'tool-access' && (
            <PopoverPanel className="bottom-full left-0 mb-2">
              <ToolAccessMenu
                selected={toolAccessMode}
                onSelect={setToolAccessMode}
                onClose={closePopover}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* GitHub source picker */}
        <AnimatePresence>
          {activePopover === 'github-source' && (
            <PopoverPanel className="bottom-full left-0 mb-2">
              <GitHubSourcePicker
                alreadySelectedIds={selectedContextItems}
                onAddContext={addExtraContextItem}
                onClose={closePopover}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Output target picker */}
        <AnimatePresence>
          {activePopover === 'output' && (
            <PopoverPanel className="bottom-full left-0 mb-2 w-52">
              <div className="py-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-4 py-1.5">Output target</p>
                {OUTPUT_TARGETS.map(t => (
                  <button
                    key={t.id}
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => { setOutputTarget(t.id); closePopover(); }}
                    className={cn('w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted', outputTarget === t.id ? 'text-primary' : 'text-foreground')}
                    data-testid={`output-${t.id}`}
                  >
                    <span className={outputTarget === t.id ? 'text-primary' : 'text-muted-foreground'}>{t.icon}</span>
                    {t.label}
                    {outputTarget === t.id && <Check className="w-3.5 h-3.5 ml-auto" />}
                  </button>
                ))}
              </div>
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Theme picker */}
        <AnimatePresence>
          {activePopover === 'theme' && (
            <PopoverPanel className="bottom-full left-0 mb-2 w-56">
              <ThemePickerContent
                themes={MOCK_THEMES}
                selected={selectedTheme}
                onSelect={id => { setSelectedTheme(id); closePopover(); }}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>

        {/* Race mode picker */}
        <AnimatePresence>
          {activePopover === 'race' && (
            <PopoverPanel className="bottom-full left-0 mb-2 w-72">
              <RaceModePickerContent
                config={raceMode}
                candidates={RACE_CANDIDATES}
                strategies={RACE_STRATEGIES}
                onUpdate={updates => setRaceMode(prev => ({ ...prev, ...updates }))}
                onClose={closePopover}
              />
            </PopoverPanel>
          )}
        </AnimatePresence>
      </div>

      {/* Directory modal (skills / connectors / plugins) */}
      <DirectoryModal
        state={directoryState}
        onChangeTab={tab => setDirectoryState(prev => ({ ...prev, activeTab: tab, searchQuery: '' }))}
        onChangeQuery={q => setDirectoryState(prev => ({ ...prev, searchQuery: q }))}
        onChangeFilter={f => setDirectoryState(prev => ({ ...prev, filterBy: f }))}
        onChangeSort={s => setDirectoryState(prev => ({ ...prev, sortBy: s }))}
        onClose={() => setDirectoryState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          {suggestions.map((s, i) => {
            const isQuickPrompt = QUICK_PROMPTS[s.label] !== undefined;
            const isActive = selectedQuickPrompt?.label === s.label;
            return (
              <button
                key={i}
                onClick={() => {
                  // Quick prompt pills (Section A) — apply pill behavior first
                  if (isQuickPrompt) applyQuickPrompt(s.label);
                  s.onClick?.();
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 font-medium text-sm rounded-full transition-all duration-200 hover:-translate-y-[2px] border',
                  isActive
                    ? 'bg-primary/10 text-primary border-primary/30'
                    : 'bg-[#f5f5f5] hover:bg-primary/5 hover:text-primary text-muted-foreground border-transparent'
                )}
                data-testid={`suggestion-${s.label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {s.icon}
                <span>{s.label}</span>
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
