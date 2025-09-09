import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/shop/login');
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-xl font-bold mb-4">Customer Login</h1>
            <form onSubmit={submit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="border w-full p-2 mb-2"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    className="border w-full p-2 mb-2"
                />
                {errors.email && <div className="text-red-500">{errors.email}</div>}
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Login
                </button>
            </form>
        </div>
    );
}
