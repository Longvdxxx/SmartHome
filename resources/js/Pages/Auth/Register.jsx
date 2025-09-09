import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, useForm } from '@inertiajs/react';
import { InputText } from "primereact/inputtext";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
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
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />

            <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex overflow-auto">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 bg-gradient-to-br from-green-600 to-emerald-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    <div className="relative z-10 text-center">
                        <img src="/images/logo/-dark.svg" alt="hyper" height={120} className="mb-8 mx-auto filter brightness-0 invert" />
                        <h1 className="text-5xl font-bold mb-6">Join Our Platform</h1>
                        <p className="text-xl text-green-100 leading-relaxed max-w-md">
                            Create your account and start your journey with us. Join thousands of satisfied users today.
                        </p>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-20 right-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute top-1/2 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
                    <div className="absolute bottom-1/3 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-2xl">
                        {/* Mobile Logo */}
                        <div className="lg:hidden text-center mb-8">
                            <img src="/images/logo/-dark.svg" alt="hyper" height={80} className="mx-auto mb-4" />
                        </div>

                        {/* Header Section */}
                        <div className="text-center mb-10">
                            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Create Account</h2>
                            <p className="text-lg text-gray-600 mb-6">
                                Join us today and experience the difference
                            </p>
                            <div className="text-lg text-gray-600">
                                Already have an account?
                                <Link href={route('login')} className="ml-2 text-green-600 font-semibold hover:text-green-800 transition-colors">
                                    Sign in here
                                </Link>
                            </div>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-3">
                                <label htmlFor="name" className="block text-lg font-semibold text-gray-700">
                                    Full Name
                                </label>
                                <InputText
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                    style={{
                                        height: '3.5rem',
                                        fontSize: '1.125rem',
                                        padding: '0 1rem'
                                    }}
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="text-red-600" />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors"
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

                            {/* Password Fields Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Password Field */}
                                <div className="space-y-3">
                                    <label htmlFor="password" className="block text-lg font-semibold text-gray-700">
                                        Password
                                    </label>
                                    <InputText
                                        id="password"
                                        type="password"
                                        placeholder="Enter password"
                                        className="w-full border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                        style={{
                                            height: '3.5rem',
                                            fontSize: '1.125rem',
                                            padding: '0 1rem'
                                        }}
                                        value={data.password}
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
                                        placeholder="Confirm password"
                                        className="w-full border-2 border-gray-200 hover:border-green-300 focus:border-green-500 transition-colors"
                                        style={{
                                            height: '3.5rem',
                                            fontSize: '1.125rem',
                                            padding: '0 1rem'
                                        }}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                    />
                                    <InputError message={errors.password_confirmation} className="text-red-600" />
                                </div>
                            </div>

                            {/* Register Button */}
                            <div className="pt-4">
                                <PrimaryButton
                                    className="w-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white font-semibold text-xl transition-colors"
                                    style={{ height: '3.5rem' }}
                                    disabled={processing}
                                >
                                    {processing ? 'Creating Account...' : 'Create Account'}
                                </PrimaryButton>
                            </div>
                        </form>

                        {/* Terms & Privacy */}
                        <div className="mt-8 text-center">
                            <p className="text-gray-500 text-sm leading-relaxed">
                                By creating an account, you agree to our
                                <a href="#" className="text-green-600 hover:text-green-800 mx-1">Terms of Service</a>
                                and
                                <a href="#" className="text-green-600 hover:text-green-800 mx-1">Privacy Policy</a>
                            </p>
                        </div>

                        {/* Benefits Section */}
                        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-green-800 mb-3 text-center">Why Join Us?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-700">
                                <div className="text-center">
                                    <div className="font-medium">✓ Free Forever</div>
                                    <div>No hidden costs</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">✓ Secure & Safe</div>
                                    <div>Your data is protected</div>
                                </div>
                                <div className="text-center">
                                    <div className="font-medium">✓ 24/7 Support</div>
                                    <div>We're here to help</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}