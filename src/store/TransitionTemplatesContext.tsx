import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { SEED_LIBRARY_TASKS, SEED_TRANSITION_TEMPLATES } from '../data/transitionTemplates';
import type { EmploymentType, LibraryTask, TransitionKind, TransitionTemplate } from '../types';

const TEMPLATES_KEY = 'obo-prototype-transition-templates-v1';
const LIBRARY_KEY = 'obo-prototype-library-tasks-v1';

interface TransitionTemplatesContextValue {
  templates: TransitionTemplate[];
  libraryTasks: LibraryTask[];
  getTemplate: (id: string) => TransitionTemplate | undefined;
  createTemplate: (name: string, kind: TransitionKind, company: string, employmentType: EmploymentType) => TransitionTemplate;
  updateTemplate: (template: TransitionTemplate) => void;
  setStatus: (id: string, status: 'Active' | 'Inactive') => void;
  deleteTemplate: (id: string) => void;
  createLibraryTask: (task: Omit<LibraryTask, 'id'>) => void;
  updateLibraryTask: (task: LibraryTask) => void;
  deleteLibraryTask: (id: string) => void;
}

const TransitionTemplatesContext = createContext<TransitionTemplatesContextValue | undefined>(undefined);

function load<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore corrupt storage
  }
  return seed;
}

export function TransitionTemplatesProvider({ children }: { children: ReactNode }) {
  const [templates, setTemplates] = useState<TransitionTemplate[]>(() =>
    load(TEMPLATES_KEY, SEED_TRANSITION_TEMPLATES),
  );
  const [libraryTasks, setLibraryTasks] = useState<LibraryTask[]>(() => load(LIBRARY_KEY, SEED_LIBRARY_TASKS));

  useEffect(() => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(libraryTasks));
  }, [libraryTasks]);

  const value = useMemo<TransitionTemplatesContextValue>(() => {
    const getTemplate = (id: string) => templates.find((t) => t.id === id);

    const createTemplate = (
      name: string,
      kind: TransitionKind,
      company: string,
      employmentType: EmploymentType,
    ) => {
      const today = new Date().toISOString().slice(0, 10);
      const tpl: TransitionTemplate = {
        id: `tt-${Date.now()}`,
        name,
        kind,
        company,
        employmentType,
        status: 'Active',
        createdAt: today,
        updatedAt: today,
        tasks: [],
      };
      setTemplates((prev) => [tpl, ...prev]);
      return tpl;
    };

    const updateTemplate = (template: TransitionTemplate) => {
      const today = new Date().toISOString().slice(0, 10);
      setTemplates((prev) =>
        prev.map((t) => (t.id === template.id ? { ...template, updatedAt: today } : t)),
      );
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

    const createLibraryTask = (task: Omit<LibraryTask, 'id'>) => {
      setLibraryTasks((prev) => [{ ...task, id: `lib-${Date.now()}` }, ...prev]);
    };

    const updateLibraryTask = (task: LibraryTask) => {
      setLibraryTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
    };

    const deleteLibraryTask = (id: string) => {
      setLibraryTasks((prev) => prev.filter((t) => t.id !== id));
    };

    return {
      templates,
      libraryTasks,
      getTemplate,
      createTemplate,
      updateTemplate,
      setStatus,
      deleteTemplate,
      createLibraryTask,
      updateLibraryTask,
      deleteLibraryTask,
    };
  }, [templates, libraryTasks]);

  return (
    <TransitionTemplatesContext.Provider value={value}>{children}</TransitionTemplatesContext.Provider>
  );
}

export function useTransitionTemplates() {
  const ctx = useContext(TransitionTemplatesContext);
  if (!ctx) throw new Error('useTransitionTemplates must be used within TransitionTemplatesProvider');
  return ctx;
}
