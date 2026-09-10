import { ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md border border-border p-1.5 text-ink-soft hover:bg-black/5 disabled:opacity-40"
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'h-7 w-7 rounded-md text-xs font-medium',
            p === page ? 'bg-primary text-primary-dark' : 'text-ink-soft hover:bg-black/5',
          )}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-md border border-border p-1.5 text-ink-soft hover:bg-black/5 disabled:opacity-40"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
