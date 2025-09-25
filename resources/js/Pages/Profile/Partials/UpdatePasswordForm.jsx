import { useRef } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { InputText } from 'primereact/inputtext';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <section className={className}>
            <header className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Ensure your account is using a long, random password to stay secure.
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-4">
                <div>
                    <label className="block text-900 font-medium mb-2">Current Password</label>
                    <InputText
                        id="current_password"
                        type="password"
                        placeholder="Current Password"
                        className={`w-full ${errors.current_password ? 'p-invalid' : ''}`}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                    />
                    <InputError message={errors.current_password} />
                </div>

                <div>
                    <label className="block text-900 font-medium mb-2">New Password</label>
                    <InputText
                        id="password"
                        ref={passwordInput}
                        type="password"
                        placeholder="New Password"
                        className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} />
                </div>

                <div>
                    <label className="block text-900 font-medium mb-2">Confirm Password</label>
                    <InputText
                        id="password_confirmation"
                        type="password"
                        placeholder="Confirm Password"
                        className={`w-full ${errors.password_confirmation ? 'p-invalid' : ''}`}
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
