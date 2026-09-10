import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { TemplatesProvider } from './store/TemplatesContext';
import { TransitionTemplatesProvider } from './store/TransitionTemplatesContext';
import { PermissionProvider } from './store/PermissionContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PermissionProvider>
        <TemplatesProvider>
          <TransitionTemplatesProvider>
            <App />
          </TransitionTemplatesProvider>
        </TemplatesProvider>
      </PermissionProvider>
    </BrowserRouter>
  </StrictMode>,
);
