import { useState, useEffect } from 'react';

const TestConnection = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/')
            .then((res) => res.json())
            .then((data) => {
                setMessage(data.message);
                setLoading(false);
            })
            .catch((err) => {
                setError('Failed to connect to backend');
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
                    User Management System
                </h1>

                <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Backend Connection Test
                    </h2>

                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="text-gray-600 mt-4">Connecting to backend...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-red-700 font-medium">{error}</p>
                            <p className="text-red-600 text-sm mt-2">
                                Make sure backend server is running on port 5000
                            </p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700 font-medium">✓ Connection Successful!</p>
                            <p className="text-gray-700 mt-2">Response: {message}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestConnection;
