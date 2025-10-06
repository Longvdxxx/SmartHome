import EmployeeLayout from '@/Layouts/EmployeeLayout';
import { Head } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

export default function Show({ auth, employee }) {
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
        <EmployeeLayout user={auth.user}>
            <Head title="View Employee" />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-fit mx-auto">
                    <Card className="shadow-3" title="Employee Details">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label>Full Name</label>
                                    <InputText value={employee.name} className="w-full" disabled />
                                </div>
                                <div>
                                    <label>Email</label>
                                    <InputText value={employee.email} className="w-full" disabled />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label>Role</label>
                                    <InputText value={employee.role} className="w-full" disabled />
                                </div>
                                <div>
                                    <label>Store</label>
                                    <InputText value={employee.store?.name || 'N/A'} className="w-full" disabled />
                                </div>
                            </div>
                            <Divider />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label>Created</label>
                                    <InputText value={formatDateTime(employee.created_at)} className="w-full" disabled />
                                </div>
                                <div>
                                    <label>Updated</label>
                                    <InputText value={formatDateTime(employee.updated_at)} className="w-full" disabled />
                                </div>
                            </div>
                            <Divider />
                            <div className="flex justify-end">
                                <Button label="Back" icon="pi pi-arrow-left" severity="secondary" className="p-button-outlined" onClick={() => window.history.back()} />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </EmployeeLayout>
    );
}
