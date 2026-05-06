import { ChevronRight, Bell, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import { StatusBadge } from './workspace/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

export interface TopbarProps {
  breadcrumb?: Array<{ label: string; active?: boolean }>;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export function Topbar({ breadcrumb = [], children, actions, onToggleSidebar, isSidebarCollapsed }: TopbarProps) {
  return (
    <div className="h-[52px] bg-white border-b border-border flex items-center justify-between px-3 sm:px-4 shrink-0 gap-2">

      {/* Left: sidebar toggle + breadcrumb */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex p-1.5 text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-md transition-colors shrink-0"
            data-testid="button-topbar-sidebar-toggle"
          >
            {isSidebarCollapsed
              ? <PanelLeftOpen className="w-4 h-4" />
              : <PanelLeftClose className="w-4 h-4" />
            }
          </button>
        )}

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 min-w-0">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center min-w-0">
              <span className={cn(
                'text-sm font-medium truncate',
                item.active ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
              {index < breadcrumb.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 mx-1 text-muted-foreground/50 shrink-0" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Center: slot for page-specific content */}
      {children && (
        <div className="flex-1 flex items-center justify-center px-4 min-w-0">
          {children}
        </div>
      )}

      {/* Right: action buttons + status + notifications + user */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Contextual actions */}
        {actions && (
          <div className="flex items-center border-r border-border pr-2 mr-1">
            {actions}
          </div>
        )}

        <StatusBadge status="active" label="AI Ready" dot className="hidden lg:flex mr-1" />

        <button
          className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-[#f5f5f5] rounded-full transition-colors"
          data-testid="button-notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>

        <button
          className="flex items-center justify-center rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
          data-testid="button-user-menu"
        >
          <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">AC</AvatarFallback>
          </Avatar>
        </button>
      </div>
    </div>
  );
}
