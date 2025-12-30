import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    if (!user) return null; // No navbar if not logged in

    return (
        <nav className="bg-white shadow mb-6">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="font-bold text-lg text-indigo-700">User Management</div>
                <div className="flex items-center space-x-4">
                    {/* Show Dashboard link for user, Admin Dashboard for admin */}
                    {user.role === 'admin' ? (
                        <Link
                            to="/admin/dashboard"
                            className={`hover:underline ${location.pathname === '/admin/dashboard' ? 'text-indigo-700 font-semibold' : 'text-gray-700'}`}
                        >
                            Admin Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/dashboard"
                            className={`hover:underline ${location.pathname === '/dashboard' ? 'text-indigo-700 font-semibold' : 'text-gray-700'}`}
                        >
                            Dashboard
                        </Link>
                    )}
                    {/* User info */}
                    <span className="text-gray-600 text-sm">{user.fullName} ({user.role})</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
