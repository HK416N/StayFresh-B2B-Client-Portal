import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, requireStaff = false, requireClient = false }) {
    const { user } = useAuth();

    // navigate to /login if not an existing user
    if (!user) return <Navigate to="/login" replace />;

    //check if role and page match if not navigate to /home
    if (requireStaff && user.role !== 'Staff') return <Navigate to="/home" replace />;
    if (requireClient && user.role !== 'Client') return <Navigate to="/home" replace />;

    return children;
}
