import { useState } from 'react';
import { ArrowDown, ArrowUp, FileStack, Pencil, Plus, Trash2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { ACCEPTED_DOCUMENT_FORMATS, DOCUMENT_SIZE_LIMIT_MB, DOCUMENT_TYPES } from '../../types';
import type { DocumentFieldDef, DocumentType } from '../../types';

const emptyDraft = (): Omit<DocumentFieldDef, 'id' | 'order'> => ({
  name: '',
  type: 'National ID',
  requirement: 'required',
  multiple: false,
});

export function DocumentsTab({
  documents,
  onChange,
  readOnly,
}: {
  documents: DocumentFieldDef[];
  onChange: (documents: DocumentFieldDef[]) => void;
  readOnly: boolean;
}) {
  const [editing, setEditing] = useState<DocumentFieldDef | null>(null);
  const [draft, setDraft] = useState(emptyDraft());
  const [formOpen, setFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sorted = [...documents].sort((a, b) => a.order - b.order);

  function openAdd() {
    setEditing(null);
    setDraft(emptyDraft());
    setFormOpen(true);
  }

  function openEdit(doc: DocumentFieldDef) {
    setEditing(doc);
    setDraft({ name: doc.name, type: doc.type, requirement: doc.requirement, multiple: doc.multiple });
    setFormOpen(true);
  }

  function save() {
    if (!draft.name.trim()) return;
    if (editing) {
      onChange(documents.map((d) => (d.id === editing.id ? { ...d, ...draft, name: draft.name.trim() } : d)));
    } else {
      const id = `doc-${Date.now()}`;
      onChange([...documents, { ...draft, name: draft.name.trim(), id, order: documents.length }]);
    }
    setFormOpen(false);
  }

  function remove(id: string) {
    const remaining = documents.filter((d) => d.id !== id).sort((a, b) => a.order - b.order);
    onChange(remaining.map((d, i) => ({ ...d, order: i })));
    setDeleteId(null);
  }

  function move(id: string, dir: -1 | 1) {
    const list = [...sorted];
    const idx = list.findIndex((d) => d.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    [list[idx], list[swapIdx]] = [list[swapIdx], list[idx]];
    onChange(list.map((d, i) => ({ ...d, order: i })));
  }

  const deleteDoc = documents.find((d) => d.id === deleteId);

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-border-soft px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-ink">Document Uploads</h3>
          <p className="mt-1 text-xs text-muted">
            Accepted formats: {ACCEPTED_DOCUMENT_FORMATS.join(', ')}. Each field accepts up to a combined{' '}
            {DOCUMENT_SIZE_LIMIT_MB} MB, whether single or multiple file.
          </p>
        </div>
        <Button size="sm" icon={<Plus size={14} />} disabled={readOnly} onClick={openAdd}>
          Add Document
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
          <FileStack className="text-subtle" size={26} />
          <p className="text-sm font-medium text-ink">No document fields yet</p>
          <p className="max-w-xs text-xs text-muted">
            A form can be saved without any document fields. Add one if this candidate group needs to upload
            paperwork.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border-soft">
          {sorted.map((doc, i) => (
            <div key={doc.id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex flex-col gap-0.5 text-subtle">
                <button
                  disabled={readOnly || i === 0}
                  onClick={() => move(doc.id, -1)}
                  className="rounded p-0.5 hover:bg-black/5 disabled:opacity-30"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  disabled={readOnly || i === sorted.length - 1}
                  onClick={() => move(doc.id, 1)}
                  className="rounded p-0.5 hover:bg-black/5 disabled:opacity-30"
                >
                  <ArrowDown size={13} />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{doc.name}</p>
                <p className="text-xs text-subtle">{doc.type}</p>
              </div>

              <Badge tone="gray">{doc.multiple ? 'Multiple files' : 'Single file'}</Badge>
              <Badge tone={doc.requirement === 'required' ? 'primary' : 'gray'}>
                {doc.requirement === 'required' ? 'Required' : 'Optional'}
              </Badge>

              <div className="flex items-center gap-1">
                <button
                  disabled={readOnly}
                  onClick={() => openEdit(doc)}
                  className="rounded-md p-1.5 text-ink-soft hover:bg-black/5 disabled:opacity-30"
                >
                  <Pencil size={14} />
                </button>
                <button
                  disabled={readOnly}
                  onClick={() => setDeleteId(doc.id)}
                  className="rounded-md p-1.5 text-danger hover:bg-danger-bg disabled:opacity-30"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Document Field' : 'Add Document Field'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={!draft.name.trim()}>{editing ? 'Save Changes' : 'Add Field'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Document Name *</label>
            <input
              autoFocus
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. NIC Front"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-soft">Document Type *</label>
            <select
              value={draft.type}
              onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as DocumentType }))}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Requirement</label>
              <div className="flex overflow-hidden rounded-lg border border-border">
                {(['optional', 'required'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setDraft((d) => ({ ...d, requirement: r }))}
                    className={`px-3 py-1.5 text-xs font-medium capitalize ${
                      draft.requirement === r ? 'bg-primary text-primary-dark' : 'bg-white text-ink-soft hover:bg-black/5'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Upload Mode</label>
              <div className="flex overflow-hidden rounded-lg border border-border">
                {[
                  { v: false, label: 'Single file' },
                  { v: true, label: 'Multiple files' },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setDraft((d) => ({ ...d, multiple: opt.v }))}
                    className={`px-3 py-1.5 text-xs font-medium ${
                      draft.multiple === opt.v ? 'bg-primary text-primary-dark' : 'bg-white text-ink-soft hover:bg-black/5'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Remove document field?"
        description={`"${deleteDoc?.name}" will be removed from this template.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => deleteId && remove(deleteId)}>Remove</Button>
          </>
        }
      />
    </div>
  );
}
