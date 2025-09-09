import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <>
            <Head title="Email Verification" />

            <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-amber-50 to-yellow-100 flex overflow-auto">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-amber-600 to-yellow-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-8 mx-auto">
                            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold mb-6">Check Your Email</h1>
                        <p className="text-xl text-amber-100 leading-relaxed max-w-md">
                            We've sent you a verification link to secure your account. Just one more step to get started!
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-28 h-28 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/3 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                </div>

                {/* Right Side - Verification Content */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-2xl">
                        {/* Mobile Header */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Header Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Verify Your Email</h2>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                <p className="text-blue-800 text-lg leading-relaxed">
                                    Thanks for signing up! Before getting started, please verify your email address by clicking on the link we just emailed to you.
                                </p>
                            </div>
                        </div>

                        {/* Success Message */}
                        {status === 'verification-link-sent' && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-800 font-medium">
                                        A new verification link has been sent to your email address!
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Instructions */}
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                What to do next:
                            </h3>
                            <ol className="text-gray-700 space-y-2 list-decimal list-inside">
                                <li>Check your email inbox (and spam folder)</li>
                                <li>Click the verification link in the email</li>
                                <li>You'll be automatically signed in to your account</li>
                            </ol>
                        </div>

                        {/* Email Troubleshooting */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
                            <h4 className="font-semibold text-amber-800 mb-3">Didn't receive the email?</h4>
                            <ul className="text-amber-700 text-sm space-y-1">
                                <li>• Check your spam or junk folder</li>
                                <li>• Make sure you entered the correct email address</li>
                                <li>• Wait a few minutes, emails can sometimes be delayed</li>
                                <li>• Click the button below to send another verification email</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <form onSubmit={submit} className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                                <PrimaryButton
                                    className="bg-amber-600 hover:bg-amber-700 border-amber-600 hover:border-amber-700 text-white font-semibold text-lg px-8 transition-colors"
                                    style={{ height: '3.5rem' }}
                                    disabled={processing}
                                >
                                    {processing ? 'Sending...' : 'Resend Verification Email'}
                                </PrimaryButton>

                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="text-gray-600 hover:text-gray-900 font-medium text-lg underline transition-colors"
                                >
                                    Log Out
                                </Link>
                            </div>
                        </form>

                        {/* Support */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-600 text-sm">
                                Still having trouble?
                                <a href="mailto:support@yourapp.com" className="ml-1 text-amber-600 hover:text-amber-800 font-medium">
                                    Contact our support team
                                </a>
                            </p>
                        </div>

                        {/* Security Note */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-blue-800 text-sm">
                                    Email verification helps keep your account secure and ensures we can reach you when needed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}