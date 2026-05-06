import { useState, useEffect, useRef, useCallback, type Dispatch, type SetStateAction } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  FileText, 
  Zap, 
  Layers, 
  ScanLine, 
  Sparkles,
  ChevronRight,
  RefreshCw,
  FileSearch,
  GitBranch,
  Table,
  Presentation,
  File,
  MoreHorizontal,
  Palette,
  BookOpen,
  BarChart3,
  Code2,
  Folder
} from 'lucide-react';
import { AdvancedPromptComposer } from './AdvancedPromptComposer';
import { WorkspaceCard, StatusBadge, WorkspaceButton } from './workspace';
import { ActiveView } from '../App';
import { cn } from '@/lib/utils';
import { chatCompletion, type ChatMessage } from '@workspace/api-client-react';
import { getAgentsByScope } from '@workspace/agents';
import { useSpeechSettings, getVoiceErrorMessage } from '@/lib/speechSettings';

const MAX_CLIENT_HISTORY = 30;
const TEAM_AGENT_COUNT = getAgentsByScope('team').length;

interface HomeViewProps {
  setActiveView: (view: ActiveView) => void;
  chatMessages: ChatMessage[];
  setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  selectedAgentId?: string | null;
  onSelectedAgentIdChange?: (agentId: string | null) => void;
}

export function HomeView({
  setActiveView,
  chatMessages,
  setChatMessages,
  selectedAgentId,
  onSelectedAgentIdChange,
}: HomeViewProps) {
  const [hour, setHour] = useState(new Date().getHours());
  const speechSettings = useSpeechSettings();
  // Mirror the lifted chat thread into a ref so the memoised voice callback
  // always reads the latest history (without re-creating the callback and
  // re-mounting the speech recogniser).
  const chatMessagesRef = useRef(chatMessages);
  chatMessagesRef.current = chatMessages;
  // Mirror the latest language setting into a ref so the (memoised)
  // getVoiceReply callback always uses the current locale without being
  // re-created — recreating it would re-mount the speech recogniser.
  const recognitionLangRef = useRef(speechSettings.recognitionLang);
  recognitionLangRef.current = speechSettings.recognitionLang;
  // Tracks whether voice mode produced anything in the current overlay
  // session. Used to decide whether ending Stemmetilstand should jump the
  // user into ChatView so they can read the spoken conversation.
  const voiceProducedTurnRef = useRef(false);

  const getVoiceReply = useCallback(async (transcript: string): Promise<string> => {
    const userMessage: ChatMessage = { role: 'user', content: transcript };
    // Append the user transcript immediately so it shows up in the chat
    // thread even if the assistant reply takes a moment / fails.
    setChatMessages(prev => [...prev, userMessage]);
    voiceProducedTurnRef.current = true;
    // Server still expects the trimmed history window to keep the payload
    // bounded; the visible thread remains unbounded for the user.
    const history = [...chatMessagesRef.current, userMessage].slice(-MAX_CLIENT_HISTORY);
    try {
      const { reply } = await chatCompletion({
        messages: history,
        language: recognitionLangRef.current,
        agentId: selectedAgentId || undefined,
      });
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      setChatMessages(prev => [...prev, assistantMessage]);
      return reply;
    } catch (err) {
      console.error('Voice chat completion failed', err);
      return getVoiceErrorMessage(recognitionLangRef.current);
    }
  }, [selectedAgentId, setChatMessages]);

  const sendTypedPrompt = useCallback(async (prompt: string, agentId?: string): Promise<void> => {
    const trimmed = prompt.trim();
    if (!trimmed) return;
    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setChatMessages(prev => [...prev, userMessage]);
    const history = [...chatMessagesRef.current, userMessage].slice(-MAX_CLIENT_HISTORY);
    try {
      const { reply } = await chatCompletion({
        messages: history,
        language: recognitionLangRef.current,
        agentId,
      });
      const assistantMessage: ChatMessage = { role: 'assistant', content: reply };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Typed chat completion failed', err);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: getVoiceErrorMessage(recognitionLangRef.current),
        },
      ]);
    }
  }, [setChatMessages]);

  const handleVoiceEnd = useCallback(() => {
    // Only navigate when the just-ended overlay session actually produced
    // turns — opening + closing voice mode without speaking should leave
    // the user on Home.
    if (voiceProducedTurnRef.current) {
      voiceProducedTurnRef.current = false;
      setActiveView('chat');
    }
  }, [setActiveView]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHour(new Date().getHours());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] as any }
    },
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto pt-8 md:pt-12 pb-20 px-4 md:px-6 lg:px-8">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-12"
      >
        {/* Section 1: Hero / Command Center */}
        <motion.section variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Command Center</h2>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">{greeting}, Alex</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="text-sm text-muted-foreground font-medium">{today}</span>
              <span className="text-border mx-1">•</span>
              <StatusBadge status="active" label="3 Active Tasks" dot />
              <StatusBadge status="processing" label="2 Processing" dot />
              <StatusBadge status="success" label="12 Complete" dot />
            </div>
          </div>

          <div className="max-w-3xl">
            <AdvancedPromptComposer
              placeholder="What do you want to build today?"
              suggestions={[
                { icon: <Presentation className="w-4 h-4" />, label: 'Create slide deck' },
                { icon: <Palette className="w-4 h-4" />, label: 'Design system' },
                { icon: <BookOpen className="w-4 h-4" />, label: 'Document to skill' },
                { icon: <BarChart3 className="w-4 h-4" />, label: 'Analyze data' },
                { icon: <Code2 className="w-4 h-4" />, label: 'Generate code' },
              ]}
              onSubmit={(value, payload) => {
                // Voice turns are routed through the same submit pipeline,
                // but we don't want to remount the composer (and thus
                // tear down the active Stemmetilstand session) after every
                // spoken turn — the navigation happens from `onVoiceEnd`
                // when the overlay is closed. Typed prompts still jump
                // straight to the chat view.
                if (payload.voiceEnabled) return;
                void sendTypedPrompt(value, payload.agent?.id);
                setActiveView('chat');
              }}
              getVoiceReply={getVoiceReply}
              onVoiceEnd={handleVoiceEnd}
              speechLang={speechSettings.recognitionLang}
              speechVoiceURI={speechSettings.ttsVoiceURI}
              selectedAgentId={selectedAgentId}
              onSelectedAgentIdChange={onSelectedAgentIdChange}
            />
          </div>
        </motion.section>

        <hr className="border-border my-2" />

        {/* Section 2: Quick Start Grid */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Quick Start</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <WorkspaceCard variant="default" padding="sm" className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200">
              <div className="flex flex-col gap-3 h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">New Conversation</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Start a fresh AI dialogue</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1" data-testid="btn-quick-chat" onClick={(e) => { e.stopPropagation(); setActiveView('chat'); }}>
                    Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard variant="default" padding="sm" className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200">
              <div className="flex flex-col gap-3 h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Generate Document</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Draft, summarize or transform text</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1" data-testid="btn-quick-doc">
                    Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard variant="default" padding="sm" className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200">
              <div className="flex flex-col gap-3 h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Run Workflow</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Execute a saved automation sequence</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1" data-testid="btn-quick-workflow">
                    Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard variant="default" padding="sm" className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200" onClick={() => setActiveView('stitch')}>
              <div className="flex flex-col gap-3 h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Launch Stitch</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Design UI from a design system</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1" data-testid="btn-quick-stitch">
                    Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard variant="default" padding="sm" className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200">
              <div className="flex flex-col gap-3 h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Analyze File</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Upload and extract insights</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1" data-testid="btn-quick-analyze">
                    Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard variant="default" padding="sm" className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all duration-200">
              <div className="flex flex-col gap-3 h-full">
                <div className="w-9 h-9 rounded-lg bg-primary/8 flex items-center justify-center text-primary">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-foreground">Browse Skills</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Find AI experts and tools</p>
                </div>
                <div className="flex justify-end mt-2">
                  <button className="text-[13px] font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1" data-testid="btn-quick-skills">
                    Run <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </WorkspaceCard>
          </div>
        </motion.section>

        <hr className="border-border my-2" />

        {/* Section 3: Apps & Workspaces */}
        <motion.section variants={itemVariants} className="flex flex-col gap-4">
          <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Apps & Workspaces</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <WorkspaceCard 
              variant="default" 
              padding="sm" 
              className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] transition-all duration-200 bg-gradient-to-br from-white to-slate-50/60 border-l-4 border-l-[#004E51] hover:border-[#004E51]/50"
              onClick={() => setActiveView('stitch')}
              data-testid="app-stitch"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#004E51]/10 flex items-center justify-center text-[#004E51] group-hover:bg-[#004E51]/20 transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-foreground truncate">Stitch</h3>
                  <p className="text-[13px] text-muted-foreground truncate">UI from design systems</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <StatusBadge status="active" label="2 active" />
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard 
              variant="default" 
              padding="sm" 
              className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] transition-all duration-200 bg-gradient-to-br from-white to-slate-50/60 border-l-4 border-l-[#6d28d9] hover:border-[#6d28d9]/50"
              data-testid="app-workflows"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#6d28d9]/10 flex items-center justify-center text-[#6d28d9] group-hover:bg-[#6d28d9]/20 transition-colors">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-foreground truncate">Workflows</h3>
                  <p className="text-[13px] text-muted-foreground truncate">Automation & pipelines</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <StatusBadge status="processing" label="1 running" />
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard 
              variant="default" 
              padding="sm" 
              className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] transition-all duration-200 bg-gradient-to-br from-white to-slate-50/60 border-l-4 border-l-[#92400e] hover:border-[#92400e]/50"
              data-testid="app-kb"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#92400e]/10 flex items-center justify-center text-[#92400e] group-hover:bg-[#92400e]/20 transition-colors">
                  <FileSearch className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-foreground truncate">Knowledge Base</h3>
                  <p className="text-[13px] text-muted-foreground truncate">Documents & context</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <StatusBadge status="idle" label="47 docs" />
                </div>
              </div>
            </WorkspaceCard>

            <WorkspaceCard 
              variant="default" 
              padding="sm" 
              className="group cursor-pointer hover:-translate-y-[2px] hover:shadow-[var(--shadow-md)] transition-all duration-200 bg-gradient-to-br from-white to-slate-50/60 border-l-4 border-l-[#1d4ed8] hover:border-[#1d4ed8]/50"
              data-testid="app-agents"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1d4ed8]/10 flex items-center justify-center text-[#1d4ed8] group-hover:bg-[#1d4ed8]/20 transition-colors">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-bold text-foreground truncate">AI Agents</h3>
                  <p className="text-[13px] text-muted-foreground truncate">Specialized assistants</p>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <StatusBadge status="active" label={`${TEAM_AGENT_COUNT} agents`} />
                </div>
              </div>
            </WorkspaceCard>
          </div>
        </motion.section>

        <hr className="border-border my-2" />

        {/* Section 4: Design Systems & Workflow Templates */}
        <motion.section variants={itemVariants} className="flex flex-col lg:flex-row gap-6">
          <WorkspaceCard variant="elevated" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Design Systems</h2>
              <button onClick={() => setActiveView('design-systems')} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center" data-testid="link-all-ds">
                Browse all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {[
                { color: '#0f172a', name: 'Institutional IIF', desc: 'Enterprise framework', status: 'active' },
                { color: '#e26d5c', name: 'Alexandria', desc: 'Warm editorial', status: 'idle' },
                { color: '#171717', name: 'Bauhaus', desc: 'Geometric minimal', status: 'idle' },
                { color: '#bae6fd', name: 'Glacier', desc: 'Arctic clean', status: 'idle' },
              ].map((sys, i) => (
                <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f5f5f5] transition-colors group cursor-pointer" data-testid={`ds-item-${i}`}>
                  <div className="w-5 h-5 rounded-full shadow-sm shrink-0 border border-black/10" style={{ backgroundColor: sys.color }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{sys.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{sys.desc}</p>
                  </div>
                  <StatusBadge status={sys.status as 'active' | 'idle'} size="sm" />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <button className="w-full py-2 text-sm font-medium text-foreground hover:bg-[#f5f5f5] rounded-md transition-colors" data-testid="btn-upload-ds">
                Upload Design System
              </button>
            </div>
          </WorkspaceCard>

          <WorkspaceCard variant="elevated" className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Workflow Templates</h2>
              <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center" data-testid="link-all-workflows">
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 flex-1">
              {[
                { icon: Zap, name: 'Content Pipeline', desc: 'Draft → Review → Publish' },
                { icon: RefreshCw, name: 'Data Refresh', desc: 'Fetch → Clean → Analyze' },
                { icon: FileSearch, name: 'Research Loop', desc: 'Query → Summarize → Store' },
                { icon: GitBranch, name: 'Code Review', desc: 'Diff → Analyze → Comment' },
              ].map((wf, i) => (
                <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f5f5f5] transition-colors group cursor-pointer" data-testid={`wf-item-${i}`}>
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <wf.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{wf.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{wf.desc}</p>
                  </div>
                  <WorkspaceButton variant="secondary" size="sm" className="h-7 px-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>Run</WorkspaceButton>
                </div>
              ))}
            </div>
          </WorkspaceCard>
        </motion.section>

        <hr className="border-border my-2" />

        {/* Section 5: Three-column bottom row */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Featured Agents */}
          <WorkspaceCard variant="default" className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Featured Agents</h2>
              <button className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center" data-testid="link-all-agents">
                See all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="flex flex-col flex-1">
              {[
                { initial: 'A', name: 'Ara', desc: 'General assistant', bg: 'bg-[#004E51] text-white', status: 'active' },
                { initial: 'C', name: 'Cassius', desc: 'Code & architecture', bg: 'bg-[#6d28d9] text-white', status: 'idle' },
                { initial: 'M', name: 'Mira', desc: 'Research & writing', bg: 'bg-[#92400e] text-white', status: 'active' },
              ].map((agent, i) => (
                <div key={i} className="flex flex-col" data-testid={`agent-item-${i}`}>
                  <div className="flex items-center gap-3 py-3 group cursor-pointer hover:bg-[#f5f5f5] -mx-2 px-2 rounded-lg transition-colors">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0", agent.bg)}>
                      {agent.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground truncate">{agent.desc}</p>
                    </div>
                    <StatusBadge status={agent.status as 'active' | 'idle'} size="sm" />
                  </div>
                  {i < 2 && <div className="h-px bg-border w-full" />}
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <button className="w-full text-sm font-medium text-muted-foreground hover:text-foreground text-center transition-colors" data-testid="btn-browse-agents">
                Browse all agents →
              </button>
            </div>
          </WorkspaceCard>

          {/* Recent Projects */}
          <WorkspaceCard variant="default" className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Recent Projects</h2>
              <button onClick={() => setActiveView('projects')} className="text-xs font-medium text-primary hover:text-primary/80 transition-colors flex items-center" data-testid="link-all-projects">
                View all <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {[
                { bg: 'bg-blue-100 text-blue-700', name: 'Landing Page Redesign', time: '2 hours ago', status: 'processing' },
                { bg: 'bg-green-100 text-green-700', name: 'Q3 Report Analysis', time: 'Yesterday', status: 'success' },
                { bg: 'bg-purple-100 text-purple-700', name: 'API Documentation', time: '3 days ago', status: 'idle' },
                { bg: 'bg-orange-100 text-orange-700', name: 'Brand Guidelines', time: '1 week ago', status: 'idle' },
              ].map((proj, i) => (
                <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f5f5f5] transition-colors group cursor-pointer" data-testid={`project-item-${i}`}>
                  <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", proj.bg)}>
                    <Folder className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">{proj.name}</h4>
                    <p className="text-[11px] text-muted-foreground truncate">{proj.time}</p>
                  </div>
                  <StatusBadge status={proj.status as 'processing' | 'success' | 'idle'} size="sm" />
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <button onClick={() => setActiveView('projects')} className="w-full text-sm font-medium text-muted-foreground hover:text-foreground text-center transition-colors" data-testid="btn-open-projects">
                Open all projects →
              </button>
            </div>
          </WorkspaceCard>

          {/* Knowledge & Drive */}
          <WorkspaceCard variant="default" className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Knowledge & Drive</h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground">23.4 / 50 GB</span>
                <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[47%]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              {[
                { icon: FileText, name: 'Brand Guidelines v3.pdf', size: '4.2 MB' },
                { icon: Table, name: 'Q3 Metrics.xlsx', size: '1.8 MB' },
                { icon: Presentation, name: 'Deck — Product Overview.pptx', size: '12.1 MB' },
                { icon: File, name: 'Research Notes.md', size: '0.3 MB' },
              ].map((file, i) => (
                <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-[#f5f5f5] transition-colors group cursor-pointer" data-testid={`file-item-${i}`}>
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <file.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-medium text-foreground truncate">{file.name}</h4>
                    <p className="text-[11px] text-muted-foreground truncate">{file.size}</p>
                  </div>
                  <button className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <button className="w-full text-sm font-medium text-muted-foreground hover:text-foreground text-center transition-colors" data-testid="btn-upload-files">
                Upload files →
              </button>
            </div>
          </WorkspaceCard>

        </motion.section>

      </motion.div>
    </div>
  );
}
