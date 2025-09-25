import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { InputText } from 'primereact/inputtext';

export default function UpdateProfileInformation({ mustVerifyEmail, status, className = '' }) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile information, email address, and phone number.
                </p>
            </header>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-900 font-medium mb-2">Name</label>
                    <InputText
                        id="name"
                        type="text"
                        placeholder="Name"
                        className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>

                <div>
                    <label className="block text-900 font-medium mb-2">Email</label>
                    <InputText
                        id="email"
                        type="email"
                        placeholder="Email address"
                        className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>

                <div>
                    <label className="block text-900 font-medium mb-2">Phone Number</label>
                    <InputText
                        id="phone"
                        type="text"
                        placeholder="Phone number"
                        className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <InputError message={errors.phone} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="text-sm text-gray-800">
                        Your email address is unverified.{' '}
                        <Link
                            href={route('verification.send')}
                            method="post"
                            as="button"
                            className="underline text-sm text-gray-600 hover:text-gray-900"
                        >
                            Click here to re-send the verification email.
                        </Link>
                        {status === 'verification-link-sent' && (
                            <div className="mt-2 font-medium text-sm text-green-600">
                                A new verification link has been sent to your email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
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
