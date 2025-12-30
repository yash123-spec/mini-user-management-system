import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const location = useLocation();

    if (!user) return null; // No navbar if not logged in

    return (
        <nav className="bg-black shadow mb-6">
            <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                <div className="font-bold text-lg text-white">User Management</div>
                <div className="flex items-center space-x-4">
                    {/* Show Dashboard link for user, Admin Dashboard for admin */}
                    {user.role === 'admin' ? (
                        <Link
                            to="/admin/dashboard"
                            className={`hover:underline ${location.pathname === '/admin/dashboard' ? 'text-white font-semibold' : 'text-gray-300'}`}
                        >
                            Admin Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/dashboard"
                            className={`hover:underline ${location.pathname === '/dashboard' ? 'text-white font-semibold' : 'text-gray-300'}`}
                        >
                            Dashboard
                        </Link>
                    )}
                    {/* User info */}
                    <span className="text-gray-300 text-sm">{user.fullName} ({user.role})</span>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
