import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function CreateOrder({ customers }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: '',
        status: '',
        total_price: '',
    });

    const statusOptions = [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
    ];

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);

        post(route('orders.store'), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order created successfully!'
                });
                reset();
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
            <div className="bg-blue-100 p-3 rounded-xl">
                <i className="pi pi-plus text-blue-500 text-2xl"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Create New Order</h2>
                <p className="text-gray-600 m-0 mt-1">Add a new order to the system</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Create Order" />
            <Toast ref={toast} />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Order Information Section */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <i className="pi pi-info-circle text-blue-500"></i>
                                            Order Information
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Customer */}
                                            <div className="field">
                                                <label htmlFor="customer_id" className="block text-900 font-medium mb-2">
                                                    Customer <span className="text-red-500">*</span>
                                                </label>
                                                <Dropdown
                                                    id="customer_id"
                                                    value={data.customer_id}
                                                    options={customers.map(c => ({ label: c.name, value: c.id }))}
                                                    onChange={(e) => setData('customer_id', e.value)}
                                                    className={`w-full ${errors.customer_id ? 'p-invalid' : ''}`}
                                                    placeholder="Select customer"
                                                    filter
                                                />
                                                {errors.customer_id && (
                                                    <small className="p-error block mt-1">{errors.customer_id}</small>
                                                )}
                                            </div>

                                            {/* Status */}
                                            <div className="field">
                                                <label htmlFor="status" className="block text-900 font-medium mb-2">
                                                    Status <span className="text-red-500">*</span>
                                                </label>
                                                <Dropdown
                                                    id="status"
                                                    value={data.status}
                                                    options={statusOptions}
                                                    onChange={(e) => setData('status', e.value)}
                                                    className={`w-full ${errors.status ? 'p-invalid' : ''}`}
                                                    placeholder="Select status"
                                                />
                                                {errors.status && (
                                                    <small className="p-error block mt-1">{errors.status}</small>
                                                )}
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div className="field mt-4">
                                            <label htmlFor="total_price" className="block text-900 font-medium mb-2">
                                                Total Price <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="total_price"
                                                type="number"
                                                value={data.total_price}
                                                onChange={(e) => setData('total_price', e.target.value)}
                                                className={`w-full ${errors.total_price ? 'p-invalid' : ''}`}
                                                placeholder="Enter total price"
                                            />
                                            {errors.total_price && (
                                                <small className="p-error block mt-1">{errors.total_price}</small>
                                            )}
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 justify-end">
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
                                            label="Create Order"
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
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i className="pi pi-lightbulb text-yellow-500"></i>
                                    Tips
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-2 pl-0 list-none">
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Ensure the customer exists before creating an order
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Status should reflect the current state of the order
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Total price must be a valid number
                                    </li>
                                </ul>
                            </Card>

                            <Card className="shadow-3">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <i className="pi pi-cog text-gray-500"></i>
                                    Actions
                                </h3>
                                <div className="space-y-2">
                                    <Button
                                        label="View All Orders"
                                        icon="pi pi-list"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => window.location.href = route('orders.index')}
                                    />
                                    <Button
                                        label="Reset Form"
                                        icon="pi pi-refresh"
                                        severity="secondary"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => reset()}
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
