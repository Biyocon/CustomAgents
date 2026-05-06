import type {
  ContextItem,
  DirectoryConnectorEntry,
  DirectorySkillEntry,
  GitHubRepo,
  MCPServer,
  ModelMeta,
  Plugin,
  ProjectMeta,
  StyleMeta,
  ToolAccessOption,
} from '@/types/composer';

// ── Projects ───────────────────────────────────────────────
export const mockProjects: ProjectMeta[] = [
  { id: 'proj-1', name: 'Kvalifikationsordning Fri',                 workspace: 'Biyocon' },
  { id: 'proj-2', name: 'Visual FoxPro',                             workspace: 'Biyocon' },
  { id: 'proj-3', name: 'Brand Biyocon',                             workspace: 'Brand Studio' },
  { id: 'proj-4', name: 'Test',                                      workspace: 'Sandbox' },
  { id: 'proj-5', name: 'To in-house konsulenter til vejafvanding',  workspace: 'Vejdirektoratet' },
  { id: 'proj-6', name: 'Vejdirektoratet — Tilbud — Fagtilsyn',      workspace: 'Vejdirektoratet' },
  { id: 'proj-7', name: 'Lokaltog_Kvalifikationsordning_Tek',        workspace: 'Lokaltog' },
];

// ── Company knowledge (rendered through ContextPicker filter) ──
export const mockCompanyKnowledgeItems: ContextItem[] = [
  { id: 'ck-1', title: 'Brand guidelines',             sourceType: 'company-knowledge', sourceName: 'Company Knowledge', status: 'available', description: 'Visual identity, tone, and usage rules' },
  { id: 'ck-2', title: 'Biyocon operating principles', sourceType: 'company-knowledge', sourceName: 'Company Knowledge', status: 'available', description: 'How we work and decide' },
  { id: 'ck-3', title: 'Tender response standards',    sourceType: 'company-knowledge', sourceName: 'Company Knowledge', status: 'available', description: 'Templates and quality bar for tenders' },
  { id: 'ck-4', title: 'OmniAI product architecture',  sourceType: 'company-knowledge', sourceName: 'Company Knowledge', status: 'available', description: 'High-level system overview' },
  { id: 'ck-5', title: 'User & team preferences',      sourceType: 'company-knowledge', sourceName: 'Company Knowledge', status: 'available', description: 'Per-team defaults and settings' },
];

// ── Styles (response tone) ─────────────────────────────────
export const mockStyles: StyleMeta[] = [
  { id: 'normal',       label: 'Normal',       description: 'Default balanced tone' },
  { id: 'learning',     label: 'Learning',     description: 'Step-by-step with explanations' },
  { id: 'concise',      label: 'Concise',      description: 'Short, to the point' },
  { id: 'explanatory',  label: 'Explanatory',  description: 'Detailed reasoning included' },
  { id: 'formal',       label: 'Formal',       description: 'Professional and structured' },
];

// ── Models (concrete model choices) ────────────────────────
export const mockModels: ModelMeta[] = [
  { id: 'opus-4-7',   label: 'Opus 4.7',   description: 'Most capable for ambitious work' },
  { id: 'sonnet-4-6', label: 'Sonnet 4.6', description: 'Most efficient for everyday tasks' },
  { id: 'haiku-4-5',  label: 'Haiku 4.5',  description: 'Fastest for quick answers' },
];

export const mockMoreModels: ModelMeta[] = [
  { id: 'opus-4-6',   label: 'Opus 4.6'   },
  { id: 'opus-3',     label: 'Opus 3'     },
  { id: 'sonnet-4-5', label: 'Sonnet 4.5' },
];

// ── Tool access (loading policy) ───────────────────────────
export const mockToolAccessModes: ToolAccessOption[] = [
  { id: 'load-when-needed', label: 'Load tools when needed', description: 'Chats compact less since tools aren’t pre-loaded.' },
  { id: 'preload-tools',    label: 'Tools already loaded',   description: 'Chats compact more often since tools are always there.' },
];

// ── Plugins (10 categories) ────────────────────────────────
export const mockPlugins: Plugin[] = [
  { id: 'plg-design',        name: 'Design',             description: 'Design tokens, components, and reviews', provider: 'Anthropic & Partners', enabled: false, availability: 'web',          category: 'Design',          downloads: 12400 },
  { id: 'plg-productivity',  name: 'Productivity',       description: 'Calendar, tasks, and inbox flows',       provider: 'Anthropic & Partners', enabled: false, availability: 'desktop-only', category: 'Productivity',    downloads: 9800  },
  { id: 'plg-marketing',     name: 'Marketing',          description: 'Campaigns, copy, and analytics',         provider: 'Anthropic & Partners', enabled: false, availability: 'web',          category: 'Marketing',       downloads: 7600  },
  { id: 'plg-data',          name: 'Data',               description: 'Query, transform, and visualise data',   provider: 'Anthropic & Partners', enabled: true,  availability: 'web',          category: 'Data',            downloads: 21500 },
  { id: 'plg-engineering',   name: 'Engineering',        description: 'Code review, refactor, and CI helpers',  provider: 'Anthropic & Partners', enabled: false, availability: 'desktop-only', category: 'Engineering',     downloads: 18200 },
  { id: 'plg-finance',       name: 'Finance',            description: 'Reports, forecasts, and reconciliation', provider: 'Anthropic & Partners', enabled: false, availability: 'web',          category: 'Finance',         downloads: 5400  },
  { id: 'plg-pm',            name: 'Product management', description: 'Roadmaps, briefs, and tickets',          provider: 'Anthropic & Partners', enabled: false, availability: 'web',          category: 'Product',         downloads: 6900  },
  { id: 'plg-operations',    name: 'Operations',         description: 'Runbooks, SOPs, and ops tooling',        provider: 'Anthropic & Partners', enabled: false, availability: 'desktop-only', category: 'Operations',      downloads: 3200  },
  { id: 'plg-legal',         name: 'Legal',              description: 'Contracts, clauses, and review',         provider: 'Anthropic & Partners', enabled: false, availability: 'desktop-only', category: 'Legal',           downloads: 4100  },
  { id: 'plg-sales',         name: 'Sales',              description: 'Pipelines, outreach, and CRM helpers',   provider: 'Anthropic & Partners', enabled: false, availability: 'web',          category: 'Sales',           downloads: 8800  },
];

// ── Directory: Skills tab ──────────────────────────────────
export const mockDirectorySkills: DirectorySkillEntry[] = [
  { id: 'sk-canvas-design',         name: '/canvas-design',         provider: 'Anthropic', description: 'Design and iterate on UI on a canvas',   downloads: 14200, category: 'Design',       installed: true  },
  { id: 'sk-web-artifacts-builder', name: '/web-artifacts-builder', provider: 'Anthropic', description: 'Build and ship web artifacts',           downloads: 11800, category: 'Engineering',  installed: true  },
  { id: 'sk-mcp-builder',           name: '/mcp-builder',           provider: 'Anthropic', description: 'Author and test MCP servers',            downloads:  9300, category: 'Engineering',  installed: false },
  { id: 'sk-theme-factory',         name: '/theme-factory',         provider: 'Anthropic', description: 'Generate and refine visual themes',      downloads:  8200, category: 'Design',       installed: false },
  { id: 'sk-doc-coauthoring',       name: '/doc-coauthoring',       provider: 'Anthropic', description: 'Collaborative document drafting',        downloads:  7400, category: 'Writing',      installed: false },
  { id: 'sk-brand-guidelines',      name: '/brand-guidelines',      provider: 'Anthropic', description: 'Apply and audit brand guidelines',       downloads:  6100, category: 'Design',       installed: false },
  { id: 'sk-internal-comms',        name: '/internal-comms',        provider: 'Anthropic', description: 'Draft internal announcements',           downloads:  5500, category: 'Writing',      installed: false },
  { id: 'sk-algorithmic-art',       name: '/algorithmic-art',       provider: 'Anthropic', description: 'Generate algorithmic art pieces',        downloads:  4800, category: 'Creative',     installed: false },
  { id: 'sk-slack-gif-creator',     name: '/slack-gif-creator',     provider: 'Anthropic', description: 'Make Slack-friendly GIFs',               downloads:  3700, category: 'Creative',     installed: false },
  { id: 'sk-skill-creator',         name: '/skill-creator',         provider: 'Anthropic', description: 'Create new reusable skills',             downloads:  2900, category: 'Engineering',  installed: false },
];

// ── Directory: Connectors tab ──────────────────────────────
export const mockDirectoryConnectors: DirectoryConnectorEntry[] = [
  { id: 'cn-google-drive',     name: 'Google Drive',           description: 'Files, folders, and shared docs',     category: 'Storage',     popularity: 'Most popular',  connected: true,  iconLetter: 'G', iconColor: '#1a73e8' },
  { id: 'cn-gmail',            name: 'Gmail',                  description: 'Email threads and attachments',       category: 'Communication', popularity: 'Most popular',  connected: true,  iconLetter: 'M', iconColor: '#ea4335' },
  { id: 'cn-google-calendar',  name: 'Google Calendar',        description: 'Events, schedules, and invites',      category: 'Productivity', popularity: 'Popular',       connected: false, iconLetter: 'C', iconColor: '#4285f4' },
  { id: 'cn-figma',            name: 'Figma',                  description: 'Files, frames, and components',       category: 'Design',      popularity: 'Popular',       connected: true,  iconLetter: 'F', iconColor: '#a259ff' },
  { id: 'cn-microsoft-365',    name: 'Microsoft 365',          description: 'Word, Excel, PowerPoint and more',    category: 'Productivity', popularity: 'Popular',       connected: false, iconLetter: 'M', iconColor: '#d83b01' },
  { id: 'cn-box',              name: 'Box',                    description: 'Cloud content management',            category: 'Storage',     popularity: 'Trending',      connected: false, iconLetter: 'B', iconColor: '#0061d5' },
  { id: 'cn-hubspot',          name: 'HubSpot',                description: 'CRM, contacts, and deals',            category: 'Sales',       popularity: 'Popular',       connected: false, iconLetter: 'H', iconColor: '#ff7a59' },
  { id: 'cn-intercom',         name: 'Intercom',               description: 'Conversations and customer data',     category: 'Support',     popularity: 'Trending',      connected: false, iconLetter: 'I', iconColor: '#1f8ded' },
  { id: 'cn-spotify',          name: 'Spotify',                description: 'Playlists and listening history',     category: 'Lifestyle',   popularity: 'New',           connected: false, iconLetter: 'S', iconColor: '#1db954' },
  { id: 'cn-monday',           name: 'monday.com',             description: 'Boards, items, and updates',          category: 'Productivity', popularity: 'Popular',       connected: false, iconLetter: 'M', iconColor: '#ff3d57' },
  { id: 'cn-atlassian-rovo',   name: 'Atlassian Rovo',         description: 'Search across Jira and Confluence',   category: 'Productivity', popularity: 'New',           connected: false, iconLetter: 'A', iconColor: '#0052cc' },
  { id: 'cn-autodesk',         name: 'Autodesk Product Help',  description: 'Docs and tutorials',                  category: 'Engineering', popularity: 'New',           connected: false, iconLetter: 'A', iconColor: '#0696d7' },
];

// ── Directory: Plugins tab ─────────────────────────────────
export const mockDirectoryPlugins: Plugin[] = mockPlugins;

// ── Directory: MCP servers ─────────────────────────────────
// Mix of official MCP reference servers and popular community ones.
export const mockDirectoryMCPs: MCPServer[] = [
  { id: 'mcp-filesystem',  name: 'Filesystem',          provider: 'Anthropic',           description: 'Læse, skrive og søge i lokale filer.',                          transport: 'stdio', status: 'connected',     toolCount: 11, resourceCount: 0,  category: 'Local',       iconLetter: 'F',  iconColor: '#0f766e', popularity: 'Most popular', installed: true  },
  { id: 'mcp-github',      name: 'GitHub',              provider: 'GitHub',              description: 'Repositories, issues, pull requests og code search.',           transport: 'http',  status: 'connected',     toolCount: 26, resourceCount: 4,  category: 'Engineering', iconLetter: 'G',  iconColor: '#24292e', popularity: 'Most popular', installed: true  },
  { id: 'mcp-postgres',    name: 'PostgreSQL',          provider: 'Anthropic',           description: 'Skemabevidste, read-only forespørgsler mod en Postgres-database.', transport: 'stdio', status: 'available',     toolCount: 4,  resourceCount: 12, category: 'Data',        iconLetter: 'P',  iconColor: '#336791', popularity: 'Popular',      installed: false },
  { id: 'mcp-linear',      name: 'Linear',              provider: 'Linear',              description: 'Issues, projekter, cycles og roadmaps fra Linear.',              transport: 'sse',   status: 'requires-auth', toolCount: 14, resourceCount: 3,  category: 'Productivity',iconLetter: 'L',  iconColor: '#5e6ad2', popularity: 'Popular',      installed: false },
  { id: 'mcp-sentry',      name: 'Sentry',              provider: 'Sentry',              description: 'Find og analyser fejl, releases og performance-issues.',         transport: 'http',  status: 'available',     toolCount: 9,  resourceCount: 2,  category: 'Engineering', iconLetter: 'S',  iconColor: '#362d59', popularity: 'Popular',      installed: false },
  { id: 'mcp-slack',       name: 'Slack',               provider: 'Anthropic',           description: 'Læs kanaler, send beskeder og søg i workspace-historik.',        transport: 'sse',   status: 'requires-auth', toolCount: 8,  resourceCount: 1,  category: 'Communication',iconLetter: 'S', iconColor: '#4a154b', popularity: 'Most popular', installed: false },
  { id: 'mcp-brave',       name: 'Brave Search',        provider: 'Brave',               description: 'Web- og lokalsøgning via Brave Search API.',                     transport: 'stdio', status: 'available',     toolCount: 2,  resourceCount: 0,  category: 'Search',      iconLetter: 'B',  iconColor: '#fb542b', popularity: 'Trending',     installed: false },
  { id: 'mcp-notion',      name: 'Notion',              provider: 'Notion',              description: 'Sider, databaser og blocks i et Notion-workspace.',              transport: 'http',  status: 'available',     toolCount: 12, resourceCount: 5,  category: 'Productivity',iconLetter: 'N',  iconColor: '#000000', popularity: 'Popular',      installed: false },
  { id: 'mcp-memory',      name: 'Memory',              provider: 'Anthropic',           description: 'Persistent knowledge graph på tværs af samtaler.',               transport: 'stdio', status: 'connected',     toolCount: 9,  resourceCount: 0,  category: 'Local',       iconLetter: 'M',  iconColor: '#43FFC8', popularity: 'New',          installed: true  },
  { id: 'mcp-puppeteer',   name: 'Puppeteer',           provider: 'Anthropic',           description: 'Browser-automation: scrape, screenshot og interaktion.',         transport: 'stdio', status: 'available',     toolCount: 7,  resourceCount: 0,  category: 'Web',         iconLetter: 'P',  iconColor: '#1f2937', popularity: 'Popular',      installed: false },
  { id: 'mcp-gdrive',      name: 'Google Drive',        provider: 'Anthropic',           description: 'Find og læs filer på tværs af Google Drive.',                    transport: 'http',  status: 'requires-auth', toolCount: 5,  resourceCount: 1,  category: 'Storage',     iconLetter: 'G',  iconColor: '#1a73e8', popularity: 'Most popular', installed: false },
  { id: 'mcp-sequential',  name: 'Sequential Thinking', provider: 'Anthropic',           description: 'Struktureret, trinvis ræsonnering for komplekse opgaver.',       transport: 'stdio', status: 'available',     toolCount: 1,  resourceCount: 0,  category: 'Reasoning',   iconLetter: 'S',  iconColor: '#004E51', popularity: 'New',          installed: false },
  { id: 'mcp-time',        name: 'Time',                provider: 'Anthropic',           description: 'Tidszone-konverteringer og aktuel tid.',                         transport: 'stdio', status: 'available',     toolCount: 2,  resourceCount: 0,  category: 'Utility',     iconLetter: 'T',  iconColor: '#64748b', popularity: 'New',          installed: false },
  { id: 'mcp-stripe',      name: 'Stripe',              provider: 'Stripe',              description: 'Customers, payments, invoices og subscriptions.',                transport: 'http',  status: 'requires-auth', toolCount: 18, resourceCount: 6,  category: 'Finance',     iconLetter: 'S',  iconColor: '#635bff', popularity: 'Popular',      installed: false },
];

// ── GitHub sources ─────────────────────────────────────────
export const mockGitHubSources: GitHubRepo[] = [
  { id: 'gh-1', fullName: 'Biyocon/Ai-Agent-RAG',      defaultBranch: 'main', description: 'Retrieval-augmented generation agent',         paths: ['README.md', 'src/agent/index.ts', 'docs/architecture.md'] },
  { id: 'gh-2', fullName: 'Biyocon/Ai-agent-platform', defaultBranch: 'main', description: 'Multi-agent orchestration platform',           paths: ['README.md', 'apps/web/src/App.tsx', 'packages/core/index.ts'] },
  { id: 'gh-3', fullName: 'Biyocon/SkillMatch',        defaultBranch: 'main', description: 'Skill matching and recommendation engine',     paths: ['README.md', 'src/match/index.ts', 'src/skills/registry.ts'] },
  { id: 'gh-4', fullName: 'Biyocon/ai-dev-tasks',      defaultBranch: 'main', description: 'Task templates for AI-assisted development',   paths: ['README.md', 'tasks/build.md', 'tasks/review.md'] },
];
