import { useLocation } from 'react-router-dom';

const BREADCRUMBS: { test: (path: string) => boolean; label: string }[] = [
  { test: (p) => p.startsWith('/dashboard/overview'), label: 'Overview' },
  { test: (p) => p.startsWith('/dashboard/tasks'), label: 'My Tasks' },
  { test: (p) => p.startsWith('/dashboard/transitions'), label: 'Transitions' },
  { test: (p) => p === '/templates', label: 'Templates' },
  { test: (p) => p === '/templates/tasks', label: 'Templates / Tasks' },
  { test: (p) => p.startsWith('/templates/'), label: 'Templates / Template Details' },
  { test: (p) => p === '/form-templates', label: 'Form Templates' },
  { test: (p) => p.startsWith('/form-templates/'), label: 'Form Templates / Form Details' },
];

export function TopBar() {
  const { pathname } = useLocation();
  const crumb = BREADCRUMBS.find((b) => b.test(pathname))?.label ?? '';

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-white px-6 text-sm">
      <span className="text-ink-soft">Onboarding &amp; Offboarding</span>
      {crumb && (
        <>
          <span className="text-subtle">/</span>
          <span className="font-medium text-ink">{crumb}</span>
        </>
      )}
    </div>
  );
}
