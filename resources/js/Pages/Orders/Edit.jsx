import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function EditOrder({ order, customers }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        customer_id: order.customer_id || '',
        status: order.status || '',
        total_price: order.total_price || '',
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

        put(route('orders.update', order.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order updated successfully!'
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
                <i className="pi pi-pencil text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Order</h2>
                <p className="text-gray-600 m-0 mt-1">Update order details</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Order" />
            <Toast ref={toast} />

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-fit mx-auto">
                        <Card className="shadow-3" header={cardHeader}>
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Order Information
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Customer */}
                                        <div className="field">
                                            <label htmlFor="customer_id" className="block font-medium mb-2">
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
                                            {errors.customer_id && <small className="p-error">{errors.customer_id}</small>}
                                        </div>

                                        {/* Status */}
                                        <div className="field">
                                            <label htmlFor="status" className="block font-medium mb-2">
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
                                            {errors.status && <small className="p-error">{errors.status}</small>}
                                        </div>
                                    </div>

                                    {/* Total Price */}
                                    <div className="field mt-4">
                                        <label htmlFor="total_price" className="block font-medium mb-2">
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
                                        {errors.total_price && <small className="p-error">{errors.total_price}</small>}
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
                                        label="Update Order"
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
