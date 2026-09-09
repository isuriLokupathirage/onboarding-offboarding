import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type Tone = 'gray' | 'green' | 'red' | 'amber' | 'blue' | 'primary';

const tones: Record<Tone, string> = {
  gray: 'bg-black/5 text-ink-soft',
  green: 'bg-success-bg text-success',
  red: 'bg-danger-bg text-danger',
  amber: 'bg-warning-bg text-warning',
  blue: 'bg-info-bg text-info',
  primary: 'bg-primary-light text-primary-dark',
};

export function Badge({
  tone = 'gray',
  children,
  className,
  dot,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {dot && <span className={clsx('h-1.5 w-1.5 rounded-full', {
        'bg-success': tone === 'green',
        'bg-danger': tone === 'red',
        'bg-warning': tone === 'amber',
        'bg-info': tone === 'blue',
        'bg-ink-soft': tone === 'gray',
        'bg-primary': tone === 'primary',
      })} />}
      {children}
    </span>
  );
}
