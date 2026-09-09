import { Lock, Users } from 'lucide-react';
import { FIELD_CATALOG } from '../../data/fieldCatalog';
import { Segmented } from '../../components/ui/Segmented';
import { Switch } from '../../components/ui/Switch';
import { Tooltip } from '../../components/ui/Tooltip';
import type { FieldState, FormSectionConfig } from '../../types';

const STATE_OPTIONS: { value: FieldState; label: string }[] = [
  { value: 'hidden', label: 'Hidden' },
  { value: 'optional', label: 'Optional' },
  { value: 'required', label: 'Required' },
];

export function FieldsTab({
  sections,
  onChange,
  readOnly,
}: {
  sections: FormSectionConfig[];
  onChange: (sections: FormSectionConfig[]) => void;
  readOnly: boolean;
}) {
  function updateSection(sectionId: string, patch: Partial<FormSectionConfig>) {
    onChange(sections.map((s) => (s.sectionId === sectionId ? { ...s, ...patch } : s)));
  }

  function updateFieldState(sectionId: string, fieldId: string, state: FieldState) {
    onChange(
      sections.map((s) =>
        s.sectionId !== sectionId
          ? s
          : { ...s, fields: s.fields.map((f) => (f.fieldId === fieldId ? { ...f, state } : f)) },
      ),
    );
  }

  return (
    <div className="space-y-4">
      {FIELD_CATALOG.map((sectionDef) => {
        const config = sections.find((s) => s.sectionId === sectionDef.id);
        if (!config) return null;
        const hasLockedField = sectionDef.fields.some((f) => f.locked);
        const isRepeating = sectionDef.id === 'emergency';

        const parentsFields = sectionDef.fields.filter((f) => f.id.startsWith('parent'));
        const spouseFields = sectionDef.fields.filter(
          (f) => f.id.startsWith('spouse') || f.id === 'children',
        );

        return (
          <div key={sectionDef.id} className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-border-soft px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-ink">{sectionDef.name}</h3>
                  {isRepeating && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                      <Users size={11} /> Repeating
                    </span>
                  )}
                </div>
                {sectionDef.description && (
                  <p className="mt-1 max-w-xl text-xs text-muted">{sectionDef.description}</p>
                )}
              </div>
              <Tooltip
                label={
                  hasLockedField
                    ? 'This section contains a field mandatory in Employee Management and cannot be disabled.'
                    : config.enabled
                      ? 'Disable this section for candidates using this form.'
                      : 'Enable this section for candidates using this form.'
                }
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-ink-soft">
                    {config.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <Switch
                    checked={config.enabled}
                    disabled={readOnly || hasLockedField}
                    onChange={(v) => updateSection(sectionDef.id, { enabled: v })}
                    label={`Toggle ${sectionDef.name}`}
                  />
                </div>
              </Tooltip>
            </div>

            <div className={config.enabled ? '' : 'pointer-events-none opacity-40'}>
              {sectionDef.conditional === 'insurance' ? (
                <div className="grid grid-cols-1 divide-y divide-border-soft md:grid-cols-2 md:divide-x md:divide-y-0">
                  <div className="px-5 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">
                      Parents group — shown when Single
                    </p>
                    <div className="space-y-3">
                      {parentsFields.map((f) => (
                        <FieldRow
                          key={f.id}
                          field={f}
                          state={config.fields.find((x) => x.fieldId === f.id)?.state ?? 'hidden'}
                          readOnly={readOnly}
                          onChange={(state) => updateFieldState(sectionDef.id, f.id, state)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">
                      Spouse &amp; Children group — shown when Married
                    </p>
                    <div className="space-y-3">
                      {spouseFields.map((f) => (
                        <FieldRow
                          key={f.id}
                          field={f}
                          state={config.fields.find((x) => x.fieldId === f.id)?.state ?? 'hidden'}
                          readOnly={readOnly}
                          onChange={(state) => updateFieldState(sectionDef.id, f.id, state)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border-soft">
                  {sectionDef.fields.map((f) => (
                    <div key={f.id} className="px-5 py-3">
                      <FieldRow
                        field={f}
                        state={config.fields.find((x) => x.fieldId === f.id)?.state ?? 'hidden'}
                        readOnly={readOnly}
                        onChange={(state) => updateFieldState(sectionDef.id, f.id, state)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FieldRow({
  field,
  state,
  readOnly,
  onChange,
}: {
  field: { id: string; label: string; locked?: boolean; lockedReason?: string; fixedOptions?: string[]; hasOtherOption?: boolean; helper?: string };
  state: FieldState;
  readOnly: boolean;
  onChange: (state: FieldState) => void;
}) {
  const disabled = readOnly || field.locked;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-ink">{field.label}</p>
          {field.locked && (
            <Tooltip label={field.lockedReason ?? 'Mandatory in Employee Management.'}>
              <Lock size={12} className="text-subtle" />
            </Tooltip>
          )}
        </div>
        {field.fixedOptions && (
          <p className="mt-0.5 truncate text-xs text-subtle">
            {field.fixedOptions.join(' · ')}
            {field.hasOtherOption ? '' : ''}
          </p>
        )}
        {field.helper && <p className="mt-0.5 text-xs text-subtle">{field.helper}</p>}
      </div>
      {field.locked ? (
        <Tooltip label={field.lockedReason ?? 'Mandatory in Employee Management.'}>
          <Segmented value={state} onChange={onChange} options={STATE_OPTIONS} disabled={disabled} />
        </Tooltip>
      ) : (
        <Segmented value={state} onChange={onChange} options={STATE_OPTIONS} disabled={disabled} />
      )}
    </div>
  );
}
