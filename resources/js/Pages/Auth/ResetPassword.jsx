import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { InputText } from 'primereact/inputtext';
import InputError from '@/Components/InputError';
import { Button } from 'primereact/button';

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
            <Head title="SmartShop - Reset Password" />

            <div className="flex min-h-screen bg-gray-50">
                <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 relative bg-gradient-to-br from-green-500 to-blue-600 text-white">
                    <div className="relative z-10 flex flex-col justify-center items-center text-center p-12">
                        <h1 className="text-5xl font-extrabold mb-4 tracking-wide">SmartShop</h1>
                        <p className="text-lg text-green-100 max-w-md leading-relaxed">
                            Secure your account with a strong password and continue enjoying SmartShop.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-8">
                    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                        <div className="lg:hidden text-center mb-6">
                            <h1 className="text-3xl font-bold text-green-600">SmartShop</h1>
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                            <p className="text-gray-600">Enter your email and set a new password</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <InputText
                                    id="email"
                                    type="email"
                                    className="w-full mt-1 border-gray-300 bg-gray-100"
                                    style={{ height: '3rem' }}
                                    value={data.email}
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <InputText
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    className="w-full mt-1 border-gray-300"
                                    style={{ height: '3rem' }}
                                    value={data.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <InputText
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirm new password"
                                    className="w-full mt-1 border-gray-300"
                                    style={{ height: '3rem' }}
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button
                                type="submit"
                                label="Reset Password"
                                className="w-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white font-semibold text-lg transition-colors"
                                style={{ height: '3rem' }}
                                loading={processing}
                            />
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                <a href={route('login')} className="text-green-600 hover:text-green-800 font-medium transition-colors">
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
