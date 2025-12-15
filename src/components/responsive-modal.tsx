'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
} from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
}

export function ResponsiveModal({ children, isOpen, onOpenChange, className }: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className={className}>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        {children}
      </DialogContent>
    </Dialog>
  );
}
