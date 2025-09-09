import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function CreateReview({ users, products }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        user_id: '',
        product_id: '',
        rating: '',
        comment: '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('reviews.store'), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Review created successfully!'
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
                <i className="pi pi-comment text-blue-500 text-2xl"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Create New Review</h2>
                <p className="text-gray-600 m-0 mt-1">Add a review for a product</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Create Review" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Review Information */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <i className="pi pi-info-circle text-blue-500"></i>
                                            Review Details
                                        </h3>

                                        {/* User */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                User <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                value={data.user_id}
                                                options={users}
                                                optionLabel="name"
                                                optionValue="id"
                                                onChange={(e) => setData('user_id', e.value)}
                                                placeholder="Select a user"
                                                className={`w-full ${errors.user_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.user_id && <small className="p-error block mt-1">{errors.user_id}</small>}
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

                                        {/* Rating */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Rating (1-5) <span className="text-red-500">*</span>
                                            </label>
                                            <InputNumber
                                                value={data.rating}
                                                onValueChange={(e) => setData('rating', e.value)}
                                                min={1}
                                                max={5}
                                                className={`w-full ${errors.rating ? 'p-invalid' : ''}`}
                                                placeholder="Enter rating"
                                            />
                                            {errors.rating && <small className="p-error block mt-1">{errors.rating}</small>}
                                        </div>

                                        {/* Comment */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Comment
                                            </label>
                                            <InputTextarea
                                                rows={4}
                                                value={data.comment}
                                                onChange={(e) => setData('comment', e.target.value)}
                                                placeholder="Enter review comment"
                                                className={`w-full ${errors.comment ? 'p-invalid' : ''}`}
                                            />
                                            {errors.comment && <small className="p-error block mt-1">{errors.comment}</small>}
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
                                            label="Create Review"
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
                                        All fields marked * are required
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-info-circle text-blue-500 mt-1"></i>
                                        Rating must be between 1 and 5
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
                                        label="View All Reviews"
                                        icon="pi pi-list"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => window.location.href = route('reviews.index')}
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
