import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Log in" />

            <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex overflow-auto">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-blue-600 to-indigo-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <img src="/images/logo/-dark.svg" alt="hyper" height={120} className="mb-8 mx-auto filter brightness-0 invert" />
                        <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1>
                        <p className="text-xl text-blue-100 leading-relaxed max-w-md">
                            Join thousands of users who trust our secure and reliable platform for their business needs.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-2xl">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <img src="/images/logo/-dark.svg" alt="hyper" height={80} className="mx-auto mb-4" />
                        </div>

                        {/* Welcome Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Welcome Back!</h2>
                            <p className="text-lg text-gray-600 mb-6">Sign in to access your account</p>
                            <div className="text-lg text-gray-600">
                                Don't have an account?
                                <Link href={route('register')} className="ml-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                    Create one now
                                </Link>
                            </div>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                                {status}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-8">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <InputText
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email address"
                                    className="w-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                                    style={{
                                        height: '3.5rem',
                                        fontSize: '1.125rem',
                                        padding: '0 1rem'
                                    }}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
                                    Password
                                </label>
                                <InputText
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    className="w-full border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-colors"
                                    style={{
                                        height: '3.5rem',
                                        fontSize: '1.125rem',
                                        padding: '0 1rem'
                                    }}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between py-2">
                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        inputId="rememberme-login"
                                        onChange={(e) => setData('remember', e.checked)}
                                        checked={data.remember}
                                    />
                                    <label htmlFor="rememberme-login" className="text-lg text-gray-700 cursor-pointer">
                                        Remember me
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-lg text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                label="Sign In"
                                className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 text-white font-semibold text-xl transition-colors"
                                style={{ height: '3.5rem' }}
                                loading={processing}
                            />
                        </form>

                        {/* Additional Options */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}