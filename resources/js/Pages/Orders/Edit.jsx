import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function EditOrder({ order, customers }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        status: order.status || '',
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
                    detail: 'Order status updated successfully!'
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
                <i className="pi pi-pencil text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Order</h2>
                <p className="text-gray-600 m-0 mt-1">Update order status only</p>
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

                                    {/* Customer - readonly */}
                                    <div className="field">
                                        <label className="block font-medium mb-2">
                                            Customer
                                        </label>
                                        <p className="p-2 border-round bg-gray-100">
                                            {customers.find(c => c.id === order.customer_id)?.name || 'N/A'}
                                        </p>
                                    </div>

                                    {/* Total Price - readonly */}
                                    <div className="field mt-3">
                                        <label className="block font-medium mb-2">
                                            Total Price
                                        </label>
                                        <p className="p-2 border-round bg-gray-100">
                                            ${order.total_price}
                                        </p>
                                    </div>

                                    {/* Status - editable */}
                                    <div className="field mt-3">
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
                                        label="Update Status"
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
