import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { clsx } from 'clsx';

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Select...',
  disabled,
}: {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? options.length * 36 + 8;
    const openUpward = rect.bottom + menuHeight > window.innerHeight - 8;
    setPos({
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [open, options.length]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  function toggle(option: string) {
    onChange(selected.includes(option) ? selected.filter((o) => o !== option) : [...selected, option]);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50',
          open ? 'border-primary' : '',
        )}
      >
        <span className={selected.length === 0 ? 'text-subtle' : 'text-ink'}>
          {selected.length === 0 ? placeholder : selected.join(', ')}
        </span>
        <ChevronDown size={15} className="shrink-0 text-subtle" />
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left, width: pos.width }}
            className="fixed z-[999] overflow-hidden rounded-lg border border-border-soft bg-white py-1 shadow-lg"
          >
            {options.map((option) => {
              const checked = selected.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggle(option)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink-soft hover:bg-black/5"
                >
                  <span
                    className={clsx(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border',
                      checked ? 'border-primary bg-primary' : 'border-border',
                    )}
                  >
                    {checked && <Check size={11} className="text-primary-dark" />}
                  </span>
                  {option}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
