import { useState } from 'react';
import iqraLogo from '@assets/01-cursor-ing-primary-logo-only_1777416469651.png';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  MessageSquare,
  Folder,
  Sparkles,
  Package,
  Palette,
  Zap,
  Bot,
  LayoutGrid,
  Compass,
  SlidersHorizontal,
  Mic,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ActiveView } from '../App';

interface SidebarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
}

interface NavItem {
  view?: ActiveView;
  icon: React.ElementType;
  label: string;
  badge?: string;
  onClick?: () => void;
  isStitch?: boolean;
}

export function Sidebar({ activeView, setActiveView, isCollapsed, onToggleCollapsed }: SidebarProps) {
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [toolsCollapsed, setToolsCollapsed] = useState(false);

  const navItems: NavItem[] = [
    { view: 'home',           icon: Home,          label: 'Home' },
    { view: 'chat',           icon: MessageSquare, label: 'Chats', badge: '12' },
    { view: 'projects',       icon: Folder,        label: 'Projects', badge: '4' },
    { view: 'apps',           icon: LayoutGrid,    label: 'Apps' },
    { view: 'explore',        icon: Compass,       label: 'Explore' },
    { view: 'workflows',      icon: Zap,           label: 'Workflows' },
    { view: 'agents',         icon: Bot,           label: 'Agents' },
    { view: 'design-systems', icon: Palette,       label: 'Design Systems' },
    { icon: Package,  label: 'Artifacts', view: 'artifacts' as const },
  ];

  const isActive = (item: NavItem) => item.view !== undefined && activeView === item.view;

  return (
    <div
      className={cn(
        'h-full bg-sidebar border-r border-border flex flex-col shrink-0 transition-all duration-300 ease-in-out relative z-10 overflow-hidden',
        isCollapsed ? 'w-[60px]' : 'w-[256px]'
      )}
    >
      {/* ── Top ─────────────────────────────────────── */}
      <div className={cn('flex flex-col gap-3 pt-4 pb-2 transition-all duration-300', isCollapsed ? 'px-2' : 'px-4')}>

        {/* Logo row */}
        <div className="hidden md:flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 px-1 overflow-hidden">
              <img src={iqraLogo} alt="IQRA logo" className="w-7 h-7 object-contain shrink-0" />
              <span className="font-bold text-lg tracking-tight text-foreground whitespace-nowrap">IQRA</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-full flex items-center justify-center">
              <img src={iqraLogo} alt="IQRA logo" className="w-7 h-7 object-contain" />
            </div>
          )}
        </div>

        {/* New Chat button */}
        {!isCollapsed ? (
          <button
            onClick={() => setActiveView('chat')}
            className="w-full bg-primary hover:bg-[#003a3d] text-primary-foreground flex items-center justify-center gap-2 py-2 px-4 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-200 hover:-translate-y-[1px] shadow-sm"
            data-testid="button-new-chat"
          >
            New Chat
          </button>
        ) : (
          <button
            onClick={() => setActiveView('chat')}
            title="New Chat"
            className="w-full flex items-center justify-center p-2 rounded-[var(--radius-md)] bg-primary text-primary-foreground hover:bg-[#003a3d] transition-colors"
            data-testid="button-new-chat-rail"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Nav ─────────────────────────────────────── */}
      <div className={cn('flex-1 overflow-y-auto overflow-x-hidden py-2 space-y-4 transition-all duration-300', isCollapsed ? 'px-2' : 'px-3')}>

        {/* RAIL MODE: icon-only nav */}
        {isCollapsed && (
          <div className="space-y-1">
            {navItems.map((item, i) => {
              const active = isActive(item);
              return (
                <button
                  key={i}
                  title={item.label}
                  onClick={() => item.view ? setActiveView(item.view) : undefined}
                  className={cn(
                    'relative w-full flex items-center justify-center p-2.5 rounded-xl transition-colors duration-150',
                    active
                      ? 'bg-[#f0f0f0] text-primary'
                      : 'text-muted-foreground hover:bg-[#f5f5f5] hover:text-foreground'
                  )}
                  data-testid={`nav-rail-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                  )}
                  <item.icon className="w-4 h-4" />
                </button>
              );
            })}

            {/* Stitch in rail */}
            <button
              title="Show Stitch"
              onClick={() => setActiveView('stitch')}
              className={cn(
                'relative w-full flex items-center justify-center p-2.5 rounded-xl transition-colors duration-150',
                activeView === 'stitch'
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
              )}
              data-testid="nav-rail-stitch"
            >
              <span className="text-base">✨</span>
            </button>
          </div>
        )}

        {/* FULL MODE: labelled nav */}
        {!isCollapsed && (
          <>
            {/* NAVIGATION section */}
            <div>
              <button
                onClick={() => setNavCollapsed(!navCollapsed)}
                className="w-full flex items-center justify-between px-3 mb-1 text-xs font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors uppercase tracking-wider"
              >
                <span>Navigation</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', navCollapsed ? '-rotate-90' : '')} />
              </button>

              <AnimatePresence initial={false}>
                {!navCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    {navItems.map((item, i) => {
                      const active = isActive(item);
                      return (
                        <button
                          key={i}
                          onClick={() => item.view ? setActiveView(item.view) : undefined}
                          className={cn(
                            'relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors duration-150 group overflow-hidden',
                            active
                              ? 'bg-[#f0f0f0] text-foreground font-medium'
                              : 'text-muted-foreground hover:bg-[#f5f5f5] hover:text-foreground font-normal'
                          )}
                          data-testid={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <span className={cn(
                            'absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-primary transition-all duration-200',
                            active ? 'h-6' : 'h-0 group-hover:h-4 opacity-50'
                          )} />
                          <div className="flex items-center gap-3">
                            <item.icon className={cn('w-4 h-4 transition-colors', active ? 'text-primary' : 'group-hover:text-primary/70')} />
                            <span>{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className="text-xs text-muted-foreground font-medium bg-background px-1.5 rounded-md group-hover:bg-white border border-border/50">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* TOOLS section */}
            <div>
              <button
                onClick={() => setToolsCollapsed(!toolsCollapsed)}
                className="w-full flex items-center justify-between px-3 mb-1 text-xs font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors uppercase tracking-wider"
              >
                <span>Tools</span>
                <ChevronDown className={cn('w-3 h-3 transition-transform duration-200', toolsCollapsed ? '-rotate-90' : '')} />
              </button>

              <AnimatePresence initial={false}>
                {!toolsCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-0.5 overflow-hidden"
                  >
                    <button
                      onClick={() => setActiveView('stitch')}
                      className={cn(
                        'relative w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-200 group overflow-hidden border',
                        activeView === 'stitch'
                          ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-medium border-primary/20'
                          : 'text-muted-foreground hover:bg-primary/5 hover:text-primary font-normal border-transparent'
                      )}
                      data-testid="nav-stitch"
                    >
                      {activeView === 'stitch' && (
                        <motion.div
                          layoutId="stitch-active-bg"
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl z-0"
                        />
                      )}
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="relative">
                          <span className="text-base group-hover:scale-110 transition-transform block">✨</span>
                          {activeView === 'stitch' && (
                            <motion.span
                              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -top-1 -right-1 w-1 h-1 bg-secondary rounded-full"
                            />
                          )}
                        </div>
                        <span>Show Stitch</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* ── Bottom ──────────────────────────────────── */}
      <div className={cn('border-t border-border flex flex-col gap-1 transition-all duration-300', isCollapsed ? 'p-2' : 'p-3')}>
        {isCollapsed ? (
          /* Rail: settings icon + avatar */
          <>
            <button
              title="Settings"
              onClick={() => setActiveView('settings')}
              className={cn('w-full flex items-center justify-center p-2 rounded-lg transition-colors', activeView === 'settings' ? 'bg-[#f0f0f0] text-primary' : 'text-muted-foreground hover:bg-[#f5f5f5] hover:text-foreground')}
              data-testid="button-settings-rail"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button
              title="Alex Chen — Pro Plan"
              className="w-full flex items-center justify-center p-1.5 rounded-lg hover:bg-[#f5f5f5] transition-colors"
              data-testid="button-user-profile-rail"
            >
              <Avatar className="w-7 h-7 rounded-full border border-border">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">AC</AvatarFallback>
              </Avatar>
            </button>
          </>
        ) : (
          <>
            <button
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors duration-100 group"
              data-testid="button-voice-persona"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center shrink-0">
                  <span className="text-secondary-foreground text-xs font-bold">A</span>
                </div>
                <span className="text-sm font-medium text-foreground">Ara - Assistant</span>
              </div>
              <Mic className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </button>

            <button
              onClick={() => setActiveView('settings')}
              className={cn('flex items-center gap-3 w-full px-3 py-2 rounded-lg transition-colors duration-100 group', activeView === 'settings' ? 'bg-[#f0f0f0] text-foreground' : 'text-muted-foreground hover:bg-[#f5f5f5] hover:text-foreground')}
              data-testid="button-settings"
            >
              <SlidersHorizontal className={cn('w-4 h-4 shrink-0 transition-colors', activeView === 'settings' ? 'text-primary' : 'group-hover:text-primary/70')} />
              <span className="text-sm font-medium">Settings</span>
            </button>

            <button
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-[#f5f5f5] transition-colors duration-100 cursor-pointer group"
              data-testid="button-user-profile"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="w-8 h-8 rounded-full border border-border shrink-0">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">AC</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-sm font-semibold text-foreground leading-none truncate">Alex Chen</span>
                  <span className="text-xs text-muted-foreground mt-1 leading-none">Pro Plan</span>
                </div>
              </div>
            </button>
          </>
        )}
      </div>

      {/* ── Collapse toggle (desktop only, positioned at border) ── */}
      <button
        onClick={onToggleCollapsed}
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="hidden md:flex absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-white border border-border shadow-sm items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-20"
        data-testid="button-sidebar-toggle"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>
    </div>
  );
}
