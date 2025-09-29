import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

export default function ShowEmployee({ auth, employee }) {
    const cardHeader = (
        <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-id-card text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Employee Details</h2>
                <p className="text-gray-600 m-0 mt-1">View employee information</p>
            </div>
        </div>
    );

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="View Employee" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-fit mx-auto">
                        <Card className="shadow-3" header={cardHeader}>
                            <form className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="field">
                                            <label htmlFor="name" className="block font-medium mb-2">
                                                Full Name
                                            </label>
                                            <InputText
                                                id="name"
                                                value={employee.name}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>

                                        <div className="field">
                                            <label htmlFor="email" className="block font-medium mb-2">
                                                Email
                                            </label>
                                            <InputText
                                                id="email"
                                                type="email"
                                                value={employee.email}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="field">
                                            <label htmlFor="role" className="block font-medium mb-2">
                                                Role
                                            </label>
                                            <InputText
                                                id="role"
                                                value={employee.role}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>

                                        <div className="field">
                                            <label htmlFor="store" className="block font-medium mb-2">
                                                Store
                                            </label>
                                            <InputText
                                                id="store"
                                                value={employee.store?.name || employee.store_id || 'N/A'}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="field">
                                        <label className="block font-medium mb-2">Create Time</label>
                                        <InputText
                                            value={formatDateTime(employee.created_at)}
                                            className="w-full"
                                            disabled
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="block font-medium mb-2">Last Update</label>
                                        <InputText
                                            value={formatDateTime(employee.updated_at)}
                                            className="w-full"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex gap-3 justify-content-end">
                                    <Button
                                        type="button"
                                        label="Back"
                                        icon="pi pi-arrow-left"
                                        severity="secondary"
                                        onClick={() => window.history.back()}
                                        className="p-button-outlined"
                                    />
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
