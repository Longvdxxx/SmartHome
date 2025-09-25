import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { Rating } from 'primereact/rating';

export default function Edit({ review, products, users }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        product_id: review.product_id || '',
        user_id: review.user_id || '',
        rating: review.rating || 0,
        comment: review.comment || '',
    });

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        put(route('reviews.update', review.id), {
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Review updated successfully!'
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
            <div className="bg-yellow-100 p-3 border-round-xl mt-6 ml-4">
                <i className="pi pi-comment text-yellow-500 text-2xl"></i>
            </div>
            <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Review</h2>
                <p className="text-gray-600 m-0 mt-1">Update review details</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Review" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex align-items-center gap-2">
                                            <i className="pi pi-info-circle text-yellow-500"></i>
                                            Review Information
                                        </h3>

                                        {/* Product (read-only) */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">Product</label>
                                            <Dropdown
                                                value={data.product_id}
                                                options={products}
                                                optionLabel="name"
                                                optionValue="id"
                                                disabled
                                                className="w-full"
                                            />
                                        </div>

                                        {/* User (read-only) */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">User</label>
                                            <Dropdown
                                                value={data.user_id}
                                                options={users}
                                                optionLabel="name"
                                                optionValue="id"
                                                disabled
                                                className="w-full"
                                            />
                                        </div>

                                        {/* Rating */}
                                        <div className="field">
                                            <label htmlFor="rating" className="block text-900 font-medium mb-2">
                                                Rating <span className="text-red-500">*</span>
                                            </label>
                                            <Rating
                                                id="rating"
                                                value={data.rating}
                                                onChange={(e) => setData('rating', e.value)}
                                                cancel={false}
                                                stars={5}
                                            />
                                            {errors.rating && <small className="p-error">{errors.rating}</small>}
                                        </div>

                                        {/* Comment */}
                                        <div className="field">
                                            <label htmlFor="comment" className="block text-900 font-medium mb-2">
                                                Comment
                                            </label>
                                            <InputTextarea
                                                id="comment"
                                                value={data.comment}
                                                onChange={(e) => setData('comment', e.target.value)}
                                                rows={4}
                                                className={`w-full ${errors.comment ? 'p-invalid' : ''}`}
                                                placeholder="Enter your review comment"
                                            />
                                            {errors.comment && <small className="p-error">{errors.comment}</small>}
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
                                            label="Update Review"
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
                                        Make sure the rating is correct before updating.
                                    </li>
                                    <li className="flex align-items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Comment is optional, but helpful for other customers.
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
