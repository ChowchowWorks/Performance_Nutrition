import { Navigate, Outlet } from 'react-router-dom';

const RequireAuth = () => {
  // Example: check for a token in localStorage instead of Redux
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default RequireAuth;