import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const isAdmin = user?.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/server/dashboard" className="text-2xl font-bold">
                                    <span className="text-blue-600">Smart</span>
                                    <span className="text-black">Shop</span>
                                </Link>
                            </div>
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href="/server/dashboard" active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                {isAdmin && (
                                    <NavLink href={route('users.index')} active={route().current('users.index')}>
                                        Users
                                    </NavLink>
                                )}
                                <NavLink href={route('banners.index')} active={route().current('banners.index')}>
                                    Banners
                                </NavLink>
                                <NavLink href={route('customers.index')} active={route().current('customers.index')}>
                                    Customers
                                </NavLink>
                                <NavLink href={route('orders.index')} active={route().current('orders.index')}>
                                    Orders
                                </NavLink>
                                <NavLink href="#" active={route().current('employees.index')}>
                                    Employees
                                </NavLink>
                                <NavLink href="#" active={route().current('stores.index')}>
                                    Stores
                                </NavLink>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            type="button"
                                            className={`h-16 inline-flex items-center px-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition ${
                                                route().current('brands.index') ||
                                                route().current('categories.index') ||
                                                route().current('products.index') ||
                                                route().current('product-images.index') ||
                                                route().current('reviews.index')
                                                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            Products
                                            <svg
                                                className="ml-1 h-4 w-4 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left">
                                        <Dropdown.Link href={route('brands.index')}>Brands</Dropdown.Link>
                                        <Dropdown.Link href={route('categories.index')}>Categories</Dropdown.Link>
                                        <Dropdown.Link href={route('products.index')}>Products</Dropdown.Link>
                                        <Dropdown.Link href={route('product-images.index')}>Product Images</Dropdown.Link>
                                        <Dropdown.Link href={route('reviews.index')}>Reviews</Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-gray-800 bg-gray-100 hover:text-gray-900 focus:outline-none"
                                            >
                                                <svg
                                                    className="h-5 w-5 mr-2 text-blue-500"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7H5z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4 text-gray-700"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content align="left">
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href="/server/dashboard" active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        {isAdmin && (
                            <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                                Users
                            </ResponsiveNavLink>
                        )}
                        <ResponsiveNavLink href={route('banners.index')} active={route().current('banners.index')}>
                            Banners
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('customers.index')} active={route().current('customers.index')}>
                            Customers
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('orders.index')} active={route().current('orders.index')}>
                            Orders
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="#" active={route().current('employees.index')}>
                            Employees
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href="#" active={route().current('stores.index')}>
                            Stores
                        </ResponsiveNavLink>
                        <div className="pl-3">
                            <div className="flex items-center text-gray-700 font-medium">
                                Products
                                <svg
                                    className="ml-1 h-4 w-4 text-gray-500"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-4 space-y-1">
                                <ResponsiveNavLink href={route('brands.index')} active={route().current('brands.index')}>
                                    Brands
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.index')}>
                                    Categories
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('products.index')} active={route().current('products.index')}>
                                    Products
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('product-images.index')} active={route().current('product-images.index')}>
                                    Product Images
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route('reviews.index')} active={route().current('reviews.index')}>
                                    Reviews
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800"></div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>
                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}
            <main>{children}</main>
        </div>
    );
}
