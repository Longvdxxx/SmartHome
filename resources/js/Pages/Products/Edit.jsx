import { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Divider } from 'primereact/divider';

export default function Edit({ product, categories, brands }) {
    const toast = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, processing, errors } = useForm({
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        default_image: null,
    });

    useEffect(() => {
        if (product.default_image) {
            setImagePreview(`/${product.default_image}`);
        }
    }, [product]);

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

        const formData = new FormData();
        formData.append('category_id', data.category_id);
        formData.append('brand_id', data.brand_id ?? '');
        formData.append('name', data.name);
        formData.append('description', data.description ?? '');
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        if (data.default_image) {
            formData.append('default_image', data.default_image);
        }
        formData.append('_method', 'PUT');

        router.post(route('products.update', product.id), formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product updated successfully!'
                });
            },
            onError: () => {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please check the form for errors'
                });
            }
        });
    };

    const cardHeader = (
        <div className="flex items-center gap-4 p-4">
            <div className="bg-green-100 p-3 rounded-xl">
                <i className="pi pi-pencil text-green-500 text-2xl"></i>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800 m-0">Edit Product</h2>
                <p className="text-gray-600 m-0 mt-1">Update product details</p>
            </div>
        </div>
    );

    return (
        <>
            <Head title="Edit Product" />
            <Toast ref={toast} />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-fit mx-auto">
                        <div className="lg:col-span-2">
                            <Card className="shadow-3" header={cardHeader}>
                                <form onSubmit={submit} className="space-y-6">
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
                                            placeholder="Select category"
                                            className={`w-full ${errors.category_id ? 'p-invalid' : ''}`}
                                        />
                                        {errors.category_id && <small className="p-error">{errors.category_id}</small>}
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
                                            placeholder="Select brand"
                                            className={`w-full ${errors.brand_id ? 'p-invalid' : ''}`}
                                        />
                                        {errors.brand_id && <small className="p-error">{errors.brand_id}</small>}
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
                                        {errors.name && <small className="p-error">{errors.name}</small>}
                                    </div>

                                    {/* Description */}
                                    <div className="field">
                                        <label className="block text-900 font-medium mb-2">Description</label>
                                        <InputTextarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className={`w-full ${errors.description ? 'p-invalid' : ''}`}
                                            placeholder="Enter product description"
                                        />
                                        {errors.description && <small className="p-error">{errors.description}</small>}
                                    </div>

                                    {/* Price */}
                                    <div className="field">
                                        <label className="block text-900 font-medium mb-2">
                                            Price <span className="text-red-500">*</span>
                                        </label>
                                        <InputText
                                            type="number"
                                            value={data.price}
                                            onChange={(e) => setData('price', e.target.value)}
                                            className={`w-full ${errors.price ? 'p-invalid' : ''}`}
                                            placeholder="Enter price"
                                        />
                                        {errors.price && <small className="p-error">{errors.price}</small>}
                                    </div>

                                    {/* Stock */}
                                    <div className="field">
                                        <label className="block text-900 font-medium mb-2">
                                            Stock <span className="text-red-500">*</span>
                                        </label>
                                        <InputText
                                            type="number"
                                            value={data.stock}
                                            onChange={(e) => setData('stock', e.target.value)}
                                            className={`w-full ${errors.stock ? 'p-invalid' : ''}`}
                                            placeholder="Enter stock quantity"
                                        />
                                        {errors.stock && <small className="p-error">{errors.stock}</small>}
                                    </div>

                                    <Divider />

                                    {/* Default Image */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex gap-2">
                                            <i className="pi pi-image text-green-500"></i>
                                            Default Image
                                        </h3>

                                        {!selectedImage && !data.default_image ? (
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
                                                        onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                                                    />
                                                    <Button
                                                        icon="pi pi-times"
                                                        className="p-button-rounded p-button-danger p-button-sm absolute -top-2 -right-2"
                                                        onClick={onFileRemove}
                                                        tooltip="Remove image"
                                                    />
                                                </div>
                                                {selectedImage && (
                                                    <div className="text-sm text-gray-600">
                                                        <p><strong>File:</strong> {selectedImage.name}</p>
                                                        <p><strong>Size:</strong> {(selectedImage.size / 1024 / 1024).toFixed(2)} MB</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {errors.default_image && <small className="p-error block mt-1">{errors.default_image}</small>}
                                    </div>

                                    <Divider />

                                    {/* Buttons */}
                                    <div className="flex gap-3 justify-end">
                                        <Button type="button" label="Cancel" icon="pi pi-times" severity="secondary" onClick={() => window.history.back()} className="p-button-outlined" />
                                        <Button type="submit" label="Update Product" icon="pi pi-save" loading={processing} className="p-button-success" />
                                    </div>
                                </form>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
