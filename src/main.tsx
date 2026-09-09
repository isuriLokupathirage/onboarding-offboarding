import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { TemplatesProvider } from './store/TemplatesContext';
import { PermissionProvider } from './store/PermissionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PermissionProvider>
        <TemplatesProvider>
          <App />
        </TemplatesProvider>
      </PermissionProvider>
    </BrowserRouter>
  </StrictMode>,
);
