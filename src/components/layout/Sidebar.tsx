import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutGrid,
  ListChecks,
  ArrowLeftRight,
  LayoutTemplate,
  FileEdit,
  Bell,
  Users,
  UserCog,
  ChevronDown,
  ChevronRight,
  Search,
} from 'lucide-react';
import { usePermission } from '../../store/PermissionContext';

const subNavItems = [
  { to: '/dashboard/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/dashboard/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/dashboard/transitions', label: 'Transitions', icon: ArrowLeftRight },
  { to: '/templates', label: 'Templates', icon: LayoutTemplate },
  { to: '/form-templates', label: 'Form Templates', icon: FileEdit },
];

export function Sidebar() {
  const { permission, setPermission } = usePermission();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState(true);
  const [query, setQuery] = useState('');

  const moduleActive = subNavItems.some((item) => pathname.startsWith(item.to));
  const visibleItems = subNavItems.filter((item) =>
    item.label.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const open = expanded || query.trim().length > 0;

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-text">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-dark">
          A
        </div>
        <span className="text-[15px] font-semibold text-ink">Accxis 360</span>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="px-2 pb-2 text-xs text-subtle">Modules</div>

        <div className="relative mb-3 px-0">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-lg border border-sidebar-border bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none placeholder:text-subtle focus:border-primary"
          />
        </div>

        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-text hover:bg-sidebar-soft hover:text-ink">
          <Bell size={17} />
          Notifications
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[11px] font-semibold text-white">
            1
          </span>
        </button>
        <button className="mb-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-text hover:bg-sidebar-soft hover:text-ink">
          <Users size={17} />
          Employees
        </button>

        <button
          onClick={() => setExpanded((v) => !v)}
          title="Onboarding & Offboarding"
          className={clsx(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
            moduleActive ? 'bg-sidebar-active text-primary-text' : 'text-sidebar-text hover:bg-sidebar-soft hover:text-ink',
          )}
        >
          <UserCog size={17} className="shrink-0" />
          <span className="flex-1 truncate text-left">Onboarding &amp; Offboarding</span>
          {open ? <ChevronDown size={15} className="shrink-0" /> : <ChevronRight size={15} className="shrink-0" />}
        </button>

        {open && (
          <div className="mt-0.5 space-y-0.5 pl-4">
            {visibleItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-sidebar-active font-semibold text-ink'
                      : 'font-medium text-sidebar-text hover:bg-sidebar-soft hover:text-ink',
                  )
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
            {visibleItems.length === 0 && (
              <p className="px-3 py-2 text-xs text-subtle">No matches.</p>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-sidebar-border px-3 py-3">
        <button className="flex w-full items-center gap-2 rounded-lg px-2 py-2 hover:bg-sidebar-soft">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-dark">
            JC
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-medium text-ink">Janette C</p>
            <p className="truncate text-xs text-subtle">HR Manager</p>
          </div>
          <ChevronDown size={15} className="shrink-0 text-subtle" />
        </button>
        <label className="mt-2 flex items-center justify-between gap-2 px-2 text-[11px] text-subtle">
          <span>Permission (demo)</span>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value as typeof permission)}
            className="rounded-md border border-sidebar-border bg-white px-1.5 py-1 text-[11px] text-ink-soft outline-none"
          >
            <option value="manager">obo.template.manage</option>
            <option value="readonly">Read-only</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
