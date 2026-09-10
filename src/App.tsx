import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { PlaceholderPage } from './components/layout/PlaceholderPage';
import { Overview } from './pages/dashboard/Overview';
import { FormsListPage } from './pages/templates/FormsListPage';
import { FormDetailPage } from './pages/templates/FormDetailPage';
import { NewFormPage } from './pages/templates/NewFormPage';
import { TemplatesPage } from './pages/templates/TemplatesPage';
import { TemplateDetailPage } from './pages/templates/TemplateDetailPage';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/tasks" element={<PlaceholderPage title="My Tasks" />} />
        <Route path="/dashboard/transitions" element={<PlaceholderPage title="Transitions" />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/templates/tasks" element={<TemplatesPage />} />
        <Route path="/templates/:id" element={<TemplateDetailPage />} />
        <Route path="/form-templates" element={<FormsListPage />} />
        <Route path="/form-templates/new" element={<NewFormPage />} />
        <Route path="/form-templates/:id" element={<FormDetailPage />} />
        <Route path="/form-templates/:id/edit" element={<FormDetailPage startInEdit />} />
        <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
