import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function Edit({ store }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: store.name || '',
        address: store.address || '',
        phone: store.phone || '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        put(route('stores.update', store.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Store updated successfully!'
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
        <div className="flex items-center gap-4 p-4">
            <div className="bg-blue-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-building text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Store</h2>
                <p className="text-gray-600 m-0 mt-1">Update store information</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Store" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex align-items-center gap-2">
                                            <i className="pi pi-info-circle text-blue-500"></i>
                                            Basic Information
                                        </h3>

                                        {/* Name */}
                                        <div className="field mb-4">
                                            <label htmlFor="name" className="block text-900 font-medium mb-2">
                                                Store Name <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                                placeholder="Enter store name"
                                            />
                                            {errors.name && (
                                                <small className="p-error block mt-1">{errors.name}</small>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div className="field mb-4">
                                            <label htmlFor="address" className="block text-900 font-medium mb-2">
                                                Address
                                            </label>
                                            <InputText
                                                id="address"
                                                value={data.address}
                                                onChange={(e) => setData('address', e.target.value)}
                                                className={`w-full ${errors.address ? 'p-invalid' : ''}`}
                                                placeholder="Enter store address"
                                            />
                                            {errors.address && (
                                                <small className="p-error block mt-1">{errors.address}</small>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div className="field mb-4">
                                            <label htmlFor="phone" className="block text-900 font-medium mb-2">
                                                Phone
                                            </label>
                                            <InputText
                                                id="phone"
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                className={`w-full ${errors.phone ? 'p-invalid' : ''}`}
                                                placeholder="Enter phone number"
                                            />
                                            {errors.phone && (
                                                <small className="p-error block mt-1">{errors.phone}</small>
                                            )}
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Action Buttons */}
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
                                            label="Update Store"
                                            icon="pi pi-check"
                                            loading={loading || processing}
                                            className="p-button-primary"
                                        />
                                    </div>
                                </form>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <Card className="shadow-3 mb-4">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex align-items-center gap-2">
                                    <i className="pi pi-lightbulb text-yellow-500"></i>
                                    Tips
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-2 pl-0 list-none">
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Store name is required
                                    </li>
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-phone text-green-500 mt-1"></i>
                                        Phone number should be valid
                                    </li>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
