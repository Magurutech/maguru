import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'btn-primary',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-md',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md',
        secondary: 'btn-secondary',
        ghost: 'btn-artisan-ghost',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-3',
        sm: 'h-9 px-4 py-2 text-xs rounded-md',
        lg: 'h-12 px-8 py-4 text-base rounded-md',
        icon: 'size-11 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  if (asChild) {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  if ((variant === 'default' || variant === 'secondary') && size !== 'icon') {
    const isSecondary = variant === 'secondary';
    return (
      <div className={cn("btn-wrapper", isSecondary ? "btn-wrapper-secondary" : "btn-wrapper-primary", className)}>
        <div className="line horizontal top"></div>
        <div className="line vertical right"></div>
        <div className="line horizontal bottom"></div>
        <div className="line vertical left"></div>

        <div className="dot top left"></div>
        <div className="dot top right"></div>
        <div className="dot bottom right"></div>
        <div className="dot bottom left"></div>

        <button
          className={cn("btn", isSecondary ? "btn-secondary" : "btn-primary")}
          {...props}
        >
          <span className="btn-text">{children}</span>
        </button>
      </div>
    );
  }

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
