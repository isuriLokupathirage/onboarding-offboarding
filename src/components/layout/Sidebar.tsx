import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  LayoutGrid,
  ListChecks,
  ArrowLeftRight,
  FileText,
  Bell,
  Users,
  ChevronDown,
} from 'lucide-react';
import { usePermission } from '../../store/PermissionContext';

const navItems = [
  { to: '/dashboard/overview', label: 'Overview', icon: LayoutGrid },
  { to: '/dashboard/tasks', label: 'My Tasks', icon: ListChecks },
  { to: '/dashboard/transitions', label: 'Transitions', icon: ArrowLeftRight },
  { to: '/templates/forms', label: 'Templates', icon: FileText },
];

export function Sidebar() {
  const { permission, setPermission } = usePermission();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-text">
      <div className="flex items-center gap-2 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
          A
        </div>
        <span className="text-[15px] font-semibold text-white">Accxis 360</span>
      </div>

      <div className="px-5 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-wide text-sidebar-text/60">
        Onboarding Workspace
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-white'
                  : 'text-sidebar-text hover:bg-sidebar-soft hover:text-white',
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-white/10 px-3 py-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-text hover:bg-sidebar-soft hover:text-white">
          <Bell size={17} />
          Notifications
          <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[11px] font-semibold text-white">
            1
          </span>
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-text hover:bg-sidebar-soft hover:text-white">
          <Users size={17} />
          Employees
        </button>
      </div>

      <div className="border-t border-white/10 p-3">
        <div className="flex items-center gap-2 rounded-lg bg-sidebar-soft px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
            JC
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">Janette C</p>
            <p className="truncate text-xs text-sidebar-text/70">HR Manager</p>
          </div>
          <ChevronDown size={15} />
        </div>
        <label className="mt-3 flex items-center justify-between gap-2 px-1 text-xs text-sidebar-text/70">
          <span>Permission (demo)</span>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value as typeof permission)}
            className="rounded-md border border-white/10 bg-sidebar-soft px-1.5 py-1 text-[11px] text-white outline-none"
          >
            <option value="manager">obo.template.manage</option>
            <option value="readonly">Read-only</option>
          </select>
        </label>
      </div>
    </aside>
  );
}
