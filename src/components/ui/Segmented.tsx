import { clsx } from 'clsx';

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  disabled,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  disabled?: boolean;
}) {
  return (
    <div
      className={clsx(
        'inline-flex rounded-md border border-border bg-black/[0.03] p-0.5',
        disabled && 'opacity-60',
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'rounded px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed',
            value === opt.value ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
