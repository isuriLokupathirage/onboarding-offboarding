import { RefreshCw, ChevronLeft, ChevronRight, MoreVertical, Search, SlidersHorizontal } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const transitions = [
  { name: 'Sarah Jenkins', role: 'UI/UX Designer', kind: 'Onboarding', task: 'IT Setup Config', date: 'Oct 24', progress: 65 },
  { name: 'Mike Ross', role: 'Sales', kind: 'Offboarding', task: 'Exit Interview', date: 'Oct 21', progress: 40 },
  { name: 'Elena', role: 'HR/Intern', kind: 'Onboarding', task: 'Complete Security Training', date: 'Oct 20', progress: 20 },
];

const needsAttention = [
  { name: 'Mike Ross', issue: 'Laptop Stock Unavailable', when: '5 days ago', tone: 'amber' as const, label: 'Blocked' },
  { name: 'Sarah Jenkins', issue: 'Exit clearance pending', when: '3 days ago', tone: 'red' as const, label: 'Overdue' },
];

const upcoming = [
  { name: 'Amali Perera', initials: 'AP', kind: 'Onboarding', when: 'In 3 days', ready: 60 },
  { name: 'Chamari', initials: 'CN', kind: 'Offboarding', when: 'In 12 days', ready: 25 },
];

const taskGroups = [
  {
    title: 'Day One',
    tasks: [
      { task: 'Office Tour & Badge Handover', employee: 'Mike Ross', due: '2 days ago', overdue: true, priority: 'MEDIUM', status: 'Open' },
    ],
  },
  {
    title: 'Week 1 Ramp-up',
    tasks: [
      { task: 'Complete Security Training', employee: 'Elena', due: '3 days', priority: 'LOW', status: 'Blocked', blockedBy: 'Create Email Account' },
      { task: 'Buddy Introduction', employee: 'Mike Ross', due: '5 days', priority: 'LOW', status: 'In Progress' },
      { task: 'Team Lunch', employee: 'Mike Ross', due: '8 days', priority: 'LOW', status: 'In Progress' },
    ],
  },
];

const priorityTone: Record<string, 'green' | 'amber' | 'red'> = {
  LOW: 'green',
  MEDIUM: 'amber',
  HIGH: 'red',
};

export function Overview() {
  return (
    <div className="mx-auto max-w-[1400px] px-8 py-7">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Overview</h1>
        <div className="flex items-center gap-2">
          <Badge tone="red" dot>3 Overdue</Badge>
          <Badge tone="amber" dot>3 Blocked</Badge>
          <Badge tone="blue" dot>8 Due Today</Badge>
          <button className="rounded-lg border border-border p-2 text-ink-soft hover:bg-black/5">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">Active Transitions (5)</h2>
          <div className="flex items-center gap-1 text-subtle">
            <button className="rounded-md border border-border p-1 hover:bg-black/5"><ChevronLeft size={14} /></button>
            <button className="rounded-md border border-border p-1 hover:bg-black/5"><ChevronRight size={14} /></button>
            <button className="ml-2 text-xs font-medium text-primary hover:underline">View All</button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {transitions.map((t) => (
            <div key={t.name} className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                  {t.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{t.name}</p>
                  <Badge tone="gray" className="mt-0.5">{t.role}</Badge>
                </div>
                <Badge tone={t.kind === 'Onboarding' ? 'green' : 'red'} dot>{t.kind}</Badge>
              </div>
              <p className="text-xs text-muted">Next Task</p>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{t.task}</p>
                <p className="text-xs text-subtle">{t.date}</p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-primary" style={{ width: `${t.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-ink">
            <span className="text-warning">⚠</span> Needs Attention
          </h2>
          <div className="space-y-3">
            {needsAttention.map((n) => (
              <div key={n.issue} className="flex items-center justify-between rounded-xl border border-border-soft px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${n.tone === 'red' ? 'bg-danger' : 'bg-warning'}`} />
                  <div>
                    <p className="text-sm font-medium text-ink">{n.name}</p>
                    <p className="text-xs text-muted">{n.issue}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-subtle">{n.when}</p>
                    <p className={`text-xs font-semibold ${n.tone === 'red' ? 'text-danger' : 'text-warning'}`}>{n.label}</p>
                  </div>
                  <Button size="sm" variant="outline">Resolve</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-ink">Upcoming Transitions</h2>
          <div className="space-y-3">
            {upcoming.map((u) => (
              <div key={u.name} className="flex items-center justify-between rounded-xl border border-border-soft px-3 py-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary-dark">
                    {u.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{u.name}</p>
                    <Badge tone={u.kind === 'Onboarding' ? 'green' : 'red'} dot>{u.kind}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-subtle">{u.when}</p>
                  <p className="text-xs font-medium text-ink">{u.ready}% Ready</p>
                </div>
                <button className="text-xs font-medium text-primary hover:underline">View Tasks</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-border bg-white p-4 shadow-sm">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-ink">My Tasks (8)</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs text-subtle">
              <Search size={13} /> Search by task or employee
            </div>
            <Button size="sm" variant="outline" icon={<SlidersHorizontal size={13} />}>Filters</Button>
            <Button size="sm" variant="ghost">Reset Filters</Button>
            <Button size="sm" variant="dark">All Tasks</Button>
          </div>
        </div>

        <div className="space-y-4">
          {taskGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-subtle">{group.title}</p>
              <div className="overflow-hidden rounded-xl border border-border-soft">
                {group.tasks.map((t, i) => (
                  <div
                    key={t.task}
                    className={`flex items-center justify-between px-3 py-2.5 ${i > 0 ? 'border-t border-border-soft' : ''}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{t.task}</p>
                      {t.blockedBy && <p className="text-xs text-subtle">Depends on: {t.blockedBy}</p>}
                    </div>
                    <p className="w-32 text-sm text-ink-soft">{t.employee}</p>
                    <p className={`w-24 text-xs ${'overdue' in t && t.overdue ? 'text-danger' : 'text-subtle'}`}>{t.due}</p>
                    <Badge tone={priorityTone[t.priority]} className="w-20 justify-center">{t.priority}</Badge>
                    <span className="w-28 rounded-md border border-border px-2 py-1 text-center text-xs font-medium text-ink-soft">
                      {t.status}
                    </span>
                    <button className="p-1 text-subtle hover:text-ink">
                      <MoreVertical size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
