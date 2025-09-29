import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';

export default function EditEmployee({ employee, stores = [] }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: employee.name || '',
        email: employee.email || '',
        role: employee.role || '',
        store_id: employee.store_id || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);

        put(route('employees.update', employee.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Employee updated successfully!',
                });
                setLoading(false);
            },
            onError: () => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please check the form for errors',
                });
                setLoading(false);
            },
        });
    };

    const cardHeader = (
        <div className="flex items-center gap-4 p-4">
            <div className="bg-yellow-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-user-edit text-yellow-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Employee</h2>
                <p className="text-gray-600 m-0 mt-1">Update employee information</p>
            </div>
        </div>
    );

    const roleOptions = [
        { label: 'Cashier', value: 'cashier' },
        { label: 'Stock', value: 'stock' },
        { label: 'Manager', value: 'manager' },
    ];

    return (
        <>
            <Head title="Edit Employee" />
            <Toast ref={toast} />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-fit mx-auto">
                        <Card className="shadow-3" header={cardHeader}>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Basic Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="field">
                                            <label htmlFor="name" className="block font-medium mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                                placeholder="Enter full name"
                                            />
                                            {errors.name && <small className="p-error">{errors.name}</small>}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="email" className="block font-medium mb-2">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && <small className="p-error">{errors.email}</small>}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="field">
                                            <label htmlFor="role" className="block font-medium mb-2">
                                                Role <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                id="role"
                                                value={data.role}
                                                options={roleOptions}
                                                onChange={(e) => setData('role', e.value)}
                                                placeholder="Select role"
                                                className={`w-full ${errors.role ? 'p-invalid' : ''}`}
                                            />
                                            {errors.role && <small className="p-error">{errors.role}</small>}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="store_id" className="block font-medium mb-2">
                                                Store <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                id="store_id"
                                                value={data.store_id}
                                                options={stores.map(s => ({ label: s.name, value: s.id }))}
                                                onChange={(e) => setData('store_id', e.value)}
                                                placeholder="Select store"
                                                className={`w-full ${errors.store_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.store_id && (
                                                <small className="p-error">{errors.store_id}</small>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Security</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="field">
                                            <label htmlFor="password" className="block font-medium mb-2">
                                                Password (leave blank to keep current)
                                            </label>
                                            <Password
                                                id="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                                toggleMask
                                                feedback={false}
                                                placeholder="Enter new password"
                                            />
                                            {errors.password && (
                                                <small className="p-error">{errors.password}</small>
                                            )}
                                        </div>

                                        <div className="field">
                                            <label htmlFor="password_confirmation" className="block font-medium mb-2">
                                                Confirm Password
                                            </label>
                                            <Password
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className={`w-full ${errors.password_confirmation ? 'p-invalid' : ''}`}
                                                toggleMask
                                                feedback={false}
                                                placeholder="Confirm new password"
                                            />
                                            {errors.password_confirmation && (
                                                <small className="p-error">{errors.password_confirmation}</small>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div className="flex gap-3 justify-content-end">
                                    <Button
                                        type="button"
                                        label="Cancel"
                                        icon="pi pi-times"
                                        severity="secondary"
                                        onClick={() => window.history.back()}
                                        className="p-button-outlined"
                                    />
                                    <Button
                                        type="submit"
                                        label="Update Employee"
                                        icon="pi pi-check"
                                        loading={loading || processing}
                                        className="p-button-primary"
                                    />
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
