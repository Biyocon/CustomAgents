import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export interface WorkspaceDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

export function WorkspaceDrawer({ open, onClose, title, children, width = 'md' }: WorkspaceDrawerProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
    }
  };

  const widths = {
    sm: "max-w-[360px]",
    md: "max-w-[480px]",
    lg: "max-w-[640px]"
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
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm" 
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "fixed right-0 top-0 bottom-0 z-50 w-full bg-white shadow-[var(--shadow-2xl)] border-l border-border flex flex-col",
                  widths[width]
                )}
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <DialogPrimitive.Title className="text-lg font-semibold tracking-tight">
                    {title}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none p-1 hover:bg-muted">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
