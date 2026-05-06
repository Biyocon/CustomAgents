import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export interface WorkspaceDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function WorkspaceDialog({ 
  open, 
  onClose, 
  title, 
  description, 
  children, 
  footer, 
  size = 'md' 
}: WorkspaceDialogProps) {
  
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  const maxWidths = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl"
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" 
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
                animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, scale: 0.96, x: "-50%", y: "-50%" }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 grid w-full gap-4 bg-white p-6 shadow-[var(--shadow-modal)] rounded-[var(--radius-xl)]",
                  maxWidths[size]
                )}
              >
                <div className="flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                      {title}
                    </DialogPrimitive.Title>
                    <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                  </div>
                  {description && (
                    <DialogPrimitive.Description className="text-sm text-muted-foreground">
                      {description}
                    </DialogPrimitive.Description>
                  )}
                </div>
                
                <div className="py-2">
                  {children}
                </div>

                {footer && (
                  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 pt-2 border-t border-border">
                    {footer}
                  </div>
                )}
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
