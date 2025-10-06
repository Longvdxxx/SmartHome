import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function CreateProduct({ categories, brands }) {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        category_id: '',
        brand_id: '',
        name: '',
        description: '',
        price: '',
        default_image: null,
    });

    const onFileSelect = (e) => {
        const file = e.files ? e.files[0] : e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setData('default_image', file);

            const reader = new FileReader();
            reader.onload = (event) => setImagePreview(event.target.result);
            reader.readAsDataURL(file);
        }
    };

    const onFileRemove = () => {
        setSelectedImage(null);
        setImagePreview(null);
        setData('default_image', null);
    };

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product created successfully!'
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
            <div className="bg-green-100 p-3 rounded-xl">
                <i className="pi pi-box text-green-500 text-2xl"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Create New Product</h2>
                <p className="text-gray-600 m-0 mt-1">Add a new product to the system</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Create Product" />
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

                                        {/* Category */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Category <span className="text-red-500">*</span>
                                            </label>
                                            <Dropdown
                                                value={data.category_id}
                                                options={categories}
                                                optionLabel="name"
                                                optionValue="id"
                                                onChange={(e) => setData('category_id', e.value)}
                                                placeholder="Select a category"
                                                className={`w-full ${errors.category_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.category_id && <small className="p-error block mt-1">{errors.category_id}</small>}
                                        </div>

                                        {/* Brand */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Brand
                                            </label>
                                            <Dropdown
                                                value={data.brand_id}
                                                options={brands}
                                                optionLabel="name"
                                                optionValue="id"
                                                onChange={(e) => setData('brand_id', e.value)}
                                                placeholder="Select a brand"
                                                className={`w-full ${errors.brand_id ? 'p-invalid' : ''}`}
                                            />
                                            {errors.brand_id && <small className="p-error block mt-1">{errors.brand_id}</small>}
                                        </div>

                                        {/* Name */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <InputText
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className={`w-full ${errors.name ? 'p-invalid' : ''}`}
                                                placeholder="Enter product name"
                                            />
                                            {errors.name && <small className="p-error block mt-1">{errors.name}</small>}
                                        </div>

                                        {/* Description */}
                                        <div className="field">
                                            <label className="block text-900 font-medium mb-2">
                                                Description
                                            </label>
                                            <InputTextarea
                                                rows={4}
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Enter product description"
                                                className={`w-full ${errors.description ? 'p-invalid' : ''}`}
                                            />
                                            {errors.description && <small className="p-error block mt-1">{errors.description}</small>}
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
                                                placeholder="Enter price"
                                            />
                                            {errors.price && <small className="p-error block mt-1">{errors.price}</small>}
                                        </div>
                                    </div>

                                    <Divider />

                                    {/* Default Image Upload */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex align-items-center gap-2">
                                            <i className="pi pi-image text-green-500"></i>
                                            Default Image
                                        </h3>
                                        {!selectedImage ? (
                                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-400 transition-colors cursor-pointer relative">
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
                                        {errors.default_image && <small className="p-error block mt-1">{errors.default_image}</small>}
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
                                            label="Create Product"
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
                                        label="View All Products"
                                        icon="pi pi-list"
                                        className="w-full p-button-outlined p-button-sm"
                                        onClick={() => window.location.href = route('products.index')}
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
