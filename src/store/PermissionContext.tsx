import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Permission } from '../types';

const STORAGE_KEY = 'obo-prototype-permission-v1';

interface PermissionContextValue {
  permission: Permission;
  setPermission: (p: Permission) => void;
  canManageTemplates: boolean;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [permission, setPermission] = useState<Permission>(
    () => (localStorage.getItem(STORAGE_KEY) as Permission) || 'manager',
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, permission);
  }, [permission]);

  return (
    <PermissionContext.Provider
      value={{ permission, setPermission, canManageTemplates: permission === 'manager' }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermission() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error('usePermission must be used within PermissionProvider');
  return ctx;
}
