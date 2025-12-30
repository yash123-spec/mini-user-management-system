import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PAGE_SIZE = 10;

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [actionUser, setActionUser] = useState(null);
    const [actionType, setActionType] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    useEffect(() => {
        fetchUsers(page);

    }, [page]);

    const fetchUsers = async (pageNum) => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/users?page=${pageNum}&limit=${PAGE_SIZE}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setUsers(res.data.users);
            setTotalPages(res.data.pagination.totalPages);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch users. Please try again."
            );
        }
        setLoading(false);
    };

    const handleAction = (user, type) => {
        setActionUser(user);
        setActionType(type);
    };

    const confirmAction = async () => {
        if (!actionUser) return;
        setLoading(true);
        setError("");
        setMessage("");
        try {
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/users/${actionUser._id}/${actionType}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(
                `User ${actionType === "activate" ? "activated" : "deactivated"} successfully.`
            );
            fetchUsers(page);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                `Failed to ${actionType} user. Please try again.`
            );
        }
        setActionUser(null);
        setActionType("");
        setLoading(false);
    };

    const cancelAction = () => {
        setActionUser(null);
        setActionType("");
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Dashboard</h2>
                <button
                    onClick={handleLogout}
                    className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                >
                    Logout
                </button>
            </div>
            {message && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2">
                    {message}
                </div>
            )}
            {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2">
                    {error}
                </div>
            )}
            <div className="overflow-x-auto bg-white rounded-xl shadow border">
                <table className="min-w-full text-left">
                    <thead className="bg-white">
                        <tr>
                            <th className="py-3 px-4 font-semibold text-gray-700 border-b">Email</th>
                            <th className="py-3 px-4 font-semibold text-gray-700 border-b">Full Name</th>
                            <th className="py-3 px-4 font-semibold text-gray-700 border-b">Role</th>
                            <th className="py-3 px-4 font-semibold text-gray-700 border-b">Status</th>
                            <th className="py-3 px-4 font-semibold text-gray-700 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6">
                                    Loading...
                                </td>
                            </tr>
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3 px-4 border-b">{user.email}</td>
                                    <td className="py-3 px-4 border-b">{user.fullName}</td>
                                    <td className="py-3 px-4 border-b">{user.role}</td>
                                    <td className="py-3 px-4 border-b">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${user.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b">
                                        {user.role !== "admin" && (
                                            <>
                                                {user.status === "active" ? (
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2"
                                                        onClick={() => handleAction(user, "deactivate")}
                                                        title="Deactivate"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="text-green-600 hover:text-green-800 p-2"
                                                        onClick={() => handleAction(user, "activate")}
                                                        title="Activate"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="flex justify-center items-center mt-6 space-x-1">
                <button
                    className="px-2 py-1 rounded border text-gray-500 hover:bg-gray-100"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                >
                    {'<<'}
                </button>
                <button
                    className="px-2 py-1 rounded border text-gray-500 hover:bg-gray-100"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    {'<'}
                </button>
                {[...Array(totalPages)].map((_, idx) => (
                    <button
                        key={idx + 1}
                        className={`px-3 py-1 rounded border ${page === idx + 1 ? 'bg-green-200 text-green-900 font-bold' : 'text-gray-700 hover:bg-gray-100'}`}
                        onClick={() => setPage(idx + 1)}
                    >
                        {idx + 1}
                    </button>
                ))}
                <button
                    className="px-2 py-1 rounded border text-gray-500 hover:bg-gray-100"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    {'>'}
                </button>
                <button
                    className="px-2 py-1 rounded border text-gray-500 hover:bg-gray-100"
                    onClick={() => setPage(totalPages)}
                    disabled={page === totalPages}
                >
                    {'>>'}
                </button>
            </div>
            {/* Modal for confirmation */}
            {actionUser && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-2">
                            {actionType === "activate" ? "Activate" : "Deactivate"} User
                        </h3>
                        <p>
                            Are you sure you want to{" "}
                            <span className="font-bold">{actionType}</span> user{" "}
                            <span className="font-bold">{actionUser.fullName}</span>?
                        </p>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-1 mr-2 bg-gray-200 rounded hover:bg-gray-300"
                                onClick={cancelAction}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-1 rounded ${actionType === "activate"
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-red-500 text-white hover:bg-red-600"
                                    }`}
                                onClick={confirmAction}
                            >
                                {actionType === "activate" ? "Activate" : "Deactivate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
