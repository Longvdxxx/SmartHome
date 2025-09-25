import { useRef, useState } from 'react';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => setConfirmingUserDeletion(true);

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={className}>
            <header className="mb-4">
                <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                    Please download any data you wish to keep.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton>

            <Dialog
                header="Confirm Account Deletion"
                visible={confirmingUserDeletion}
                style={{ width: '40vw' }}
                onHide={closeModal}
            >
                <form onSubmit={deleteUser} className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Please enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div>
                        <InputText
                            id="password"
                            type="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <SecondaryButton type="button" onClick={closeModal}>
                            Cancel
                        </SecondaryButton>
                        <DangerButton disabled={processing}>Delete</DangerButton>
                    </div>
                </form>
            </Dialog>
        </section>
    );
}
