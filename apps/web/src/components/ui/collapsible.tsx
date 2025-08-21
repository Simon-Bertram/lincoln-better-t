'use client';

import { ChevronDown } from 'lucide-react';
import {
  cloneElement,
  createContext,
  type ReactElement,
  type ReactNode,
  useContext,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type CollapsibleProps = {
  children: ReactNode;
  className?: string;
};

type CollapsibleTriggerProps = {
  children: ReactNode;
  className?: string;
  asChild?: boolean;
};

type CollapsibleContentProps = {
  children: ReactNode;
  className?: string;
};

const CollapsibleContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export function Collapsible({ children, className }: CollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <CollapsibleContext.Provider value={{ open, setOpen }}>
      <div className={cn('w-full', className)}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

export function CollapsibleTrigger({
  children,
  className,
  asChild = false,
}: CollapsibleTriggerProps) {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('CollapsibleTrigger must be used within a Collapsible');
  }

  const { open, setOpen } = context;

  if (asChild) {
    return cloneElement(
      children as ReactElement,
      {
        onClick: () => setOpen(!open),
      } as any
    );
  }

  return (
    <Button
      className={cn('h-8 w-8 p-0', className)}
      onClick={() => setOpen(!open)}
      size="sm"
      variant="ghost"
    >
      <ChevronDown
        aria-hidden="true"
        className={cn(
          'h-4 w-4 transition-transform duration-200',
          open && 'rotate-180'
        )}
        focusable="false"
      />
      <span className="sr-only">Toggle details</span>
    </Button>
  );
}

export function CollapsibleContent({
  children,
  className,
}: CollapsibleContentProps) {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('CollapsibleContent must be used within a Collapsible');
  }

  const { open } = context;

  return (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        className
      )}
    >
      {children}
    </div>
  );
}
