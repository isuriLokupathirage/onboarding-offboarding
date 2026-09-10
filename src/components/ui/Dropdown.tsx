import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export interface DropdownItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  disabledReason?: string;
  danger?: boolean;
}

export function Dropdown({ trigger, items }: { trigger: ReactNode; items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight ?? items.length * 36 + 8;
    const openUpward = rect.bottom + menuHeight > window.innerHeight - 8;
    setPos({
      top: openUpward ? rect.top - menuHeight - 4 : rect.bottom + 4,
      left: Math.min(rect.right - 192, window.innerWidth - 200),
    });
  }, [open, items.length]);

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

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen((o) => !o)}
        className="rounded-md p-1.5 hover:bg-black/5"
      >
        {trigger}
      </button>
      {open &&
        pos &&
        createPortal(
          <div
            ref={menuRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[999] w-48 overflow-hidden rounded-lg border border-border-soft bg-white py-1 shadow-lg"
          >
            {items.map((item) => (
              <button
                key={item.label}
                disabled={item.disabled}
                title={item.disabled ? item.disabledReason : undefined}
                onClick={() => {
                  if (item.disabled) return;
                  setOpen(false);
                  item.onClick();
                }}
                className={clsx(
                  'block w-full px-3 py-2 text-left text-sm hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent',
                  item.danger ? 'text-danger' : 'text-ink-soft',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </>
  );
}
