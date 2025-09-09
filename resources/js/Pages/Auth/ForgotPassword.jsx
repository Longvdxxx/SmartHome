import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />

            <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex overflow-auto">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-purple-600 to-pink-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <img src="/images/logo/-dark.svg" alt="hyper" height={120} className="mb-8 mx-auto filter brightness-0 invert" />
                        <h1 className="text-5xl font-bold mb-6">Reset Your Password</h1>
                        <p className="text-xl text-purple-100 leading-relaxed max-w-md">
                            Don't worry! It happens to the best of us. Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                </div>

                {/* Right Side - Reset Form */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-xl">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <img src="/images/logo/-dark.svg" alt="hyper" height={80} className="mx-auto mb-4" />
                        </div>

                        {/* Welcome Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Forgot Password?</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                                No problem! Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                                {status}
                            </div>
                        )}

                        {/* Reset Form */}
                        <form onSubmit={submit} className="space-y-8">
                            {/* Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors"
                                    style={{
                                        height: '3.5rem',
                                        fontSize: '1.125rem',
                                        padding: '0 1rem'
                                    }}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="text-red-600" />
                            </div>

                            {/* Send Reset Link Button */}
                            <PrimaryButton
                                className="w-full bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-white font-semibold text-xl transition-colors"
                                style={{ height: '3.5rem' }}
                                disabled={processing}
                            >
                                {processing ? 'Sending...' : 'Send Reset Link'}
                            </PrimaryButton>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-lg">
                                Remember your password?
                                <a href={route('login')} className="ml-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                                    Back to Login
                                </a>
                            </p>
                        </div>

                        {/* Additional Info */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-500 text-sm">
                                Check your spam folder if you don't receive the email within a few minutes.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}