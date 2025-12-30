import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // If no token or user, redirect to login
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is active
    const userData = JSON.parse(user);
    if (userData.status === 'inactive') {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
