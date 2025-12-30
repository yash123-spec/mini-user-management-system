
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [fullName, setFullName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user);
                setFullName(res.data.user.fullName);
            } catch (err) {
                setError('Failed to load profile. Please login again.');
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(
                `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/me`,
                { fullName, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully.');
            setUser((prev) => ({ ...prev, fullName }));
            // Update localStorage user
            const stored = JSON.parse(localStorage.getItem('user')) || {};
            localStorage.setItem('user', JSON.stringify({ ...stored, fullName }));
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/login';
    };

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user.fullName}!</h1>
                    <p className="text-gray-600 mb-2">Email: {user.email}</p>
                    <p className="text-gray-600 mb-2">Role: {user.role}</p>
                    <p className="text-gray-600 mb-4">Status: {user.status}</p>

                    {message && <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">{message}</div>}
                    {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">{error}</div>}

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-1">Change Password</label>
                            <input
                                type="password"
                                className="w-full border px-3 py-2 rounded mb-2"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>

                    <div className="mt-6">
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
