import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import Dashboard from '../components/Dashboard';
import Orders from '../components/Orders';
import { useAppSelector } from '../store/hooks';

export function App() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/orders"
        element={
          isAuthenticated ? <Orders /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
        }
      />
    </Routes>
  );
}

export default App;
