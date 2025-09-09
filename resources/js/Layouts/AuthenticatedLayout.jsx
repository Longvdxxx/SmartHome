import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Thanh navigation */}
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

                            {/* Menu links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                <NavLink href={route('users.index')} active={route().current('users.index')}>
                                    Users
                                </NavLink>
                                <NavLink href={route('brands.index')} active={route().current('brands.index')}>
                                    Brands
                                </NavLink>
                                <NavLink href={route('categories.index')} active={route().current('categories.index')}>
                                    Categories
                                </NavLink>
                                <NavLink href={route('banners.index')} active={route().current('banners.index')}>
                                    Banners
                                </NavLink>
                                <NavLink href={route('customers.index')} active={route().current('customers.index')}>
                                    Customers
                                </NavLink>
                                <NavLink href={route('products.index')} active={route().current('products.index')}>
                                    Products
                                </NavLink>
                                <NavLink href={route('orders.index')} active={route().current('orders.index')}>
                                    Orders
                                </NavLink>
                                <NavLink href={route('order-items.index')} active={route().current('order-items.index')}>
                                    Order Items
                                </NavLink>
                                <NavLink href={route('product-images.index')} active={route().current('product-images.index')}>
                                    Product Images
                                </NavLink>
                                <NavLink href={route('reviews.index')} active={route().current('reviews.index')}>
                                    Reviews
                                </NavLink>
                            </div>
                        </div>

                        {/* Dropdown tài khoản */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-800 bg-gray-100 hover:text-gray-900 focus:outline-none transition ease-in-out duration-150"
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
                                                {user.name}
                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4 text-gray-700"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* Menu mobile */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((prev) => !prev)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
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

                {/* Dropdown menu mobile */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('users.index')} active={route().current('users.index')}>
                            Users
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('brands.index')} active={route().current('brands.index')}>
                            Brands
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('categories.index')} active={route().current('categories.index')}>
                            Categories
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('banners.index')} active={route().current('banners.index')}>
                            Banners
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('customers.index')} active={route().current('customers.index')}>
                            Customers
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('products.index')} active={route().current('products.index')}>
                            Products
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('orders.index')} active={route().current('orders.index')}>
                            Orders
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('order-items.index')} active={route().current('order-items.index')}>
                            Order Items
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('product-images.index')} active={route().current('product-images.index')}>
                            Product Images
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('reviews.index')} active={route().current('reviews.index')}>
                            Reviews
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
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

            {/* Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Nội dung chính */}
            <main>{children}</main>
        </div>
    );
}
