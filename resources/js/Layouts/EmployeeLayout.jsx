import { Link, useForm, usePage } from "@inertiajs/react";

export default function EmployeeLayout({ children }) {
    const { post } = useForm();
    const { auth } = usePage().props;
    const employee = auth?.employee; // ✅ lấy đúng employee từ props

    const handleLogout = (e) => {
        e.preventDefault();
        post(route("staff.logout"));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-blue-600">
                    <Link href={route("staff.dashboard")} className="text-white">
                        SmartShop
                    </Link>
                    <div className="mt-2 text-sm font-normal">
                        {employee?.name} ({employee?.role})
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {employee?.role === "manager" && (
                        <Link
                            href="#"
                            className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                        >
                            Manage Employees
                        </Link>
                    )}

                    <Link
                        href={route("staff.customers.index")}
                        className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                    >
                        Add Customer
                    </Link>

                    <Link
                        href="#"
                        className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                    >
                        Manage Orders
                    </Link>

                    <Link
                        href={employee ? route("staff.stores.inventory", employee.store_id) : "#"}
                        className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                    >
                        Manage Inventory
                    </Link>

                    <Link
                        href="#"
                        className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                    >
                        Create Order & Payment
                    </Link>

                    <Link
                        href="#"
                        className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                    >
                        My Account
                    </Link>
                </nav>

                <form
                    onSubmit={handleLogout}
                    className="p-4 border-t border-blue-600"
                >
                    <button
                        type="submit"
                        className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
                    >
                        Logout
                    </button>
                </form>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
