import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, useForm } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <>
            <Head title="Confirm Password" />

            <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-orange-50 to-red-100 flex overflow-auto">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-orange-600 to-red-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8 mx-auto">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">Secure Area</h1>
                        <p className="text-xl text-orange-100 leading-relaxed max-w-md">
                            This is a protected area. Please confirm your password to verify your identity and continue.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/3 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                </div>

                {/* Right Side - Confirmation Form */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-lg">
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        {/* Header Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Confirm Password</h2>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-amber-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <p className="text-amber-800 text-sm leading-relaxed">
                                        This is a secure area of the application. Please confirm your password before continuing.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Form */}
                        <form onSubmit={submit} className="space-y-8">
                            {/* Password Field */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
                                    Current Password
                                </label>
                                <InputText
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your current password"
                                    className="w-full border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-colors"
                                    style={{
                                        height: '3.5rem',
                                        fontSize: '1.125rem',
                                        padding: '0 1rem'
                                    }}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoFocus
                                />
                                <InputError message={errors.password} className="text-red-600" />
                            </div>

                            {/* Confirm Button */}
                            <div className="flex justify-end">
                                <PrimaryButton
                                    className="bg-orange-600 hover:bg-orange-700 border-orange-600 hover:border-orange-700 text-white font-semibold text-lg px-8 transition-colors"
                                    style={{ height: '3.5rem', minWidth: '150px' }}
                                    disabled={processing}
                                >
                                    {processing ? 'Confirming...' : 'Confirm'}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Security Note */}
                        <div className="mt-8 text-center">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-blue-800 text-sm">
                                        We use this extra step to keep your account secure
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Back Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                <a href={route('dashboard')} className="text-orange-600 hover:text-orange-800 font-medium transition-colors">
                                    ← Back to Dashboard
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}