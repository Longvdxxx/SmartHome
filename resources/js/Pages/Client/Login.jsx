import { useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/shop/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Customer Login</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        {processing ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="flex justify-between items-center mt-4 text-sm">
                    <Link href="/shop/register" className="text-blue-600 hover:underline">
                        Create account
                    </Link>
                    <Link href="/shop/forgot-password" className="text-blue-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
