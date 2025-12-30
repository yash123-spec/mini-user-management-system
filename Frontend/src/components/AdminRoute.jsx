import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If no token or user, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const userData = JSON.parse(user);

    // If not admin, redirect to user dashboard
    if (userData.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // Check if user is active
    if (userData.status === 'inactive') {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoute;
