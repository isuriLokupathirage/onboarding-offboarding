import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { PlaceholderPage } from './components/layout/PlaceholderPage';
import { Overview } from './pages/dashboard/Overview';
import { FormsListPage } from './pages/templates/FormsListPage';
import { FormDetailPage } from './pages/templates/FormDetailPage';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
        <Route path="/dashboard/overview" element={<Overview />} />
        <Route path="/dashboard/tasks" element={<PlaceholderPage title="My Tasks" />} />
        <Route path="/dashboard/transitions" element={<PlaceholderPage title="Transitions" />} />
        <Route path="/templates/forms" element={<FormsListPage />} />
        <Route path="/templates/forms/:id" element={<FormDetailPage />} />
        <Route path="/templates/forms/:id/edit" element={<FormDetailPage startInEdit />} />
        <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
