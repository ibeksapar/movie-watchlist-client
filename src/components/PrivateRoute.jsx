import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ token, children }) {
   return token ? children : <Navigate to='/login' replace />;
}
