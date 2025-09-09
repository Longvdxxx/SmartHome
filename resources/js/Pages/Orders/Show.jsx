import { Head } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';

export default function ShowOrder({ order }) {
    const cardHeader = (
        <div className="flex align-items-start gap-3 pb-3">
            <div className="bg-blue-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-shopping-cart text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Order Details</h2>
                <p className="text-gray-600 m-0 mt-1">View order information</p>
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

    const statusTemplate = (status) => {
        const statusMap = {
            pending: { label: 'Pending', severity: 'warning' },
            processing: { label: 'Processing', severity: 'info' },
            completed: { label: 'Completed', severity: 'success' },
            cancelled: { label: 'Cancelled', severity: 'danger' }
        };
        const info = statusMap[status] || { label: status, severity: 'secondary' };
        return <Tag value={info.label} severity={info.severity} />;
    };

    return (
        <>
            <Head title="View Order" />
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
                                            <label className="block font-medium mb-2">Order ID</label>
                                            <InputText
                                                value={`#${order.id}`}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>

                                        <div className="field">
                                            <label className="block font-medium mb-2">Customer Name</label>
                                            <InputText
                                                value={order.customer_name}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="field">
                                            <label className="block font-medium mb-2">Total Amount</label>
                                            <InputText
                                                value={`${order.total_amount.toLocaleString()} đ`}
                                                className="w-full"
                                                disabled
                                            />
                                        </div>
                                        <div className="field">
                                            <label className="block font-medium mb-2">Status</label>
                                            <div className="flex items-center h-full">
                                                {statusTemplate(order.status)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Divider />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="field">
                                        <label className="block font-medium mb-2">Create Time</label>
                                        <InputText
                                            value={formatDateTime(order.created_at)}
                                            className="w-full"
                                            disabled
                                        />
                                    </div>
                                    <div className="field">
                                        <label className="block font-medium mb-2">Last Update</label>
                                        <InputText
                                            value={formatDateTime(order.updated_at)}
                                            className="w-full"
                                            disabled
                                        />
                                    </div>
                                </div>

                                <Divider />

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                        Order Items
                                    </h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {order.items && order.items.length > 0 ? (
                                            order.items.map((item, idx) => (
                                                <li key={idx}>
                                                    {item.product_name} — {item.quantity} × {item.price.toLocaleString()} đ
                                                </li>
                                            ))
                                        ) : (
                                            <li>No items found</li>
                                        )}
                                    </ul>
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
        </>
    );
}
