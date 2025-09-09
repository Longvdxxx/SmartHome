import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';

export default function CreateBanner({ products }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        product_id: '',
        image: null,
    });

    const onFileSelect = (e) => {
        const file = e.files ? e.files[0] : e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setData('image', file);

            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const onFileRemove = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setData('image', null);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!data.name) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please enter banner name'
            });
            return;
        }

        if (!data.image) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select an image'
            });
            return;
        }

        setLoading(true);

        post(route('banners.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Banner created successfully!'
                });
                reset();
                setSelectedImage(null);
                setImagePreview(null);
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
                <i className="pi pi-image text-blue-500 text-2xl"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Create Banner</h2>
                <p className="text-gray-600 m-0 mt-1">Add a new banner for your store</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Create Banner" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
                                    {/* Banner Info */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <i className="pi pi-info-circle text-blue-500"></i>
                                            Banner Information
                                        </h3>

                                        <div className="mb-4">
                                            <label className="block text-900 font-medium mb-2">
                                                Banner Name <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter banner name"
                                                className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                            />
                                            {errors.name && <small className="p-error block mt-1">{errors.name}</small>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-900 font-medium mb-2">
                                                Description
                                            </label>
                                            <InputTextarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows={3}
                                                placeholder="Enter description..."
                                                className="w-full"
                                            />
                                            {errors.description && <small className="p-error block mt-1">{errors.description}</small>}
                                        </div>

                                        <div className="mb-4">
                                            <label className="block text-900 font-medium mb-2">
                                                Link Product (optional)
                                            </label>
                                            <Dropdown
                                                value={data.product_id}
                                                options={products}
                                                optionLabel="name"
                                                optionValue="id"
                                                onChange={(e) => setData('product_id', e.value)}
                                                placeholder="Choose a product..."
                                                className={`w-full ${errors.product_id ? 'p-invalid' : ''}`}
                                                filter
                                                showClear
                                                emptyMessage="No products found"
                                            />
                                            {errors.product_id && <small className="p-error block mt-1">{errors.product_id}</small>}
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Image Upload */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <i className="pi pi-image text-blue-500"></i>
                                            Banner Image
                                        </h3>

                                        {!selectedImage ? (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors cursor-pointer relative">
                                                <i className="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
                                                <p className="text-gray-600 mb-4">
                                                    <strong>Click to upload</strong> or drag and drop
                                                </p>
                                                <p className="text-sm text-gray-500">PNG, JPG, JPEG up to 20MB</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={onFileSelect}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="relative inline-block">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Preview"
                                                        className="max-w-full max-h-64 rounded-lg shadow-md"
                                                    />
                                                    <Button
                                                        icon="pi pi-times"
                                                        className="p-button-rounded p-button-danger p-button-sm absolute -top-2 -right-2"
                                                        onClick={onFileRemove}
                                                        tooltip="Remove image"
                                                    />
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    <p><strong>File:</strong> {selectedImage.name}</p>
                                                    <p><strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                        )}
                                        {errors.image && <small className="p-error block mt-1">{errors.image}</small>}
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
                                            label="Create Banner"
                                            icon="pi pi-upload"
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
                                    <i className="pi pi-info-circle text-blue-500"></i>
                                    Banner Requirements
                                </h3>
                                <ul className="text-sm text-gray-600 space-y-2 pl-0 list-none">
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Maximum file size: 20MB
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Supported formats: PNG, JPG, JPEG
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <i className="pi pi-check text-green-500 mt-1"></i>
                                        Recommended size: 1200x400px
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
                                        label="View All Banners"
                                        icon="pi pi-images"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => window.location.href = route('banners.index')}
                                    />
                                    <Button
                                        label="Back to Dashboard"
                                        icon="pi pi-arrow-left"
                                        severity="secondary"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => window.location.href = route('dashboard')}
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
