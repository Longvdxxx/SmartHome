import { router, useForm, usePage } from "@inertiajs/react";

export default function EmployeeLayout({ children }) {
    const { post } = useForm();
    const { auth } = usePage().props;
    const employee = auth?.employee;

    const handleLogout = (e) => {
        e.preventDefault();
        post(route("staff.logout"));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <aside className="w-64 bg-blue-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-blue-600">
                    {employee ? (
                        <a href={route("staff.dashboard")} className="text-white">
                            SmartShop
                        </a>
                    ) : (
                        <span>SmartShop</span>
                    )}
                    {employee && (
                        <div className="mt-2 text-sm font-normal">
                            {employee.name} ({employee.role})
                        </div>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {employee && employee.role === "manager" && (
                        <a
                            href={route("staff.manage.index")}
                            className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                        >
                            Manage Employees
                        </a>
                    )}

                    {employee && ["manager", "cashier"].includes(employee.role) && (
                        <>
                            <a
                                href={route("staff.customers.index")}
                                className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                            >
                                Add Customer
                            </a>

                            <a
                                href={route("staff.payment.index")}
                                className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                            >
                                Create Order & Payment
                            </a>

                            <a
                                href={route("staff.orders.index")}
                                className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                            >
                                Manage Orders
                            </a>
                        </>
                    )}

                    {employee && ["manager", "stock"].includes(employee.role) && (
                        <a
                            href={route("staff.stores.inventory", employee.store_id)}
                            className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                        >
                            Manage Inventory
                        </a>
                    )}

                    {employee && (
                        <a
                            href={route("staff.profile.edit")}
                            className="block px-3 py-2 rounded text-white hover:bg-blue-600"
                        >
                            My Account
                        </a>
                    )}
                </nav>

                {employee && (
                    <form onSubmit={handleLogout} className="p-4 border-t border-blue-600">
                        <button
                            type="submit"
                            className="w-full px-3 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
                        >
                            Logout
                        </button>
                    </form>
                )}
            </aside>

            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
