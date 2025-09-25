import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';

export default function Edit({ user }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        role: user.role || '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);

        put(route('users.update', user.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User updated successfully!'
                });
                setLoading(false);
            },
            onError: () => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please check the form for errors'
                });
                setLoading(false);
            }
        });
    };

    const passwordFooter = (
        <>
            <Divider />
            <p className="mt-2 text-sm text-gray-600">Password requirements:</p>
            <ul className="pl-4 mt-1 text-xs text-gray-500 list-disc">
                <li>At least 8 characters</li>
                <li>Leave blank to keep current password</li>
                <li>Must be confirmed if changing</li>
            </ul>
        </>
    );

    const cardHeader = (
        <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-user-edit text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit User</h2>
                <p className="text-gray-600 m-0 mt-1">Update user information</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit User" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex align-items-center gap-2">
                                            <i className="pi pi-info-circle text-blue-500"></i>
                                            Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="field">
                                                <label htmlFor="name" className="block text-900 font-medium mb-2">
                                                    Full Name <span className="text-red-500">*</span>
                                                </label>
                                                <InputText
                                                    id="name"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                                    placeholder="Enter full name"
                                                />
                                                {errors.name && (
                                                    <small className="p-error block mt-1">{errors.name}</small>
                                                )}
                                            </div>
                                            <div className="field">
                                                <label htmlFor="phone_number" className="block text-900 font-medium mb-2">
                                                    Phone Number
                                                </label>
                                                <InputText
                                                    id="phone_number"
                                                    value={data.phone_number}
                                                    onChange={(e) => setData('phone_number', e.target.value)}
                                                    className={`w-full ${errors.phone_number ? 'p-invalid' : ''}`}
                                                    placeholder="Enter phone number"
                                                />
                                                {errors.phone_number && (
                                                    <small className="p-error block mt-1">{errors.phone_number}</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div className="field">
                                                <label htmlFor="email" className="block text-900 font-medium mb-2">
                                                    Email Address <span className="text-red-500">*</span>
                                                </label>
                                                <InputText
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className={`w-full ${errors.email ? 'p-invalid' : ''}`}
                                                    placeholder="Enter email address"
                                                />
                                                {errors.email && (
                                                    <small className="p-error block mt-1">{errors.email}</small>
                                                )}
                                            </div>
                                            <div className="field">
                                                <label htmlFor="role" className="block text-900 font-medium mb-2">
                                                    Role <span className="text-red-500">*</span>
                                                </label>
                                                <Dropdown
                                                    id="role"
                                                    value={data.role}
                                                    onChange={(e) => setData('role', e.value)}
                                                    options={[
                                                        { label: 'Admin', value: 'admin' },
                                                        { label: 'User', value: 'user' },
                                                    ]}
                                                    placeholder="Select role"
                                                    className={`w-full border border-gray-300 rounded-md ${errors.role ? 'p-invalid' : ''}`}
                                                />
                                                {errors.role && (
                                                    <small className="p-error block mt-1">{errors.role}</small>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex align-items-center gap-2">
                                            <i className="pi pi-shield text-green-500"></i>
                                            Change Password (Optional)
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="field">
                                                <label htmlFor="password" className="block text-900 font-medium mb-2">
                                                    New Password
                                                </label>
                                                <Password
                                                    id="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className={`w-full ${errors.password ? 'p-invalid' : ''}`}
                                                    toggleMask
                                                    footer={passwordFooter}
                                                    promptLabel="Enter a password"
                                                    weakLabel="Weak"
                                                    mediumLabel="Medium"
                                                    strongLabel="Strong"
                                                    placeholder="Leave blank to keep current password"
                                                />
                                                {errors.password && (
                                                    <small className="p-error block mt-1">{errors.password}</small>
                                                )}
                                            </div>
                                            <div className="field">
                                                <label htmlFor="password_confirmation" className="block text-900 font-medium mb-2">
                                                    Confirm New Password
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
                                                    <small className="p-error block mt-1">{errors.password_confirmation}</small>
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
                                            label="Update User"
                                            icon="pi pi-check"
                                            loading={loading || processing}
                                            className="p-button-primary"
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>
                        <div className="lg:col-span-1">
                            <Card className="shadow-3 mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex align-items-center gap-2">
                                    <i className="pi pi-lightbulb text-yellow-500"></i>
                                    Tips
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-2 pl-0 list-none">
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Leave password fields blank to keep current password
                                    </li>
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Email address must be unique in the system
                                    </li>
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Changes will be saved immediately
                                    </li>
                                </ul>
                            </Card>
                            <Card className="shadow-3">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex align-items-center gap-2">
                                    <i className="pi pi-cog text-gray-500"></i>
                                    Actions
                                </h3>
                                <div className="space-y-2">
                                    <Button
                                        label="View All Users"
                                        icon="pi pi-list"
                                        className="w-full p-button-outlined p-button-sm !mt-2"
                                        onClick={() => window.location.href = route('users.index')}
                                    />
                                    <Button
                                        label="Reset Form"
                                        icon="pi pi-refresh"
                                        severity="secondary"
                                        className="w-full p-button-outlined p-button-sm !mt-2"
                                        style={{ marginTop: '10px' }}
                                        onClick={() => reset()}
                                    />
                                    <Button
                                        label="View User"
                                        icon="pi pi-eye"
                                        severity="info"
                                        className="w-full p-button-outlined p-button-sm !mt-2"
                                        style={{ marginTop: '10px' }}
                                        onClick={() => window.location.href = route('users.show', user.id)}
                                    />
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
