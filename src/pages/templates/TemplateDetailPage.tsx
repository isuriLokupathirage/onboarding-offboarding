import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { useTransitionTemplates } from '../../store/TransitionTemplatesContext';
import { usePermission } from '../../store/PermissionContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { COMPANY_COLORS } from '../../data/transitionTemplates';
import type { TemplateTask, TransitionTemplate } from '../../types';

const emptyTaskDraft = (phase: string): Omit<TemplateTask, 'id'> => ({
  name: '',
  phase,
  assigneeRole: '',
  dueOffsetDays: 0,
});

export function TemplateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getTemplate, updateTemplate, setStatus, deleteTemplate } = useTransitionTemplates();
  const { canManageTemplates } = usePermission();
  const navigate = useNavigate();

  const original = id ? getTemplate(id) : undefined;
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaDraft, setMetaDraft] = useState({ name: '', company: '', employmentType: 'Full-Time' as TransitionTemplate['employmentType'] });
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TemplateTask | null>(null);
  const [taskDraft, setTaskDraft] = useState(emptyTaskDraft('Day One'));
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (original) {
      setMetaDraft({ name: original.name, company: original.company, employmentType: original.employmentType });
    }
    setEditingMeta(false);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!original) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-16 text-center">
        <p className="text-sm text-muted">This template doesn't exist or was deleted.</p>
        <Button className="mt-4" onClick={() => navigate('/templates')}>Back to Templates</Button>
      </div>
    );
  }

  function saveMeta() {
    if (!metaDraft.name.trim() || !metaDraft.company.trim() || !original) return;
    updateTemplate({ ...original, ...metaDraft, name: metaDraft.name.trim(), company: metaDraft.company.trim() });
    setEditingMeta(false);
  }

  function openAddTask() {
    setEditingTask(null);
    setTaskDraft(emptyTaskDraft(phases[0] ?? 'Day One'));
    setTaskFormOpen(true);
  }

  function openEditTask(task: TemplateTask) {
    setEditingTask(task);
    setTaskDraft({ name: task.name, phase: task.phase, assigneeRole: task.assigneeRole, dueOffsetDays: task.dueOffsetDays });
    setTaskFormOpen(true);
  }

  function saveTask() {
    if (!taskDraft.name.trim() || !taskDraft.assigneeRole.trim() || !original) return;
    let nextTasks: TemplateTask[];
    if (editingTask) {
      nextTasks = original.tasks.map((t) =>
        t.id === editingTask.id ? { ...t, ...taskDraft, name: taskDraft.name.trim() } : t,
      );
    } else {
      nextTasks = [...original.tasks, { ...taskDraft, name: taskDraft.name.trim(), id: `task-${Date.now()}` }];
    }
    updateTemplate({ ...original, tasks: nextTasks });
    setTaskFormOpen(false);
  }

  function removeTask(taskId: string) {
    if (!original) return;
    updateTemplate({ ...original, tasks: original.tasks.filter((t) => t.id !== taskId) });
    setDeleteTaskId(null);
  }

  const phases = Array.from(new Set(original.tasks.map((t) => t.phase)));
  const deleteTaskName = original.tasks.find((t) => t.id === deleteTaskId)?.name;

  return (
    <div className="mx-auto max-w-[1000px] px-8 py-7">
      <button
        onClick={() => navigate('/templates')}
        className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={13} /> Back to Templates
      </button>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ background: COMPANY_COLORS[original.company] ?? '#6B7280' }}
          >
            {original.company.charAt(0)}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-ink">{original.name}</h1>
              <Badge tone={original.kind === 'Onboarding' ? 'green' : 'red'} dot>{original.kind}</Badge>
              <Badge tone={original.status === 'Active' ? 'green' : 'gray'} dot>{original.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-subtle">
              {original.company} · {original.employmentType} · {original.tasks.length} Tasks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<Pencil size={14} />}
            disabled={!canManageTemplates}
            title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
            onClick={() => setEditingMeta(true)}
          >
            Edit Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!canManageTemplates}
            title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
            onClick={() => setStatus(original.id, original.status === 'Active' ? 'Inactive' : 'Active')}
          >
            {original.status === 'Active' ? 'Deactivate' : 'Reactivate'}
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!canManageTemplates}
            title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between rounded-2xl border border-border bg-white px-5 py-4 shadow-sm">
        <h2 className="text-sm font-semibold text-ink">Tasks</h2>
        <Button
          size="sm"
          icon={<Plus size={14} />}
          disabled={!canManageTemplates}
          title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
          onClick={openAddTask}
        >
          Add Task
        </Button>
      </div>

      {original.tasks.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white py-14 text-center shadow-sm">
          <p className="text-sm font-medium text-ink">No tasks yet</p>
          <p className="mt-1 text-xs text-muted">Add the tasks that make up this transition.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {phases.map((phase) => (
            <div key={phase} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
              <div className="border-b border-border-soft px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-subtle">
                {phase}
              </div>
              <div className="divide-y divide-border-soft overflow-x-auto">
                {original.tasks
                  .filter((t) => t.phase === phase)
                  .map((task) => (
                    <div key={task.id} className="flex min-w-fit items-center gap-4 px-5 py-3">
                      <p className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{task.name}</p>
                      <Badge tone="primary" className="w-28 shrink-0 justify-center">{task.assigneeRole}</Badge>
                      <span className="w-28 shrink-0 text-right text-xs text-subtle">
                        {task.dueOffsetDays === 0
                          ? 'Same day'
                          : task.dueOffsetDays > 0
                            ? `+${task.dueOffsetDays}d`
                            : `${task.dueOffsetDays}d`}
                      </span>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          disabled={!canManageTemplates}
                          onClick={() => openEditTask(task)}
                          className="rounded-md p-1.5 text-ink-soft hover:bg-black/5 disabled:opacity-30"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          disabled={!canManageTemplates}
                          onClick={() => setDeleteTaskId(task.id)}
                          className="rounded-md p-1.5 text-danger hover:bg-danger-bg disabled:opacity-30"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={editingMeta}
        onClose={() => setEditingMeta(false)}
        title="Edit Template Details"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingMeta(false)}>Cancel</Button>
            <Button onClick={saveMeta} disabled={!metaDraft.name.trim() || !metaDraft.company.trim()}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Template Name</label>
            <input
              value={metaDraft.name}
              onChange={(e) => setMetaDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Company</label>
            <input
              value={metaDraft.company}
              onChange={(e) => setMetaDraft((d) => ({ ...d, company: e.target.value }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add Task'}
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
            <label className="mb-1 block text-xs font-medium text-ink-soft">Due Offset (days, negative = before last day)</label>
            <input
              type="number"
              value={taskDraft.dueOffsetDays}
              onChange={(e) => setTaskDraft((d) => ({ ...d, dueOffsetDays: Number(e.target.value) }))}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        title="Remove task?"
        description={`"${deleteTaskName}" will be removed from this template.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTaskId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteTaskId && removeTask(deleteTaskId)}>Remove</Button>
          </>
        }
      />

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete template?"
        description={`"${original.name}" will be permanently removed. This cannot be undone.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteTemplate(original.id);
                navigate('/templates');
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
