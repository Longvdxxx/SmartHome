import { useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function EditCustomer({ customer }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);

        put(route('customers.update', customer.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Customer updated successfully!'
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

    const cardHeader = (
        <div className="flex align-items-start gap-3 pb-3">
            <div className="bg-blue-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-user-edit text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Customer</h2>
                <p className="text-gray-600 m-0 mt-1">Update customer information</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Customer" />
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
                                            <label htmlFor="phone" className="block font-medium mb-2">
                                                Phone
                                            </label>
                                            <InputText
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone && <small className="p-error">{errors.phone}</small>}
                                        </div>
                                    </div>

                                    <div className="field mt-4">
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
                                        label="Update Customer"
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
