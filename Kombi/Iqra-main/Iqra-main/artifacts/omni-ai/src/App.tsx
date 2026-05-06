import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Share2, Download, Paperclip, Shield } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ChatView } from './components/ChatView';
import { StitchView } from './components/StitchView';
import { HomeView } from './components/HomeView';
import { ProjectsView } from './components/ProjectsView';
import { DesignSystemsView } from './components/DesignSystemsView';
import { WorkflowsView } from './components/WorkflowsView';
import { AgentsView } from './components/AgentsView';
import { AppsView } from './components/AppsView';
import { ExploreView } from './components/ExploreView';
import { SettingsView } from './components/SettingsView';
import { ArtifactsView } from './components/ArtifactsView';
import { ModalProvider, GlobalModals, useModal } from './components/GlobalModals';
import type { ChatMessage } from '@workspace/api-client-react';

export type ActiveView =
  | 'home' | 'chat' | 'stitch' | 'projects' | 'design-systems'
  | 'workflows' | 'agents' | 'apps' | 'explore' | 'settings' | 'artifacts';

const BREADCRUMBS: Record<ActiveView, Array<{ label: string; active?: boolean }>> = {
  home:           [{ label: 'Workspace' }, { label: 'Home', active: true }],
  chat:           [{ label: 'Workspace' }, { label: 'Chats', active: true }],
  projects:       [{ label: 'Workspace' }, { label: 'Projects', active: true }],
  stitch:         [{ label: 'Tools' }, { label: 'Stitch', active: true }],
  'design-systems': [{ label: 'Tools' }, { label: 'Design Systems', active: true }],
  workflows:      [{ label: 'Tools' }, { label: 'Workflows', active: true }],
  agents:         [{ label: 'Tools' }, { label: 'Agents', active: true }],
  apps:           [{ label: 'Workspace' }, { label: 'Apps', active: true }],
  explore:        [{ label: 'Workspace' }, { label: 'Explore', active: true }],
  settings:       [{ label: 'Account' }, { label: 'Settings', active: true }],
  artifacts:      [{ label: 'Workspace' }, { label: 'Artifacts', active: true }],
};

const VIEW_TITLES: Record<ActiveView, string> = {
  home: 'IQRA', chat: 'Chat', stitch: 'Stitch', projects: 'Projects',
  'design-systems': 'Design Systems', workflows: 'Workflows', agents: 'Agents',
  apps: 'Apps', explore: 'Explore', settings: 'Settings', artifacts: 'Artifacts',
};

const FADE = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -15 }, transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as any } };

/* ─── Inner app — has access to ModalProvider context ─── */
function AppContent() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Active chat thread shared between HomeView and ChatView so the spoken
  // conversation that started in voice mode (Stemmetilstand) survives the
  // overlay closing AND view switches. Voice turns from either view append
  // here; ChatView renders them as the visible thread; HomeView jumps to
  // ChatView once the user ends voice mode with content in the thread.
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { open } = useModal();

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 768 && w < 1024) setIsSidebarCollapsed(true);
      else if (w >= 1024) setIsSidebarCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const title = VIEW_TITLES[activeView];

  /* Topbar action buttons — contextual to view */
  const showDocActions = ['chat', 'projects', 'apps'].includes(activeView);
  const showShareOnly  = ['home', 'workflows', 'agents', 'design-systems', 'explore', 'artifacts'].includes(activeView);

  const topbarActions = (
    <div className="flex items-center gap-1">
      <button
        onClick={() => open('attach', { title })}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors"
        data-testid="btn-topbar-attach"
        title="Attach files or knowledge"
      >
        <Paperclip className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Attach</span>
      </button>

      {(showDocActions || showShareOnly) && (
        <button
          onClick={() => open('share', { title, resourceType: activeView })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors"
          data-testid="btn-topbar-share"
          title="Share or remix"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Share</span>
        </button>
      )}

      {showDocActions && (<>
        <button
          onClick={() => open('export', { title, resourceType: activeView })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors"
          data-testid="btn-topbar-export"
          title="Export"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Export</span>
        </button>
        <button
          onClick={() => open('permissions', { title, resourceType: activeView })}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-lg transition-colors"
          data-testid="btn-topbar-permissions"
          title="Permissions"
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Permissions</span>
        </button>
      </>)}
    </div>
  );

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-[#FAFAFA] text-foreground font-sans relative">

      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 right-0 h-14 bg-background/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-4">
        <div className="font-bold text-lg tracking-tight text-foreground flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-sm rotate-45 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-background -rotate-45" />
          </div>
          IQRA
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -mr-2 text-foreground"
          data-testid="button-mobile-menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/20 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar
          activeView={activeView}
          setActiveView={(view) => { setActiveView(view); setIsMobileMenuOpen(false); }}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapsed={() => setIsSidebarCollapsed(v => !v)}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 relative flex flex-col overflow-hidden pt-14 md:pt-0 min-w-0">
        <Topbar
          breadcrumb={BREADCRUMBS[activeView]}
          onToggleSidebar={() => setIsSidebarCollapsed(v => !v)}
          isSidebarCollapsed={isSidebarCollapsed}
          actions={topbarActions}
        />

        <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            {activeView === 'home' && (
              <motion.div key="home" {...FADE} className="absolute inset-0">
                <HomeView
                  setActiveView={setActiveView}
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  selectedAgentId={selectedAgentId}
                  onSelectedAgentIdChange={setSelectedAgentId}
                />
              </motion.div>
            )}
            {activeView === 'chat' && (
              <motion.div key="chat" {...FADE} className="absolute inset-0">
                <ChatView
                  chatMessages={chatMessages}
                  setChatMessages={setChatMessages}
                  selectedAgentId={selectedAgentId}
                  onSelectedAgentIdChange={setSelectedAgentId}
                />
              </motion.div>
            )}
            {activeView === 'stitch' && (
              <motion.div key="stitch" {...FADE} className="absolute inset-0">
                <StitchView />
              </motion.div>
            )}
            {activeView === 'projects' && (
              <motion.div key="projects" {...FADE} className="absolute inset-0">
                <ProjectsView />
              </motion.div>
            )}
            {activeView === 'design-systems' && (
              <motion.div key="design-systems" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <DesignSystemsView />
              </motion.div>
            )}
            {activeView === 'workflows' && (
              <motion.div key="workflows" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <AgentsView
                  selectedAgentId={selectedAgentId}
                  onUseAgent={(agentId) => {
                    setSelectedAgentId(agentId);
                    setActiveView('chat');
                  }}
                />
              </motion.div>
            )}
            {activeView === 'agents' && (
              <motion.div key="agents" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <AgentsView />
              </motion.div>
            )}
            {activeView === 'apps' && (
              <motion.div key="apps" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <AppsView />
              </motion.div>
            )}
            {activeView === 'explore' && (
              <motion.div key="explore" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <ExploreView />
              </motion.div>
            )}
            {activeView === 'settings' && (
              <motion.div key="settings" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <SettingsView />
              </motion.div>
            )}
            {activeView === 'artifacts' && (
              <motion.div key="artifacts" {...FADE} className="absolute inset-0 flex flex-col overflow-hidden">
                <ArtifactsView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Global modal layer */}
      <GlobalModals />
    </div>
  );
}

/* ─── Root export — provides modal context ─── */
export default function App() {
  return (
    <ModalProvider>
      <AppContent />
    </ModalProvider>
  );
}
