// pages/PrivateRoute.js
import { Navigate } from 'react-router-dom';
import { useUser } from './components';

function PrivateRoute({ children }) {
  const { user } = useUser();

  if (!user || !user.name) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
