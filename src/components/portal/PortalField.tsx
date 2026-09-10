import { clsx } from 'clsx';
import type { FieldDef, FieldState } from '../../types';

export function PortalField({
  field,
  state,
  span2,
  value,
  onChange,
  otherValue,
  onOtherChange,
  error,
}: {
  field: FieldDef;
  state: FieldState;
  span2?: boolean;
  value: string;
  onChange: (v: string) => void;
  otherValue?: string;
  onOtherChange?: (v: string) => void;
  error?: boolean;
}) {
  if (state === 'hidden') return null;

  const isOther = field.hasOtherOption && value === 'Other';

  const inputClass = clsx(
    'w-full rounded-lg border bg-black/[0.02] px-3 py-2 text-sm text-ink placeholder:text-subtle outline-none focus:bg-white',
    error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary',
  );

  return (
    <div className={span2 ? 'sm:col-span-2' : ''}>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {field.label}
        {state === 'required' && <span className="ml-0.5 text-danger">*</span>}
      </label>

      {field.kind === 'select' ? (
        <>
          <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            <option value="" disabled>
              Select {field.label.split('(')[0].trim()}
            </option>
            {field.fixedOptions?.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          {isOther && (
            <input
              value={otherValue ?? ''}
              onChange={(e) => onOtherChange?.(e.target.value)}
              placeholder="Please specify"
              className={`${inputClass} mt-2`}
            />
          )}
        </>
      ) : field.kind === 'textarea' ? (
        <textarea
          rows={2}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label}`}
          className={inputClass}
        />
      ) : field.kind === 'date' ? (
        <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter ${field.label}`}
          className={inputClass}
        />
      )}

      {error && <p className="mt-1 text-xs text-danger">This field is required.</p>}
    </div>
  );
}
