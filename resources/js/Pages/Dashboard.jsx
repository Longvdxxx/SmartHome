import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Users,
    Tag,
    LayoutGrid,
    Image,
    UserCheck,
    Package,
    ShoppingCart,
    List,
    FileImage,
    Star,
    LayoutDashboard,
} from 'lucide-react';

const navigationCards = [
    { title: "Dashboard", description: "Overview of the system", icon: LayoutDashboard, route: "/server/dashboard" },
    { title: "Users", description: "Manage registered users", icon: Users, route: route("users.index") },
    { title: "Brands", description: "Manage product brands", icon: Tag, route: route("brands.index") },
    { title: "Categories", description: "Organize product categories", icon: LayoutGrid, route: route("categories.index") },
    { title: "Banners", description: "Manage banner images", icon: Image, route: route("banners.index") },
    { title: "Customers", description: "Customer information", icon: UserCheck, route: route("customers.index") },
    { title: "Products", description: "Manage product list", icon: Package, route: route("products.index") },
    { title: "Orders", description: "View and track orders", icon: ShoppingCart, route: route("orders.index") },
    { title: "Product Images", description: "Manage product images", icon: FileImage, route: route("product-images.index") },
    { title: "Reviews", description: "Customer reviews", icon: Star, route: route("reviews.index") },
];

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <div className="p-6">
                <table className="table-fixed border-collapse w-full">
                    <tbody>
                        {[0, 1].map((row) => (
                            <tr key={row} className="h-64">
                                {navigationCards.slice(row * 5, row * 5 + 5).map((card, idx) => {
                                    const Icon = card.icon;
                                    return (
                                        <td key={idx} className="border p-4 align-top">
                                            <a
                                                href={card.route}
                                                className="flex flex-col items-center justify-center h-full text-center hover:bg-gray-50 rounded-lg p-4 transition"
                                            >
                                                <div className="w-12 h-12 bg-blue-500 flex items-center justify-center rounded-full mb-3">
                                                    <Icon className="w-6 h-6 text-white" />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">{card.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">{card.description}</p>
                                            </a>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
