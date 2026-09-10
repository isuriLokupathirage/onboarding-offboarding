import type { LibraryTask, TransitionTemplate } from '../types';

export const COMPANY_COLORS: Record<string, string> = {
  Dialog: '#E11D48',
  Pickme: '#D97706',
  Xeynergy: '#7C3AED',
};

function tasks(
  list: Array<{ name: string; phase: string; assigneeRole: string; dueOffsetDays: number }>,
): TransitionTemplate['tasks'] {
  return list.map((t, i) => ({ id: `task-${i}-${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, ...t }));
}

export const SEED_TRANSITION_TEMPLATES: TransitionTemplate[] = [
  {
    id: 'tt-1',
    name: 'Engineering Onboarding',
    kind: 'Onboarding',
    company: 'Dialog',
    employmentType: 'Full-Time',
    status: 'Active',
    createdAt: '2026-04-02',
    updatedAt: '2026-07-11',
    tasks: tasks([
      { name: 'Office Tour & Badge Handover', phase: 'Day One', assigneeRole: 'HR', dueOffsetDays: 0 },
      { name: 'IT Setup Config', phase: 'Day One', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Create Email Account', phase: 'Day One', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Complete Security Training', phase: 'Week 1 Ramp-up', assigneeRole: 'HR', dueOffsetDays: 3 },
      { name: 'Buddy Introduction', phase: 'Week 1 Ramp-up', assigneeRole: 'Manager', dueOffsetDays: 5 },
      { name: 'Team Lunch', phase: 'Week 1 Ramp-up', assigneeRole: 'Manager', dueOffsetDays: 8 },
    ]),
  },
  {
    id: 'tt-2',
    name: 'Product Intern',
    kind: 'Onboarding',
    company: 'Pickme',
    employmentType: 'Internship',
    status: 'Active',
    createdAt: '2026-05-14',
    updatedAt: '2026-06-02',
    tasks: tasks([
      { name: 'Office Tour & Badge Handover', phase: 'Day One', assigneeRole: 'HR', dueOffsetDays: 0 },
      { name: 'IT Setup Config', phase: 'Day One', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Mentor Introduction', phase: 'Week 1 Ramp-up', assigneeRole: 'Manager', dueOffsetDays: 2 },
      { name: 'Intern Orientation Session', phase: 'Week 1 Ramp-up', assigneeRole: 'HR', dueOffsetDays: 4 },
      { name: 'Set Learning Goals', phase: 'Week 1 Ramp-up', assigneeRole: 'Manager', dueOffsetDays: 7 },
    ]),
  },
  {
    id: 'tt-3',
    name: 'Executive Leadership',
    kind: 'Onboarding',
    company: 'Xeynergy',
    employmentType: 'Full-Time',
    status: 'Active',
    createdAt: '2026-03-20',
    updatedAt: '2026-05-30',
    tasks: tasks([
      { name: 'Board Introduction', phase: 'Day One', assigneeRole: 'CEO Office', dueOffsetDays: 0 },
      { name: 'IT Setup Config', phase: 'Day One', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Strategy Briefing', phase: 'Week 1 Ramp-up', assigneeRole: 'CEO Office', dueOffsetDays: 2 },
      { name: 'Leadership Team Meet & Greet', phase: 'Week 1 Ramp-up', assigneeRole: 'HR', dueOffsetDays: 5 },
      { name: 'Executive Coaching Kickoff', phase: 'Week 1 Ramp-up', assigneeRole: 'HR', dueOffsetDays: 10 },
    ]),
  },
  {
    id: 'tt-4',
    name: 'Engineering Offboarding',
    kind: 'Offboarding',
    company: 'Dialog',
    employmentType: 'Full-Time',
    status: 'Active',
    createdAt: '2026-02-18',
    updatedAt: '2026-07-01',
    tasks: tasks([
      { name: 'Exit Interview', phase: 'Final Week', assigneeRole: 'HR', dueOffsetDays: -5 },
      { name: 'Knowledge Handover', phase: 'Final Week', assigneeRole: 'Manager', dueOffsetDays: -4 },
      { name: 'Revoke System Access', phase: 'Last Day', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Laptop & Asset Return', phase: 'Last Day', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Exit Clearance', phase: 'Last Day', assigneeRole: 'HR', dueOffsetDays: 0 },
    ]),
  },
  {
    id: 'tt-5',
    name: 'Sales Offboarding',
    kind: 'Offboarding',
    company: 'Xeynergy',
    employmentType: 'Full-Time',
    status: 'Active',
    createdAt: '2026-04-09',
    updatedAt: '2026-06-19',
    tasks: tasks([
      { name: 'Exit Interview', phase: 'Final Week', assigneeRole: 'HR', dueOffsetDays: -3 },
      { name: 'Client Account Handover', phase: 'Final Week', assigneeRole: 'Manager', dueOffsetDays: -2 },
      { name: 'Revoke CRM Access', phase: 'Last Day', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Final Settlement', phase: 'Last Day', assigneeRole: 'HR', dueOffsetDays: 1 },
    ]),
  },
  {
    id: 'tt-6',
    name: 'Support Intern Offboarding',
    kind: 'Offboarding',
    company: 'Pickme',
    employmentType: 'Internship',
    status: 'Inactive',
    createdAt: '2025-12-11',
    updatedAt: '2026-01-15',
    tasks: tasks([
      { name: 'Exit Interview', phase: 'Last Day', assigneeRole: 'HR', dueOffsetDays: 0 },
      { name: 'Revoke System Access', phase: 'Last Day', assigneeRole: 'IT', dueOffsetDays: 0 },
      { name: 'Return Equipment', phase: 'Last Day', assigneeRole: 'IT', dueOffsetDays: 0 },
    ]),
  },
];

export const SEED_LIBRARY_TASKS: LibraryTask[] = [
  {
    id: 'lib-1',
    name: 'IT Setup Config',
    phase: 'Day One',
    assigneeRole: 'IT',
    description: 'Provision laptop, accounts, and access for the new hire.',
  },
  {
    id: 'lib-2',
    name: 'Complete Security Training',
    phase: 'Week 1 Ramp-up',
    assigneeRole: 'HR',
    description: 'Mandatory security & compliance training module.',
  },
  {
    id: 'lib-3',
    name: 'Exit Interview',
    phase: 'Final Week',
    assigneeRole: 'HR',
    description: 'Structured conversation to capture exit feedback.',
  },
];
