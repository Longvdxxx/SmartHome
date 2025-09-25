import { useForm, Link } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/shop/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Customer Sign Up</h1>
                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
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
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        {processing ? 'Signing up...' : 'Sign Up'}
                    </button>
                </form>
                <div className="text-center mt-4 text-sm">
                    Already have an account?{' '}
                    <Link href="/shop/login" className="text-blue-600 hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
