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
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users?page=${pageNum}&limit=${PAGE_SIZE}`,
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
                `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/users/${actionUser._id}/${actionType}`,
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
            <div className="flex justify-between items-center mb-4">
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
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded">
                    <thead>
                        <tr>
                            <th className="py-2 px-3 border-b">Email</th>
                            <th className="py-2 px-3 border-b">Full Name</th>
                            <th className="py-2 px-3 border-b">Role</th>
                            <th className="py-2 px-3 border-b">Status</th>
                            <th className="py-2 px-3 border-b">Actions</th>
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
                                <tr key={user._id}>
                                    <td className="py-2 px-3 border-b">{user.email}</td>
                                    <td className="py-2 px-3 border-b">{user.fullName}</td>
                                    <td className="py-2 px-3 border-b">{user.role}</td>
                                    <td className="py-2 px-3 border-b">
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${user.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                                }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-3 border-b">
                                        {user.role !== "admin" && (
                                            <>
                                                {user.status === "active" ? (
                                                    <button
                                                        className="bg-red-500 text-white px-3 py-1 rounded mr-2 hover:bg-red-600"
                                                        onClick={() => handleAction(user, "deactivate")}
                                                    >
                                                        Deactivate
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                                                        onClick={() => handleAction(user, "activate")}
                                                    >
                                                        Activate
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
            <div className="flex justify-center mt-4">
                <button
                    className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Prev
                </button>
                <span className="px-3 py-1 mx-1">{page} / {totalPages}</span>
                <button
                    className="px-3 py-1 mx-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
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
