import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export default function Index({ auth, products, filters }) {
  const [globalFilter, setGlobalFilter] = useState(filters?.search || '');
  const toast = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('products.index'), { search: globalFilter }, {
      preserveState: true,
      replace: true
    });
  };

  const confirmDelete = (product) => {
    confirmDialog({
      message: `Are you sure you want to delete product "${product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('products.destroy', product.id), {
          onSuccess: () => {
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Product deleted successfully'
            });
          }
        });
      }
    });
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-info"
        tooltip="Edit"
        tooltipOptions={{ position: 'top' }}
        onClick={() => router.visit(route('products.edit', rowData.id))}
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

  const imageTemplate = (rowData) => (
    <img
      src={rowData.default_image ? `/${rowData.default_image}` : '/images/placeholder.jpg'}
      alt={rowData.name}
      className="w-16 h-16 object-cover border-round shadow-sm"
      onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
    />
  );

  const dateTemplate = (rowData) =>
    new Date(rowData.created_at).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

  const idTemplate = (rowData) => <Tag value={`#${rowData.id}`} className="p-tag-rounded" />;

  const priceTemplate = (rowData) => (
    <span>{Number(rowData.price).toLocaleString()} $</span>
  );

  const stockTemplate = (rowData) => (
    <Tag value={rowData.stock} severity={rowData.stock > 0 ? 'success' : 'danger'} />
  );

  const categoryTemplate = (rowData) => rowData.category?.name || '-';
  const brandTemplate = (rowData) => rowData.brand?.name || '-';

  const tableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-3">
      <form onSubmit={handleSearch} className="p-inputgroup" style={{ width: '300px' }}>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search products..."
          className="p-inputtext-sm"
        />
        <Button
          type="submit"
          icon="pi pi-search"
          className="p-button-primary p-button-sm"
        />
      </form>

      <Button
        icon="pi pi-plus"
        label="Add Product"
        className="p-button-success p-button-sm"
        onClick={() => router.visit(route('products.create'))}
      />
    </div>
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Product Management" />
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-3">
            <DataTable
              value={products.data}
              header={tableHeader}
              paginator
              rows={10}
              totalRecords={products.total}
              lazy
              first={(products.current_page - 1) * products.per_page}
              sortField={filters?.sortField || 'created_at'}
              sortOrder={filters?.sortOrder || -1}
              onPage={(e) => {
                const page = Math.floor(e.first / e.rows) + 1;
                router.get(route('products.index'),
                  {
                    search: globalFilter,
                    sortField: filters?.sortField,
                    sortOrder: filters?.sortOrder,
                    page: page
                  },
                  {
                    preserveState: true,
                    replace: true
                  }
                );
              }}
              onSort={(e) => {
                router.get(route('products.index'), {
                  search: globalFilter,
                  sortField: e.sortField,
                  sortOrder: e.sortOrder,
                  page: 1
                }, {
                  preserveState: true,
                  replace: true
                });
              }}
              paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"

              className="p-datatable-sm"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No products found"
            >
              <Column header="Image" body={imageTemplate} style={{ width: '100px' }} />
              <Column field="id" header="ID" body={idTemplate} sortable style={{ width: '80px' }} />
              <Column field="name" header="Name" sortable style={{ minWidth: '200px' }} className="font-medium" />
              <Column field="category.name" header="Category" body={categoryTemplate} sortable style={{ minWidth: '150px' }} />
              <Column field="brand.name" header="Brand" body={brandTemplate} sortable style={{ minWidth: '150px' }} />
              <Column field="price" header="Price" body={priceTemplate} sortable style={{ minWidth: '120px' }} />
              <Column field="stock" header="Stock" body={stockTemplate} sortable style={{ minWidth: '100px' }} />
              <Column field="created_at" header="Created At" body={dateTemplate} sortable style={{ minWidth: '180px' }} />
              <Column header="Actions" body={actionTemplate} style={{ width: '120px' }} frozen alignFrozen="right" />
            </DataTable>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
