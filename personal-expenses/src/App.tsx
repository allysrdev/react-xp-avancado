import ExpensesView from './components/ExpensesView';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import useAuth from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;

  return (
    <Routes>
      <Route
        path=":yearMonth"
        element={
          <ProtectedRoute user={user} loading={loading}>
            <ExpensesView />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={user ? '2025-01' : 'login'} />} />
      <Route path="login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
