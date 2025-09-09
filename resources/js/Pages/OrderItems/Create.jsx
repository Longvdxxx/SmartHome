import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function CreateOrderItem({ orders, products }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        order_id: '',
        product_id: '',
        quantity: 1,
        price: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('order-items.store'), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order item created successfully!'
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
            <div className="bg-green-100 p-3 rounded-xl">
                <i className="pi pi-shopping-cart text-green-500 text-2xl"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Create New Order Item</h2>
                <p className="text-gray-600 m-0 mt-1">Add a new order item to the system</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Create Order Item" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Basic Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex align-items-center gap-2">
                                            <i className="pi pi-info-circle text-green-500"></i>
                                            Basic Information
                                        </h3>

                                        {/* Order */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Order <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                value={data.order_id}
                                                options={orders}
                                                optionLabel="id"
                                                optionValue="id"
                                                onChange={(e) => setData('order_id', e.value)}
                                                placeholder="Select an order"
                                                className={`w-full ${errors.order_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.order_id && <small className="p-error block mt-1">{errors.order_id}</small>}
                                        </div>

                                        {/* Product */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Product <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                value={data.product_id}
                                                options={products}
                                                optionLabel="name"
                                                optionValue="id"
                                                onChange={(e) => setData('product_id', e.value)}
                                                placeholder="Select a product"
                                                className={`w-full ${errors.product_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.product_id && <small className="p-error block mt-1">{errors.product_id}</small>}
                                        </div>

                                        {/* Quantity */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <InputNumber
                                                value={data.quantity}
                                                onValueChange={(e) => setData('quantity', e.value)}
                                                min={1}
                                                className={`w-full ${errors.quantity ? 'p-invalid' : ''}`}
                                            />
                                            {errors.quantity && <small className="p-error block mt-1">{errors.quantity}</small>}
                                        </div>

                                        {/* Price */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <InputNumber
                                                value={data.price}
                                                onValueChange={(e) => setData('price', e.value)}
                                                mode="currency"
                                                currency="USD"
                                                className={`w-full ${errors.price ? 'p-invalid' : ''}`}
                                            />
                                            {errors.price && <small className="p-error block mt-1">{errors.price}</small>}
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
                                            label="Create Order Item"
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
                                        All fields marked * are required
                                    </li>
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                                        Price is in USD by default
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
                                        label="View All Order Items"
                                        icon="pi pi-list"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => window.location.href = route('order-items.index')}
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
