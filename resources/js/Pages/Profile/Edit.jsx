import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Profile
                </h2>
            }
        >
            <Head title="Edit Profile" />

            <div className="max-w-4xl mx-auto py-10 space-y-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="w-full"
                    />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <UpdatePasswordForm className="w-full" />
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <DeleteUserForm className="w-full" />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
