import { Head, Link, useForm } from '@inertiajs/react';
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import InputError from '@/Components/InputError';

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
            <Head title="SmartShop - Forgot Password" />

            <div className="flex min-h-screen bg-gray-50">
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative bg-gradient-to-br from-green-500 to-blue-600 text-white">
                    <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
                        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">SmartShop</h1>
                        <p className="text-lg text-green-100 max-w-md leading-relaxed">
                            Bring the future to your home with SmartShop.
                            Discover smart devices, automation, and security solutions tailored for modern living.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                        <div className="lg:hidden text-center mb-6">
                            <h1 className="text-3xl font-bold text-green-600">SmartShop</h1>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                            <p className="text-gray-600">Enter your email and we will send you a reset link</p>
                        </div>

                        {status && (
                            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full mt-1 border-gray-300"
                                    style={{ height: '3rem' }}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                label={processing ? "Sending..." : "Send Reset Link"}
                                className="w-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white font-semibold text-lg transition-colors"
                                style={{ height: '3rem' }}
                                loading={processing}
                            />
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href={route('login')}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
