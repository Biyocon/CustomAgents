import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid3X3,
  List,
  Plus,
  ChevronRight,
  Pin,
  Users,
  Clock,
  Tag,
  MoreHorizontal,
  Folder,
  Share2,
  Sparkles,
  Filter,
  X,
} from 'lucide-react';
import { WorkspaceCard } from './workspace/WorkspaceCard';
import { StatusBadge } from './workspace/StatusBadge';
import { cn } from '@/lib/utils';

type ProjectStatus = 'active' | 'idle' | 'processing' | 'success';

interface Project {
  id: string;
  name: string;
  desc: string;
  status: ProjectStatus;
  type: string;
  tags: string[];
  members: string[];
  modified: string;
  pinned?: boolean;
  shared?: boolean;
  isExample?: boolean;
  color: string;
  memberColors: string[];
}

const ALL_PROJECTS: Project[] = [
  {
    id: '1', name: 'Landing Page Redesign', desc: 'Full homepage and pricing page visual redesign using the Alexandria design system.',
    status: 'processing', type: 'Design', tags: ['design', 'stitch'], members: ['AC', 'JR', 'MK'],
    memberColors: ['bg-[#004E51] text-white', 'bg-[#6d28d9] text-white', 'bg-[#92400e] text-white'],
    modified: '2 hours ago', pinned: true, shared: true, color: '#1d4ed8',
  },
  {
    id: '2', name: 'Q3 Report Analysis', desc: 'Quarterly metrics synthesis and executive summary generation from raw data exports.',
    status: 'success', type: 'Analysis', tags: ['data', 'reports'], members: ['AC'],
    memberColors: ['bg-[#004E51] text-white'],
    modified: 'Yesterday', pinned: true, shared: false, color: '#16a34a',
  },
  {
    id: '3', name: 'API Documentation', desc: 'Technical documentation for v2 API endpoints, authentication flows, and SDK examples.',
    status: 'idle', type: 'Docs', tags: ['docs', 'code'], members: ['AC', 'KT'],
    memberColors: ['bg-[#004E51] text-white', 'bg-[#1d4ed8] text-white'],
    modified: '3 days ago', pinned: false, shared: true, color: '#7c3aed',
  },
  {
    id: '4', name: 'Brand Guidelines', desc: 'Visual identity standards — typography, colour palette, logo usage, and tone of voice.',
    status: 'idle', type: 'Design', tags: ['brand', 'design'], members: ['AC', 'LM', 'JR'],
    memberColors: ['bg-[#004E51] text-white', 'bg-[#be185d] text-white', 'bg-[#6d28d9] text-white'],
    modified: '1 week ago', pinned: false, shared: false, color: '#d97706',
  },
  {
    id: '5', name: 'Product Launch Plan', desc: 'Go-to-market strategy, messaging framework, and launch timeline for Q4 release.',
    status: 'active', type: 'Strategy', tags: ['strategy', 'planning'], members: ['AC', 'SB'],
    memberColors: ['bg-[#004E51] text-white', 'bg-[#0891b2] text-white'],
    modified: '30 mins ago', pinned: false, shared: true, color: '#0891b2',
  },
  {
    id: '6', name: 'Competitive Analysis', desc: 'Market research deep-dive on the top 5 competitors across positioning, pricing, and UX.',
    status: 'idle', type: 'Research', tags: ['research'], members: ['AC'],
    memberColors: ['bg-[#004E51] text-white'],
    modified: '2 weeks ago', pinned: false, shared: false, color: '#be185d',
  },
  {
    id: '7', name: 'Onboarding Email Flow', desc: 'Six-step email nurture sequence for new signups with personalisation logic.',
    status: 'idle', type: 'Docs', tags: ['email', 'docs'], members: ['AC', 'JR'],
    memberColors: ['bg-[#004E51] text-white', 'bg-[#6d28d9] text-white'],
    modified: '3 weeks ago', pinned: false, shared: true, color: '#0f766e',
  },
];

const EXAMPLE_PROJECTS: Project[] = [
  {
    id: 'ex1', name: 'AI Newsletter Generator', desc: 'Automated weekly newsletter from your knowledge base and curated sources.',
    status: 'idle', type: 'Template', tags: ['template', 'automation'], members: [],
    memberColors: [], modified: '', isExample: true, color: '#004E51',
  },
  {
    id: 'ex2', name: 'Research Assistant', desc: 'Deep research workflow with citation tracking and summary generation.',
    status: 'idle', type: 'Template', tags: ['template', 'research'], members: [],
    memberColors: [], modified: '', isExample: true, color: '#004E51',
  },
  {
    id: 'ex3', name: 'Code Review Bot', desc: 'Automated PR analysis that flags issues and suggests improvements.',
    status: 'idle', type: 'Template', tags: ['template', 'code'], members: [],
    memberColors: [], modified: '', isExample: true, color: '#004E51',
  },
  {
    id: 'ex4', name: 'Report Builder', desc: 'Data-driven report generation from spreadsheets and database queries.',
    status: 'idle', type: 'Template', tags: ['template', 'data'], members: [],
    memberColors: [], modified: '', isExample: true, color: '#004E51',
  },
  {
    id: 'ex5', name: 'Slide Deck Maker', desc: 'Generate polished presentations from a brief or an existing document.',
    status: 'idle', type: 'Template', tags: ['template', 'design'], members: [],
    memberColors: [], modified: '', isExample: true, color: '#004E51',
  },
  {
    id: 'ex6', name: 'Customer Interview Synthesis', desc: 'Analyse transcripts and extract themes, pain points, and quotes.',
    status: 'idle', type: 'Template', tags: ['template', 'research'], members: [],
    memberColors: [], modified: '', isExample: true, color: '#004E51',
  },
];

type Tab = 'all' | 'shared' | 'pinned' | 'examples';
type ViewMode = 'grid' | 'list';

const TYPE_FILTER_OPTIONS = ['Design', 'Analysis', 'Docs', 'Research', 'Strategy'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as any } },
};

export function ProjectsView() {
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [search, setSearch] = useState('');
  const [activeTypeFilters, setActiveTypeFilters] = useState<string[]>([]);

  const toggleTypeFilter = (type: string) => {
    setActiveTypeFilters(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setActiveTypeFilters([]);
  };

  const hasActiveFilters = search.length > 0 || activeTypeFilters.length > 0;

  const displayedProjects = useMemo(() => {
    let pool: Project[] = [];

    if (activeTab === 'examples') {
      pool = EXAMPLE_PROJECTS;
    } else {
      pool = ALL_PROJECTS.filter(p => !p.isExample);
      if (activeTab === 'shared') pool = pool.filter(p => p.shared);
      if (activeTab === 'pinned') pool = [...pool.filter(p => p.pinned), ...pool.filter(p => !p.pinned)];
    }

    if (search) {
      const q = search.toLowerCase();
      pool = pool.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      );
    }

    if (activeTypeFilters.length > 0) {
      pool = pool.filter(p => activeTypeFilters.includes(p.type));
    }

    return pool;
  }, [activeTab, search, activeTypeFilters]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'all', label: 'All Projects', count: ALL_PROJECTS.length },
    { id: 'shared', label: 'Shared with Me', count: ALL_PROJECTS.filter(p => p.shared).length },
    { id: 'pinned', label: 'Pinned / Recent', count: ALL_PROJECTS.filter(p => p.pinned).length },
    { id: 'examples', label: 'Example Projects', count: EXAMPLE_PROJECTS.length },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">

      {/* ── Page Header ────────────────────────── */}
      <div className="shrink-0 border-b border-border bg-white px-4 md:px-8 pt-6 pb-0">
        <div className="max-w-[1140px] mx-auto">

          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">Projects</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Your workspace archive — all active and past work.</p>
            </div>
            <button
              className="flex items-center gap-2 bg-primary hover:bg-[#003a3d] text-primary-foreground text-sm font-medium px-4 py-2 rounded-[var(--radius-md)] transition-all duration-200 hover:-translate-y-[1px] shadow-sm shrink-0"
              data-testid="button-new-project"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>

          {/* Search + controls row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#f5f5f5] border border-border rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 placeholder:text-muted-foreground/60 transition-all"
                data-testid="input-search-projects"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Type filter chips */}
            <div className="hidden md:flex items-center gap-1.5 flex-wrap">
              {TYPE_FILTER_OPTIONS.map(type => (
                <button
                  key={type}
                  onClick={() => toggleTypeFilter(type)}
                  className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full border transition-colors',
                    activeTypeFilters.includes(type)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                  )}
                  data-testid={`filter-type-${type.toLowerCase()}`}
                >
                  {type}
                </button>
              ))}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium px-2 py-1 text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  data-testid="button-clear-filters"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>

            <div className="ml-auto flex items-center gap-1 border border-border rounded-[var(--radius-md)] p-0.5 bg-background">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                data-testid="button-view-grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-1.5 rounded-md transition-colors',
                  viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                data-testid="button-view-list"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile filter toggle */}
          <div className="flex md:hidden items-center gap-1.5 flex-wrap mb-3">
            {TYPE_FILTER_OPTIONS.map(type => (
              <button
                key={type}
                onClick={() => toggleTypeFilter(type)}
                className={cn(
                  'text-xs font-medium px-2.5 py-1 rounded-full border transition-colors',
                  activeTypeFilters.includes(type)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border'
                )}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex items-end gap-0 -mb-px overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                )}
                data-testid={`tab-${tab.id}`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    'text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content Area ───────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        <div className="max-w-[1140px] mx-auto">

          {/* Empty state */}
          {displayedProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Filter className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">No projects match</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filters.</p>
              <button onClick={clearFilters} className="mt-3 text-xs font-medium text-primary hover:underline">
                Clear all filters
              </button>
            </motion.div>
          )}

          {/* Section label for pinned */}
          {activeTab === 'pinned' && displayedProjects.some(p => p.pinned) && (
            <div className="flex items-center gap-2 mb-3">
              <Pin className="w-3 h-3 text-muted-foreground" />
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Pinned</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${viewMode}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'flex flex-col gap-2'
              )}
            >
              {displayedProjects.map((project, idx) => (
                <motion.div key={project.id} variants={itemVariants}>
                  {viewMode === 'grid'
                    ? <ProjectCard project={project} idx={idx} />
                    : <ProjectRow project={project} idx={idx} />
                  }
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Example projects section note */}
          {activeTab === 'examples' && displayedProjects.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-xs text-muted-foreground">
                Use an example to start quickly — it will be cloned into your workspace.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Grid Card ───────────────────────────────────── */
function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  return (
    <WorkspaceCard
      variant="default"
      padding="none"
      className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/20 transition-all duration-200 overflow-hidden flex flex-col"
      data-testid={`project-card-${idx}`}
    >
      {/* Coloured top bar */}
      <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: project.color }} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${project.color}18` }}
            >
              {project.isExample
                ? <Sparkles className="w-3.5 h-3.5" style={{ color: project.color }} />
                : <Folder className="w-3.5 h-3.5" style={{ color: project.color }} />
              }
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate leading-snug">{project.name}</h3>
              <span className="text-[11px] text-muted-foreground">{project.type}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {project.pinned && <Pin className="w-3 h-3 text-muted-foreground/60" />}
            {project.shared && <Share2 className="w-3 h-3 text-muted-foreground/60" />}
            <button
              className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={e => e.stopPropagation()}
              data-testid={`project-menu-${project.id}`}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">{project.desc}</p>

        {/* Tags */}
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 bg-muted text-muted-foreground rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-border/60">
          <div className="flex items-center gap-1.5">
            {project.isExample ? (
              <span className="text-[11px] text-muted-foreground">Template</span>
            ) : (
              <>
                {/* Member avatars */}
                <div className="flex -space-x-1.5">
                  {project.members.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className={cn('w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center border border-white shrink-0', project.memberColors[i])}
                    >
                      {m[0]}
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-[9px] font-bold flex items-center justify-center border border-white">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                {project.modified && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {project.modified}
                  </span>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StatusBadge status={project.status} size="sm" />
            {project.isExample ? (
              <button
                className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                data-testid={`project-use-${project.id}`}
              >
                Use <ChevronRight className="w-3 h-3" />
              </button>
            ) : (
              <button
                className="text-[11px] font-medium text-muted-foreground group-hover:text-primary flex items-center gap-0.5 transition-colors opacity-0 group-hover:opacity-100"
                data-testid={`project-open-${project.id}`}
              >
                Open <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </WorkspaceCard>
  );
}

/* ── List Row ────────────────────────────────────── */
function ProjectRow({ project, idx }: { project: Project; idx: number }) {
  return (
    <div
      className="group flex items-center gap-4 px-4 py-3 bg-white border border-[#e0e0e0] rounded-[var(--radius-lg)] hover:border-primary/20 hover:shadow-sm transition-all duration-150 cursor-pointer"
      data-testid={`project-row-${idx}`}
    >
      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${project.color}18` }}
      >
        {project.isExample
          ? <Sparkles className="w-4 h-4" style={{ color: project.color }} />
          : <Folder className="w-4 h-4" style={{ color: project.color }} />
        }
      </div>

      {/* Name + desc */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground truncate">{project.name}</span>
          {project.pinned && <Pin className="w-3 h-3 text-muted-foreground/50 shrink-0" />}
          {project.shared && <Share2 className="w-3 h-3 text-muted-foreground/50 shrink-0" />}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">{project.desc}</p>
      </div>

      {/* Type */}
      <span className="hidden md:block text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
        {project.type}
      </span>

      {/* Tags */}
      <div className="hidden lg:flex items-center gap-1 shrink-0">
        {project.tags.slice(0, 2).map(tag => (
          <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 bg-[#f5f5f5] text-muted-foreground rounded-full flex items-center gap-0.5">
            <Tag className="w-2.5 h-2.5" />{tag}
          </span>
        ))}
      </div>

      {/* Members */}
      {project.members.length > 0 && (
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <div className="flex -space-x-1.5">
            {project.members.slice(0, 3).map((m, i) => (
              <div
                key={i}
                className={cn('w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center border border-white', project.memberColors[i])}
              >
                {m[0]}
              </div>
            ))}
          </div>
          <Users className="w-3 h-3 text-muted-foreground ml-1" />
        </div>
      )}

      {/* Modified */}
      {project.modified && (
        <span className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground shrink-0 whitespace-nowrap">
          <Clock className="w-3 h-3" />{project.modified}
        </span>
      )}

      {/* Status */}
      <StatusBadge status={project.status} size="sm" className="shrink-0" />

      {/* Actions */}
      <button
        className="p-1.5 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
        onClick={e => e.stopPropagation()}
        data-testid={`project-row-menu-${project.id}`}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
