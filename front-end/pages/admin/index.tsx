import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '@components/header';
import Footer from '@components/footer';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getToken } from '@services/LocalStorageService';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>({});
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Add loading state
    const [error, setError] = useState<string | null>(null); // Add error state
    const router = useRouter();

    useEffect(() => {
        const fetchStats = async () => {
            const token = getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetching statistics and user list (admin only)
                const [statsRes, usersRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stats`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                const statsData = await statsRes.json();
                const usersData = await usersRes.json();
                setStats(statsData);
                setUsers(Array.isArray(usersData) ? usersData : []); // Ensure usersData is an array
            } catch (error) {
                console.error('Error fetching stats or users:', error);
                setError('Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [router]);

    const handleDeleteUser = async (userId: number) => {
        const token = getToken();
        if (!token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                alert('User deleted successfully');
                // Reload or refetch data to reflect changes
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="container mx-auto py-8 flex-grow">
                <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">Total Users</h3>
                        <p className="text-2xl">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">Total Boards</h3>
                        <p className="text-2xl">{stats.totalBoards}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">Total Pins</h3>
                        <p className="text-2xl">{stats.totalPins}</p>
                    </div>
                </div>

                {/* Users List */}
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">User Management</h2>
                    <table className="min-w-full bg-white shadow-md rounded-lg">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 text-left border-b">Username</th>
                                <th className="py-2 px-4 text-left border-b">Email</th>
                                <th className="py-2 px-4 text-left border-b">Role</th>
                                <th className="py-2 px-4 text-left border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(users) && users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td className="py-2 px-4 border-b">{user.username}</td>
                                        <td className="py-2 px-4 border-b">{user.email}</td>
                                        <td className="py-2 px-4 border-b">{user.role}</td>
                                        <td className="py-2 px-4 border-b">
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-2 px-4 text-center">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Fetch server-side translations
export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale || 'en', ['common'])),
        },
    };
};

export default AdminDashboard;
