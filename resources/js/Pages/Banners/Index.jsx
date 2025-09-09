import { Dropdown } from 'primereact/dropdown';
import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

export default function Index({ auth, banners, products, filters }) {
    const [globalFilter, setGlobalFilter] = useState(filters?.search || '');
    const [selectedProduct, setSelectedProduct] = useState(filters?.product_id || null);
    const toast = useRef(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('banners.index'), {
            search: globalFilter,
            product_id: selectedProduct
        }, {
            preserveState: true,
            replace: true
        });
    };

    const confirmDelete = (banner) => {
        confirmDialog({
            message: `Are you sure you want to delete this banner?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept: () => {
                router.delete(route('banners.destroy', banner.id), {
                    onSuccess: () => {
                        toast.current?.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Banner deleted successfully'
                        });
                    }
                });
            }
        });
    };

    const imageTemplate = (rowData) => (
        <img
            src={`/${rowData.image_url}`}
            alt={rowData.name}
            className="w-24 h-24 object-cover border-round"
        />
    );

    const productTemplate = (rowData) => (
        <div>
            <div className="font-semibold">{rowData.product?.name || '-'}</div>
            <div className="text-sm text-gray-500">
                {rowData.product?.category?.name || '-'} / {rowData.product?.brand?.name || '-'}
            </div>
        </div>
    );

    const descriptionTemplate = (rowData) => (
        <span className="text-sm">{rowData.description || '-'}</span>
    );

    const dateTemplate = (rowData) =>
        new Date(rowData.created_at).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

    const actionTemplate = (rowData) => (
        <div className="flex gap-2">
            <Button
                icon="pi pi-pencil"
                className="p-button-rounded p-button-text p-button-info"
                tooltip="Edit"
                tooltipOptions={{ position: 'top' }}
                onClick={() => router.visit(route('banners.edit', rowData.id))}
            />
            <Button
                icon="pi pi-trash"
                className="p-button-rounded p-button-text p-button-danger"
                tooltip="Delete"
                tooltipOptions={{ position: 'top' }}
                onClick={() => confirmDelete(rowData)}
            />
        </div>
    );

    const totalRecords = banners?.total || 0;
    const firstRecord = totalRecords > 0 ? ((banners?.current_page - 1) * banners?.per_page) + 1 : 0;
    const lastRecord = totalRecords > 0 ? firstRecord + banners?.data.length - 1 : 0;

    const tableHeader = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-3">
            <form onSubmit={handleSearch} className="flex gap-2">
                <InputText
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search by banner name..."
                    className="p-inputtext-sm"
                />
                <Dropdown
                    value={selectedProduct}
                    options={products.map(p => ({ label: p.name, value: p.id }))}
                    onChange={(e) => setSelectedProduct(e.value)}
                    placeholder="All Products"
                    className="p-dropdown-sm"
                    showClear
                />
                <Button
                    type="submit"
                    icon="pi pi-search"
                    className="p-button-primary p-button-sm"
                />
            </form>

            <Button
                icon="pi pi-plus"
                label="Add Banner"
                className="p-button-success p-button-sm"
                onClick={() => router.visit(route('banners.create'))}
            />
        </div>
    );

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Banners" />
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card className="shadow-3">
                        <DataTable
                            value={banners?.data || []}
                            header={tableHeader}
                            paginator
                            rows={banners?.per_page || 10}
                            totalRecords={totalRecords}
                            first={firstRecord - 1}
                            sortField={filters?.sortField || 'created_at'}
                            sortOrder={filters?.sortOrder || -1}
                            onPage={(e) => {
                                const page = Math.floor(e.first / e.rows) + 1;
                                router.get(route('banners.index'), {
                                    search: globalFilter,
                                    product_id: selectedProduct,
                                    sortField: filters?.sortField,
                                    sortOrder: filters?.sortOrder,
                                    page
                                }, { preserveState: true, replace: true });
                            }}
                            onSort={(e) => {
                                router.get(route('banners.index'), {
                                    search: globalFilter,
                                    product_id: selectedProduct,
                                    sortField: e.sortField,
                                    sortOrder: e.sortOrder,
                                    page: 1
                                }, { preserveState: true, replace: true });
                            }}
                            paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate={`Showing ${firstRecord} to ${lastRecord} of ${totalRecords} banners`}
                            rowsPerPageOptions={[10, 25, 50]}
                            className="p-datatable-sm"
                            stripedRows
                            responsiveLayout="scroll"
                            emptyMessage="No banners found"
                        >
                            <Column header="Image" body={imageTemplate} style={{ width: '120px' }} />
                            <Column field="name" header="Name" sortable style={{ minWidth: '150px' }} />
                            <Column header="Description" body={descriptionTemplate} style={{ minWidth: '200px' }} />
                            <Column header="Product" body={productTemplate} sortable style={{ minWidth: '200px' }} />
                            <Column field="created_at" header="Created At" body={dateTemplate} sortable style={{ minWidth: '180px' }} />
                            <Column header="Actions" body={actionTemplate} style={{ width: '120px' }} frozen alignFrozen="right" />
                        </DataTable>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
