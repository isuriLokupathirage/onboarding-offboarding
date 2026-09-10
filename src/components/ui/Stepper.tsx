import { Check } from 'lucide-react';
import { clsx } from 'clsx';

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: string[];
  current: number;
  onStepClick?: (step: number) => void;
}) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        const clickable = !!onStepClick && (done || active);
        return (
          <div key={label} className="flex items-center">
            <button
              type="button"
              disabled={!clickable}
              onClick={() => onStepClick?.(step)}
              className={clsx(
                'flex items-center gap-2 rounded-full py-1',
                clickable ? 'cursor-pointer' : 'cursor-default',
              )}
            >
              <span
                className={clsx(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  active
                    ? 'bg-primary text-primary-dark'
                    : done
                      ? 'bg-primary-light text-primary-dark'
                      : 'border border-border text-subtle',
                )}
              >
                {done ? <Check size={13} /> : step}
              </span>
              <span
                className={clsx(
                  'text-sm font-medium',
                  active ? 'text-ink' : done ? 'text-ink-soft' : 'text-subtle',
                )}
              >
                {label}
              </span>
            </button>
            {step < steps.length && <div className="mx-3 h-px w-8 shrink-0 bg-border" />}
          </div>
        );
      })}
    </div>
  );
}
