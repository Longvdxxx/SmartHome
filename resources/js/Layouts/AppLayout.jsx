import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const isAdmin = auth?.user?.role === 'admin';

    const DashboardIcon = () => (
        <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18v18H3V3z" />
        </svg>
    );

    const CustomersIcon = () => (
        <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M9 14a4 4 0 100-8 4 4 0 000 8z" />
        </svg>
    );

    const UsersIcon = () => (
        <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7" />
        </svg>
    );

    const LoginIcon = () => (
        <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m6-6l-6 6 6 6" />
        </svg>
    );

    const linkStyle = { color: 'white' };

    return (
        <div className="min-h-screen flex">
            {/* Nav bar bên trái dùng table */}
            <aside className="bg-blue-600 w-48 min-h-screen p-4">
                <table className="w-full text-white">
                    <tbody>
                        {auth?.user ? (
                            <>
                                <tr>
                                    <td className="py-2 hover:text-gray-300 cursor-pointer">
                                        <Link href={route('dashboard')} className="flex items-center" style={linkStyle}>
                                            <DashboardIcon />
                                            Dashboard
                                        </Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-2 hover:text-gray-300 cursor-pointer">
                                        <Link href={route('customers.index')} className="flex items-center" style={linkStyle}>
                                            <CustomersIcon />
                                            Customers
                                        </Link>
                                    </td>
                                </tr>
                                {isAdmin && (
                                    <tr>
                                        <td className="py-2 hover:text-gray-300 cursor-pointer">
                                            <Link href={route('users.index')} className="flex items-center" style={linkStyle}>
                                                <UsersIcon />
                                                Users
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ) : (
                            <tr>
                                <td className="py-2 hover:text-gray-300 cursor-pointer">
                                    <Link href={route('login')} className="flex items-center" style={linkStyle}>
                                        <LoginIcon />
                                        Login
                                    </Link>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </aside>

            {/* Nội dung chính bên phải */}
            <main className="flex-1 bg-gray-50 p-6">
                {children}
            </main>
        </div>
    );
}
