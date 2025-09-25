import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function Edit({ orderItem, orders, products }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        order_id: orderItem.order_id || '',
        product_id: orderItem.product_id || '',
        quantity: orderItem.quantity || '',
        price: orderItem.price || '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        put(route('order-items.update', orderItem.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order item updated successfully!'
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
                <i className="pi pi-box text-blue-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Order Item</h2>
                <p className="text-gray-600 m-0 mt-1">Update order item information</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Order Item" />
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

                                        {/* Order */}
                                        <div className="field">
                                            <label htmlFor="order_id" className="block text-900 font-medium mb-2">
                                                Order <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                id="order_id"
                                                value={data.order_id}
                                                options={orders}
                                                optionLabel="id"
                                                optionValue="id"
                                                onChange={(e) => setData('order_id', e.value)}
                                                placeholder="Select order"
                                                className={`w-full ${errors.order_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.order_id && <small className="p-error">{errors.order_id}</small>}
                                        </div>

                                        {/* Product */}
                                        <div className="field">
                                            <label htmlFor="product_id" className="block text-900 font-medium mb-2">
                                                Product <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                id="product_id"
                                                value={data.product_id}
                                                options={products}
                                                optionLabel="name"
                                                optionValue="id"
                                                onChange={(e) => setData('product_id', e.value)}
                                                placeholder="Select product"
                                                className={`w-full ${errors.product_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.product_id && <small className="p-error">{errors.product_id}</small>}
                                        </div>

                                        {/* Quantity */}
                                        <div className="field">
                                            <label htmlFor="quantity" className="block text-900 font-medium mb-2">
                                                Quantity <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="quantity"
                                                type="number"
                                                value={data.quantity}
                                                onChange={(e) => setData('quantity', e.target.value)}
                                                className={`w-full ${errors.quantity ? 'p-invalid' : ''}`}
                                                placeholder="Enter quantity"
                                            />
                                            {errors.quantity && <small className="p-error">{errors.quantity}</small>}
                                        </div>

                                        {/* Price */}
                                        <div className="field">
                                            <label htmlFor="price" className="block text-900 font-medium mb-2">
                                                Price <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                id="price"
                                                type="number"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className={`w-full ${errors.price ? 'p-invalid' : ''}`}
                                                placeholder="Enter price"
                                            />
                                            {errors.price && <small className="p-error">{errors.price}</small>}
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
                                            label="Update Order Item"
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
                                        Ensure the selected order and product are correct before updating.
                                    </li>
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Quantity must be greater than 0.
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
