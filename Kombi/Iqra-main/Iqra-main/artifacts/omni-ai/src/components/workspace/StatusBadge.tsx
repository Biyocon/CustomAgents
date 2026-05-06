import { cn } from '@/lib/utils';

type BadgeStatus = 'active' | 'idle' | 'processing' | 'error' | 'success' | 'warning' | 'info';
type BadgeSize = 'sm' | 'md';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: BadgeStatus;
  label?: string;
  size?: BadgeSize;
  dot?: boolean;
}

export function StatusBadge({ status, label, size = 'sm', dot = false, className, ...props }: StatusBadgeProps) {
  
  const variants = {
    active: "bg-teal-50 text-teal-700 border-teal-200",
    idle: "bg-gray-100 text-gray-600 border-gray-200",
    processing: "bg-blue-50 text-blue-600 border-blue-200",
    error: "bg-red-50 text-red-600 border-red-200",
    success: "bg-green-50 text-green-700 border-green-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    info: "bg-blue-50 text-blue-700 border-blue-200"
  };

  const dotColors = {
    active: "bg-teal-500",
    idle: "bg-gray-400",
    processing: "bg-blue-500 animate-pulse",
    error: "bg-red-500",
    success: "bg-green-500",
    warning: "bg-amber-500",
    info: "bg-blue-500"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm"
  };

  return (
    <div 
      className={cn(
        "inline-flex items-center justify-center font-medium border rounded-full",
        variants[status],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn("rounded-full mr-1.5", size === 'sm' ? "w-1.5 h-1.5" : "w-2 h-2", dotColors[status])} />
      )}
      {label}
    </div>
  );
}
