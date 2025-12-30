const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">
                        Welcome, {user?.fullName}!
                    </h1>
                    <p className="text-gray-600 mb-2">Email: {user?.email}</p>
                    <p className="text-gray-600 mb-2">Role: {user?.role}</p>
                    <p className="text-gray-600">Status: {user?.status}</p>

                    <div className="mt-6">
                        <button
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/login';
                            }}
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
