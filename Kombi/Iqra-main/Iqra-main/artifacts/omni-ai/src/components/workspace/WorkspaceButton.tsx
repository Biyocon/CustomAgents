import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type WorkspaceButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type WorkspaceButtonSize = 'sm' | 'md' | 'lg';

export interface WorkspaceButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: WorkspaceButtonVariant;
  size?: WorkspaceButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const WorkspaceButton = forwardRef<HTMLButtonElement, WorkspaceButtonProps>(
  (
    { 
      className, 
      variant = 'primary', 
      size = 'md', 
      icon, 
      iconPosition = 'left', 
      loading = false, 
      children, 
      disabled, 
      ...props 
    }, 
    ref
  ) => {
    
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-[#004E51] text-white hover:bg-[#003a3d] hover:-translate-y-[1px] shadow-sm rounded-[var(--radius-md)]",
      secondary: "bg-[#f5f5f5] text-foreground border border-[#e0e0e0] hover:bg-white shadow-sm rounded-[var(--radius-md)]",
      ghost: "bg-transparent text-foreground hover:bg-[#f5f5f5] rounded-[var(--radius-md)]",
      danger: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-[var(--radius-md)]"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm gap-1.5",
      md: "px-4 py-2 text-sm gap-2",
      lg: "px-5 py-2.5 text-base gap-2.5"
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

WorkspaceButton.displayName = 'WorkspaceButton';
