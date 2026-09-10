import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, Plus, Search, FileEdit } from 'lucide-react';
import { useTemplates } from '../../store/TemplatesContext';
import { usePermission } from '../../store/PermissionContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dropdown } from '../../components/ui/Dropdown';
import { Dialog } from '../../components/ui/Dialog';
import { Pagination } from '../../components/ui/Pagination';
import { canDelete, documentCount, enabledFieldCount } from '../../utils/templateStats';

const PAGE_SIZE = 5;

export function FormsListPage() {
  const { templates, setStatus, deleteTemplate } = useTemplates();
  const { canManageTemplates } = usePermission();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive' | 'All'>('Active');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [templates, statusFilter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changeFilter(f: typeof statusFilter) {
    setStatusFilter(f);
    setPage(1);
  }

  const deleteTpl = templates.find((t) => t.id === deleteTarget);

  return (
    <div className="mx-auto max-w-[1400px] px-8 py-7">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink">Form Templates</h1>
        <Button
          icon={<Plus size={15} />}
          disabled={!canManageTemplates}
          title={!canManageTemplates ? 'Requires the Manage Plans (obo.template.manage) permission' : undefined}
          onClick={() => navigate('/form-templates/new')}
        >
          New Form
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-white p-1">
          {(['Active', 'Inactive', 'All'] as const).map((f) => (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f ? 'bg-primary text-primary-dark' : 'text-ink-soft hover:bg-black/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink-soft">
          <Search size={14} className="text-subtle" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or code"
            className="w-56 outline-none placeholder:text-subtle"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border-soft bg-black/[0.02] text-xs uppercase tracking-wide text-subtle">
              <th className="px-4 py-3 font-medium">Form Code</th>
              <th className="px-4 py-3 font-medium">Form Name</th>
              <th className="px-4 py-3 font-medium">Employment Type</th>
              <th className="px-4 py-3 font-medium">Field Count</th>
              <th className="px-4 py-3 font-medium">Document Count</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((t) => {
              const deletable = canDelete(t);
              return (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/form-templates/${t.id}`)}
                  className="cursor-pointer border-b border-border-soft last:border-b-0 hover:bg-black/[0.02]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-ink-soft">{t.code}</td>
                  <td className="px-4 py-3 font-medium text-ink">{t.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{t.employmentTypes.join(', ')}</td>
                  <td className="px-4 py-3 text-ink-soft">{enabledFieldCount(t)}</td>
                  <td className="px-4 py-3 text-ink-soft">{documentCount(t)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={t.status === 'Active' ? 'green' : 'gray'} dot>
                      {t.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Dropdown
                      trigger={<MoreVertical size={16} className="text-subtle" />}
                      items={[
                        { label: 'View', onClick: () => navigate(`/form-templates/${t.id}`) },
                        {
                          label: 'Edit',
                          onClick: () => navigate(`/form-templates/${t.id}/edit`),
                          disabled: !canManageTemplates,
                          disabledReason: !canManageTemplates
                            ? 'Requires obo.template.manage permission'
                            : undefined,
                        },
                        {
                          label: t.status === 'Active' ? 'Deactivate' : 'Reactivate',
                          onClick: () => setStatus(t.id, t.status === 'Active' ? 'Inactive' : 'Active'),
                          disabled: !canManageTemplates,
                          disabledReason: !canManageTemplates
                            ? 'Requires obo.template.manage permission'
                            : undefined,
                        },
                        {
                          label: 'Delete',
                          danger: true,
                          onClick: () => setDeleteTarget(t.id),
                          disabled: !canManageTemplates || !deletable,
                          disabledReason: !canManageTemplates
                            ? 'Requires obo.template.manage permission'
                            : !deletable
                              ? `Used by ${t.usedByTransitions} transition(s) — cannot be deleted`
                              : undefined,
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <FileEdit className="text-subtle" size={28} />
            <p className="text-sm font-medium text-ink">No forms match your filters</p>
            <p className="text-xs text-muted">Try a different search term or status filter.</p>
          </div>
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Dialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete form?"
        description={`"${deleteTpl?.name}" (${deleteTpl?.code}) will be permanently removed. This cannot be undone.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                if (deleteTarget) deleteTemplate(deleteTarget);
                setDeleteTarget(null);
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
