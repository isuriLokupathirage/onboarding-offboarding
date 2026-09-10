import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number; flip: boolean } | null>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const flip = rect.top < 44; // not enough room above — show below instead
    setPos({
      top: flip ? rect.bottom + 8 : rect.top - 8,
      left: rect.left + rect.width / 2,
      flip,
    });
  }, [open]);

  return (
    <span
      ref={triggerRef}
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {open &&
        pos &&
        createPortal(
          <span
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
            className={`pointer-events-none fixed z-[999] w-max max-w-64 -translate-x-1/2 rounded-md bg-ink px-2.5 py-1.5 text-center text-xs text-white shadow-lg ${
              pos.flip ? '' : '-translate-y-full'
            }`}
          >
            {label}
            <span
              className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
                pos.flip ? 'bottom-full border-b-ink' : 'top-full border-t-ink'
              }`}
            />
          </span>,
          document.body,
        )}
    </span>
  );
}
