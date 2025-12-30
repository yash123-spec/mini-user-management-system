
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(res.data.user);
                setFullName(res.data.user.fullName);
            } catch (err) {
                setError('Failed to load profile. Please login again.');
                toast.error('Failed to load profile. Please login again.');
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
                `${import.meta.env.VITE_API_URL}/api/users/me`,
                { fullName, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Profile updated successfully.');
            toast.success('Profile updated successfully.');
            setUser((prev) => ({ ...prev, fullName }));
            // Update localStorage user
            const stored = JSON.parse(localStorage.getItem('user')) || {};
            localStorage.setItem('user', JSON.stringify({ ...stored, fullName }));
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed.');
            toast.error(err.response?.data?.message || 'Update failed.');
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Profile Card Left */}
                <div className="flex flex-col items-center justify-center bg-linear-to-br from-pink-400 to-orange-400 p-8 md:w-1/3 w-full">
                    <div className="mb-4">
                        <svg className="w-24 h-24 rounded-full bg-white p-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 19.125a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21c-2.676 0-5.216-.584-7.499-1.875z" />
                        </svg>
                    </div>
                    <div className="text-white text-xl font-bold mb-1">{user.fullName}</div>
                    <div className="text-white text-base mb-2 capitalize">{user.role}</div>
                </div>
                {/* Profile Card Right */}
                <div className="flex-1 p-8">
                    <div className="mb-6 border-b pb-4">
                        <div className="text-lg font-semibold text-gray-800 mb-2">Information</div>
                        <div className="flex flex-col md:flex-row md:space-x-8">
                            <div className="mb-2 md:mb-0">
                                <div className="text-sm font-bold text-gray-700">Email</div>
                                <div className="text-gray-600 text-base">{user.email}</div>
                            </div>
                            <div>
                                <div className="text-sm font-bold text-gray-700">Status</div>
                                <div className="text-gray-600 text-base capitalize">{user.status}</div>
                            </div>
                        </div>
                    </div>

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
