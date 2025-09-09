import { Link, Head } from '@inertiajs/react';
import { LayoutContext, LayoutProvider } from "@/Layouts/layout/context/layoutcontext.jsx";
import { PrimeReactProvider } from "primereact/api";
import { Button } from "primereact/button";
import React, { useContext } from "react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <PrimeReactProvider>
            <LayoutProvider>
                <Head title="SmartShop - Admin Portal" />
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">

                    {/* Header */}
                    <div className="p-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm">
                        <div className="flex justify-between items-center max-w-7xl mx-auto">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                    <i className="pi pi-home text-white text-xl"></i>
                                </div>
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">
                                    Smart<span className="text-blue-600">Shop</span>
                                </span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {auth.user ? (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                            Welcome, {auth.user.name}
                                        </span>
                                        <Link href={route('dashboard')} className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                                            <i className="pi pi-chart-line mr-2"></i>
                                            Dashboard
                                        </Link>
                                    </>
                                ) : (
                                    <Link href={route('login')} className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg">
                                        <i className="pi pi-sign-in mr-2"></i>
                                        Sign In
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Hero Section - Manage Smart Home Efficiently */}
                    <div className="w-full max-w-7xl mx-auto px-6 py-16">
                        <section className="text-center">
                            <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full mb-4">
                                SmartShop Management System
                            </span>
                            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white leading-tight">
                                Manage
                                <span className="block text-blue-600 dark:text-blue-400">Smart Home</span>
                                <span className="block">Efficiently</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 max-w-xl mx-auto">
                                Comprehensive management system for administrators and staff. Manage smart home products,
                                orders, customers, and revenue reports easily and professionally.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4 mb-8">
                                {!auth.user ? (
                                    <Link href={route('login')}>
                                        <Button label="Sign In Now" icon="pi pi-sign-in" className="p-button-lg bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700" />
                                    </Link>
                                ) : (
                                    <Link href={route('dashboard')}>
                                        <Button label="Go to Dashboard" icon="pi pi-chart-line" className="p-button-lg bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700" />
                                    </Link>
                                )}
                                <Button
                                    label="Learn More"
                                    icon="pi pi-info-circle"
                                    className="p-button-lg p-button-outlined border-blue-600 text-blue-600 hover:bg-blue-50"
                                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                />
                            </div>

                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-center text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Products</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">1000+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Orders</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div id="features" className="w-full bg-white dark:bg-gray-800 py-16">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                Key Features
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                SmartShop management system provides comprehensive features for operating smart home stores
                            </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 h-[280px] w-[320px] mx-auto">
                                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <i className="pi pi-shopping-cart text-2xl text-blue-600 dark:text-blue-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                                    Product Management
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                    Manage inventory, add/edit/delete smart home products, track stock levels
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 h-[280px] w-[320px] mx-auto">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                    <i className="pi pi-chart-line text-2xl text-green-600 dark:text-green-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                                    Reports & Analytics
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                    Track revenue, analyze sales trends and business performance
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 h-[280px] w-[320px] mx-auto">
                                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                                    <i className="pi pi-users text-2xl text-purple-600 dark:text-purple-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                                    Customer Management
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                    Manage customer information, purchase history and customer care
                                    </p>
                                </div>

                                {/* <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-white dark:bg-gray-700 hover:shadow-lg transition-shadow duration-300 h-[280px] w-[320px] mx-auto">
                                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                                    <i className="pi pi-truck text-2xl text-yellow-600 dark:text-yellow-400"></i>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                                    Supplier Management
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                    Manage suppliers, track deliveries, and ensure smooth restocking
                                    </p>
                                </div> */}
                            </div>
                        </div>
                    </div>




                    {/* Footer */}
                    <div className="w-full bg-gray-50 dark:bg-gray-900 py-8">
                        <div className="max-w-7xl mx-auto px-6 text-center">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2">
                                    <a href={route('welcome')}>
                                        <i className="pi pi-home text-white"></i>
                                    </a>
                                </div>
                                {/* <span className="text-xl font-bold text-gray-800 dark:text-white">
                                    Smart<span className="text-blue-600">Shop</span>
                                </span> */}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                © 2025 SmartShop. Professional smart home store management system.
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                                Laravel v{laravelVersion} | PHP v{phpVersion}
                            </p>
                        </div>
                    </div>
                </div>
            </LayoutProvider>
        </PrimeReactProvider>
    );
}

