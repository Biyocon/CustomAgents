import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type WorkspaceCardVariant = 'default' | 'elevated' | 'outlined';
type WorkspaceCardPadding = 'none' | 'sm' | 'md' | 'lg';
type WorkspaceCardRadius = 'md' | 'lg' | 'xl';

export interface WorkspaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: WorkspaceCardVariant;
  padding?: WorkspaceCardPadding;
  radius?: WorkspaceCardRadius;
}

export const WorkspaceCard = forwardRef<HTMLDivElement, WorkspaceCardProps>(
  ({ className, variant = 'default', padding = 'md', radius = 'lg', children, ...props }, ref) => {
    
    const variants = {
      default: "bg-white border border-[#e0e0e0] shadow-[var(--shadow-card)]",
      elevated: "bg-white border border-[#e0e0e0]/60 shadow-[var(--shadow-md)]",
      outlined: "bg-transparent border-2 border-[#e0e0e0]"
    };

    const paddings = {
      none: "p-0",
      sm: "p-4",
      md: "p-6",
      lg: "p-8"
    };

    const radiuses = {
      md: "rounded-[var(--radius-md)]",
      lg: "rounded-[var(--radius-lg)]",
      xl: "rounded-[var(--radius-xl)]"
    };

    return (
      <div
        ref={ref}
        className={cn(variants[variant], paddings[padding], radiuses[radius], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

WorkspaceCard.displayName = 'WorkspaceCard';
