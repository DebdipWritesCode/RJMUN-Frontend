import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('admin_token');

  return token ? <Outlet /> : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
