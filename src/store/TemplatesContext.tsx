import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SEED_TEMPLATES, nextCode } from '../data/templates';
import { defaultSections } from '../data/templates';
import type { FormTemplate, EmploymentType } from '../types';

const STORAGE_KEY = 'obo-prototype-templates-v1';

interface TemplatesContextValue {
  templates: FormTemplate[];
  getTemplate: (id: string) => FormTemplate | undefined;
  createTemplate: (name: string, employmentType: EmploymentType) => FormTemplate;
  saveTemplate: (
    updated: FormTemplate,
  ) => { mode: 'updated' | 'cloned'; template: FormTemplate };
  setStatus: (id: string, status: 'Active' | 'Inactive') => void;
  deleteTemplate: (id: string) => void;
  resetAll: () => void;
}

const TemplatesContext = createContext<TemplatesContextValue | undefined>(undefined);

function load(): FormTemplate[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as FormTemplate[];
  } catch {
    // ignore corrupt storage
  }
  return SEED_TEMPLATES;
}

export function TemplatesProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<FormTemplate[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  }, [templates]);

  const value = useMemo<TemplatesContextValue>(() => {
    const getTemplate = (id: string) => templates.find((t) => t.id === id);

    const createTemplate = (name: string, employmentType: EmploymentType) => {
      const codes = templates.map((t) => t.code);
      const tpl: FormTemplate = {
        id: `tpl-${Date.now()}`,
        code: nextCode('ACX', codes),
        name,
        employmentType,
        status: 'Active',
        usedByTransitions: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        sections: defaultSections(),
        documents: [],
      };
      setTemplates((prev) => [tpl, ...prev]);
      return tpl;
    };

    const saveTemplate = (updated: FormTemplate) => {
      const existing = templates.find((t) => t.id === updated.id);
      const today = new Date().toISOString().slice(0, 10);
      if (existing && existing.usedByTransitions > 0) {
        const codes = templates.map((t) => t.code);
        const clone: FormTemplate = {
          ...updated,
          id: `tpl-${Date.now()}`,
          code: nextCode('ACX', codes),
          usedByTransitions: 0,
          createdAt: today,
          updatedAt: today,
          clonedFrom: existing.code,
        };
        setTemplates((prev) => [clone, ...prev]);
        return { mode: 'cloned' as const, template: clone };
      }
      const saved: FormTemplate = { ...updated, updatedAt: today };
      setTemplates((prev) => prev.map((t) => (t.id === saved.id ? saved : t)));
      return { mode: 'updated' as const, template: saved };
    };

    const setStatus = (id: string, status: 'Active' | 'Inactive') => {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status, updatedAt: new Date().toISOString().slice(0, 10) } : t,
        ),
      );
    };

    const deleteTemplate = (id: string) => {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    };

    const resetAll = () => {
      setTemplates(SEED_TEMPLATES);
    };

    return { templates, getTemplate, createTemplate, saveTemplate, setStatus, deleteTemplate, resetAll };
  }, [templates]);

  return <TemplatesContext.Provider value={value}>{children}</TemplatesContext.Provider>;
}

export function useTemplates() {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error('useTemplates must be used within TemplatesProvider');
  return ctx;
}
