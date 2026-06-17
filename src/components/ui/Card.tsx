import * as React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-3xl border border-zinc-200 bg-white text-zinc-950 shadow-sm transition-all',
        glass && 'bg-white/70 backdrop-blur-xl border-white/20',
        className
      )}
      {...props}
    />
  )
);

Card.displayName = 'Card';

export { Card };
