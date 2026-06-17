import * as React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm active:scale-95',
      secondary: 'bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm active:scale-95',
      outline: 'bg-transparent text-zinc-600 border border-zinc-200 hover:bg-zinc-50 active:scale-95',
      ghost: 'bg-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 active:scale-95',
      danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 active:scale-95',
      glass: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 active:scale-95',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-xs h-8',
      md: 'px-4 py-2 text-sm h-10',
      lg: 'px-6 py-3 text-base h-12',
      icon: 'w-10 h-10 p-0 flex items-center justify-center',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
