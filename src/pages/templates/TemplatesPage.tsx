import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MoreVertical, Plus, Search, LayoutTemplate as TemplateIcon, ListChecks } from 'lucide-react';
import { useTransitionTemplates } from '../../store/TransitionTemplatesContext';
import { usePermission } from '../../store/PermissionContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dropdown } from '../../components/ui/Dropdown';
import { Dialog } from '../../components/ui/Dialog';
import { COMPANY_COLORS } from '../../data/transitionTemplates';
import { EMPLOYMENT_TYPES } from '../../types';
import type { EmploymentType, LibraryTask, TransitionKind } from '../../types';

const emptyTaskDraft = (): Omit<LibraryTask, 'id'> => ({
  name: '',
  phase: 'Day One',
  assigneeRole: '',
  description: '',
});

type Sub = 'templates' | 'tasks';

export function TemplatesPage() {
  const {
    templates,
    libraryTasks,
    createTemplate,
    setStatus,
    deleteTemplate,
    createLibraryTask,
    updateLibraryTask,
    deleteLibraryTask,
  } = useTransitionTemplates();
  const { canManageTemplates } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();

  const sub: Sub = location.pathname === '/templates/tasks' ? 'tasks' : 'templates';
  function goSub(next: Sub) {
    navigate(next === 'templates' ? '/templates' : `/templates/${next}`);
  }

  const [kind, setKind] = useState<TransitionKind>('Onboarding');
  const [query, setQuery] = useState('');

  const [newTplOpen, setNewTplOpen] = useState(false);
  const [newTplName, setNewTplName] = useState('');
  const [newTplCompany, setNewTplCompany] = useState('');
  const [newTplType, setNewTplType] = useState<EmploymentType>('Full-Time');
  const [deleteTplId, setDeleteTplId] = useState<string | null>(null);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<LibraryTask | null>(null);
  const [taskDraft, setTaskDraft] = useState(emptyTaskDraft());
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (t.kind !== kind) return false;
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.company.toLowerCase().includes(q);
    });
  }, [templates, kind, query]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return libraryTasks;
    return libraryTasks.filter(
      (t) => t.name.toLowerCase().includes(q) || t.assigneeRole.toLowerCase().includes(q),
    );
  }, [libraryTasks, query]);

  const templateCount = templates.filter((t) => t.kind === kind).length;

  function openNewTemplate() {
    setNewTplName('');
    setNewTplCompany('');
    setNewTplType('Full-Time');
    setNewTplOpen(true);
  }

  function handleCreateTemplate() {
    if (!newTplName.trim() || !newTplCompany.trim()) return;
    const tpl = createTemplate(newTplName.trim(), kind, newTplCompany.trim(), newTplType);
    setNewTplOpen(false);
    navigate(`/templates/${tpl.id}`);
  }

  function openAddTask() {
    setEditingTask(null);
    setTaskDraft(emptyTaskDraft());
    setTaskFormOpen(true);
  }

  function openEditTask(task: LibraryTask) {
    setEditingTask(task);
    setTaskDraft({ name: task.name, phase: task.phase, assigneeRole: task.assigneeRole, description: task.description });
    setTaskFormOpen(true);
  }

  function saveTask() {
    if (!taskDraft.name.trim() || !taskDraft.assigneeRole.trim()) return;
    if (editingTask) {
      updateLibraryTask({ ...editingTask, ...taskDraft, name: taskDraft.name.trim() });
    } else {
      createLibraryTask({ ...taskDraft, name: taskDraft.name.trim() });
    }
    setTaskFormOpen(false);
  }

  const deleteTplName = templates.find((t) => t.id === deleteTplId)?.name;
  const deleteTaskName = libraryTasks.find((t) => t.id === deleteTaskId)?.name;

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-7">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Templates</h1>
        {sub === 'templates' ? (
          <Button
            icon={<Plus size={15} />}
            disabled={!canManageTemplates}
            title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
            onClick={openNewTemplate}
          >
            New {kind} Template
          </Button>
        ) : (
          <Button
            icon={<Plus size={15} />}
            disabled={!canManageTemplates}
            title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
            onClick={openAddTask}
          >
            New Task
          </Button>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
            {(['Onboarding', 'Offboarding'] as const).map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  kind === k ? 'bg-primary text-primary-dark' : 'text-ink-soft hover:bg-black/5'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <span className="text-border">—</span>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
            <button
              onClick={() => goSub('templates')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                sub === 'templates' ? 'bg-black/5 text-ink' : 'text-ink-soft hover:bg-black/5'
              }`}
            >
              <TemplateIcon size={13} /> Templates
              <Badge tone="gray" className="px-1.5 py-0">{templateCount}</Badge>
            </button>
            <button
              onClick={() => goSub('tasks')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                sub === 'tasks' ? 'bg-black/5 text-ink' : 'text-ink-soft hover:bg-black/5'
              }`}
            >
              <ListChecks size={13} /> Tasks
              <Badge tone="gray" className="px-1.5 py-0">{libraryTasks.length}</Badge>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink-soft">
          <Search size={14} className="text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={sub === 'templates' ? 'Search template...' : 'Search task...'}
            className="w-56 outline-none placeholder:text-subtle"
          />
        </div>
      </div>

      {sub === 'templates' ? (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <TemplateIcon className="text-subtle" size={28} />
              <p className="text-sm font-medium text-ink">No {kind.toLowerCase()} templates yet</p>
              <p className="text-xs text-muted">Create one to define the tasks for this transition.</p>
            </div>
          ) : (
            <div className="divide-y divide-border-soft overflow-x-auto">
              {filteredTemplates.map((t) => (
                <div
                  key={t.id}
                  onClick={() => navigate(`/templates/${t.id}`)}
                  className="flex min-w-fit cursor-pointer items-center gap-4 px-5 py-3.5 hover:bg-black/[0.02]"
                >
                  <p className="w-48 shrink-0 truncate text-sm font-medium text-ink">{t.name}</p>
                  <div className="flex w-32 shrink-0 items-center gap-2">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-bold text-white"
                      style={{ background: COMPANY_COLORS[t.company] ?? '#6B7280' }}
                    >
                      {t.company.charAt(0)}
                    </span>
                    <span className="truncate text-sm text-ink-soft">{t.company}</span>
                  </div>
                  <Badge tone="gray" className="w-24 shrink-0 justify-center">{t.employmentType}</Badge>
                  <span className="w-16 shrink-0 text-sm text-ink-soft">{t.tasks.length} Tasks</span>
                  <Badge tone={t.status === 'Active' ? 'green' : 'gray'} dot className="shrink-0">{t.status}</Badge>
                  <div className="ml-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={<MoreVertical size={16} className="text-subtle" />}
                      items={[
                        { label: 'View Template', onClick: () => navigate(`/templates/${t.id}`) },
                        {
                          label: t.status === 'Active' ? 'Deactivate' : 'Reactivate',
                          onClick: () => setStatus(t.id, t.status === 'Active' ? 'Inactive' : 'Active'),
                          disabled: !canManageTemplates,
                          disabledReason: !canManageTemplates ? 'Requires obo.template.manage permission' : undefined,
                        },
                        {
                          label: 'Delete',
                          danger: true,
                          onClick: () => setDeleteTplId(t.id),
                          disabled: !canManageTemplates,
                          disabledReason: !canManageTemplates ? 'Requires obo.template.manage permission' : undefined,
                        },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ListChecks className="text-subtle" size={28} />
              <p className="text-sm font-medium text-ink">No tasks in the library yet</p>
            </div>
          ) : (
            <div className="divide-y divide-border-soft overflow-x-auto">
              {filteredTasks.map((task) => (
                <div key={task.id} className="flex min-w-fit items-center gap-4 px-5 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{task.name}</p>
                    <p className="truncate text-xs text-subtle">{task.description}</p>
                  </div>
                  <Badge tone="gray" className="w-32 shrink-0 justify-center">{task.phase}</Badge>
                  <Badge tone="primary" className="w-28 shrink-0 justify-center">{task.assigneeRole}</Badge>
                  <Dropdown
                    trigger={<MoreVertical size={16} className="text-subtle" />}
                    items={[
                      {
                        label: 'Edit',
                        onClick: () => openEditTask(task),
                        disabled: !canManageTemplates,
                        disabledReason: !canManageTemplates ? 'Requires obo.template.manage permission' : undefined,
                      },
                      {
                        label: 'Delete',
                        danger: true,
                        onClick: () => setDeleteTaskId(task.id),
                        disabled: !canManageTemplates,
                        disabledReason: !canManageTemplates ? 'Requires obo.template.manage permission' : undefined,
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Dialog
        open={newTplOpen}
        onClose={() => setNewTplOpen(false)}
        title={`New ${kind} Template`}
        description="Start from a blank template — you'll add tasks next."
        footer={
          <>
            <Button variant="ghost" onClick={() => setNewTplOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTemplate} disabled={!newTplName.trim() || !newTplCompany.trim()}>
              Create &amp; Continue
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Template Name</label>
            <input
              autoFocus
              value={newTplName}
              onChange={(e) => setNewTplName(e.target.value)}
              placeholder="e.g. Marketing Onboarding"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Company</label>
            <input
              value={newTplCompany}
              onChange={(e) => setNewTplCompany(e.target.value)}
              placeholder="e.g. Dialog"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Employment Type</label>
            <select
              value={newTplType}
              onChange={(e) => setNewTplType(e.target.value as EmploymentType)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {EMPLOYMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteTplId}
        onClose={() => setDeleteTplId(null)}
        title="Delete template?"
        description={`"${deleteTplName}" will be permanently removed. This cannot be undone.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTplId(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTplId) deleteTemplate(deleteTplId);
                setDeleteTplId(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      />

      <Dialog
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setTaskFormOpen(false)}>Cancel</Button>
            <Button onClick={saveTask} disabled={!taskDraft.name.trim() || !taskDraft.assigneeRole.trim()}>
              {editingTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Task Name</label>
            <input
              autoFocus
              value={taskDraft.name}
              onChange={(e) => setTaskDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. IT Setup Config"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Phase</label>
            <input
              value={taskDraft.phase}
              onChange={(e) => setTaskDraft((d) => ({ ...d, phase: e.target.value }))}
              placeholder="e.g. Day One"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Assignee Role</label>
            <input
              value={taskDraft.assigneeRole}
              onChange={(e) => setTaskDraft((d) => ({ ...d, assigneeRole: e.target.value }))}
              placeholder="e.g. IT"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Description</label>
            <textarea
              rows={2}
              value={taskDraft.description}
              onChange={(e) => setTaskDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="What does this task involve?"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        title="Delete task?"
        description={`"${deleteTaskName}" will be removed from the task library.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTaskId(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTaskId) deleteLibraryTask(deleteTaskId);
                setDeleteTaskId(null);
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
