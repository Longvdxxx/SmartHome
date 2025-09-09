import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <>
            <Head title="Reset Password" />

            <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex overflow-auto">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-teal-600 to-cyan-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8 mx-auto">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">New Password</h1>
                        <p className="text-xl text-teal-100 leading-relaxed max-w-md">
                            You're almost done! Create a strong new password to secure your account and regain access.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-28 h-28 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/3 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                </div>

                {/* Right Side - Reset Form */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-2xl">
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-10 h-10 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                        </div>

                        {/* Header Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Reset Your Password</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-blue-800 text-lg">
                                    Enter your email address and create a strong new password below.
                                </p>
                            </div>
                        </div>

                        {/* Reset Password Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="w-full border-2 border-gray-200 hover:border-teal-300 focus:border-teal-500 transition-colors bg-gray-50"
                                    style={{
                                        height: '3.5rem',
                                        fontSize: '1.125rem',
                                        padding: '0 1rem'
                                    }}
                                    autoComplete="username"
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="text-red-600" />
                            </div>

                            {/* Password Fields Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* New Password Field */}
                                <div className="space-y-3">
                                    <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
                                        New Password
                                    </label>
                                    <InputText
                                        id="password"
                                        type="password"
                                        placeholder="Enter new password"
                                        className="w-full border-2 border-gray-200 hover:border-teal-300 focus:border-teal-500 transition-colors"
                                        style={{
                                            height: '3.5rem',
                                            fontSize: '1.125rem',
                                            padding: '0 1rem'
                                        }}
                                        value={data.password}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <InputError message={errors.password} className="text-red-600" />
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-3">
                                    <label htmlFor="password_confirmation" className="block text-lg font-semibold text-gray-700">
                                        Confirm Password
                                    </label>
                                    <InputText
                                        id="password_confirmation"
                                        type="password"
                                        placeholder="Confirm new password"
                                        className="w-full border-2 border-gray-200 hover:border-teal-300 focus:border-teal-500 transition-colors"
                                        style={{
                                            height: '3.5rem',
                                            fontSize: '1.125rem',
                                            padding: '0 1rem'
                                        }}
                                        value={data.password_confirmation}
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <InputError message={errors.password_confirmation} className="text-red-600" />
                                </div>
                            </div>

                            {/* Password Requirements */}
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Password Requirements:</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        At least 8 characters long
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Include uppercase and lowercase letters
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Include at least one number or symbol
                                    </li>
                                </ul>
                            </div>

                            {/* Reset Button */}
                            <div className="pt-4">
                                <PrimaryButton
                                    className="w-full bg-teal-600 hover:bg-teal-700 border-teal-600 hover:border-teal-700 text-white font-semibold text-xl transition-colors"
                                    style={{ height: '3.5rem' }}
                                    disabled={processing}
                                >
                                    {processing ? 'Resetting Password...' : 'Reset Password'}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Security Note */}
                        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-800 text-sm">
                                    After resetting, you'll be automatically signed in to your account with your new password.
                                </p>
                            </div>
                        </div>

                        {/* Back to Login */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                <a href={route('login')} className="text-teal-600 hover:text-teal-800 font-medium transition-colors">
                                    ← Back to Login
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}