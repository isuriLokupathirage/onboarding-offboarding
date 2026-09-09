import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'dark';
type Size = 'sm' | 'md';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark shadow-sm',
  outline: 'bg-white text-primary border border-primary/40 hover:bg-primary-light',
  ghost: 'bg-transparent text-ink-soft hover:bg-black/5',
  danger: 'bg-white text-danger border border-danger/40 hover:bg-danger-bg',
  dark: 'bg-ink text-white hover:bg-black',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
};

export function Button({ variant = 'primary', size = 'md', icon, className, children, disabled, ...rest }: Props) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
