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

export default function Index({ auth, orderItems, filters }) {
  const [globalFilter, setGlobalFilter] = useState(filters?.search || '');
  const toast = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('order-items.index'), { search: globalFilter }, {
      preserveState: true,
      replace: true
    });
  };

  const confirmDelete = (orderItem) => {
    confirmDialog({
      message: `Are you sure you want to delete order item #${orderItem.id}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('order-items.destroy', orderItem.id), {
          onSuccess: () => {
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Order item deleted successfully'
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
        onClick={() => router.visit(route('order-items.edit', rowData.id))}
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

  const dateTemplate = (rowData) => new Date(rowData.created_at).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });

  const idTemplate = (rowData) => <Tag value={`#${rowData.id}`} className="p-tag-rounded" />;

  const tableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-3">
      <form onSubmit={handleSearch} className="p-inputgroup" style={{ width: '300px' }}>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search by Order ID or Product"
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
        label="Add Order Item"
        className="p-button-success p-button-sm"
        onClick={() => router.visit(route('order-items.create'))}
      />
    </div>
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Order Items" />
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-3">
            <DataTable
              value={orderItems.data}
              header={tableHeader}
              paginator
              rows={10}
              totalRecords={orderItems.total}
              lazy
              first={(orderItems.current_page - 1) * orderItems.per_page}
              sortField={filters?.sortField || 'created_at'}
              sortOrder={filters?.sortOrder || -1}
              onPage={(e) => {
                const page = Math.floor(e.first / e.rows) + 1;
                router.get(route('order-items.index'),
                  {
                    search: globalFilter,
                    sortField: filters?.sortField,
                    sortOrder: filters?.sortOrder,
                    page: page
                  },
                  { preserveState: true, replace: true }
                );
              }}
              onSort={(e) => {
                router.get(route('order-items.index'), {
                  search: globalFilter,
                  sortField: e.sortField,
                  sortOrder: e.sortOrder,
                  page: 1
                }, { preserveState: true, replace: true });
              }}
              paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} order items"

              className="p-datatable-sm"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No order items found"
            >
              <Column field="id" header="ID" body={idTemplate} sortable style={{ width: '80px' }} />
              <Column field="order.id" header="Order ID" sortable style={{ minWidth: '120px' }} />
              <Column field="product.name" header="Product" sortable style={{ minWidth: '180px' }} />
              <Column field="quantity" header="Quantity" sortable style={{ minWidth: '100px' }} />
              <Column field="price" header="Price" body={(row) => `${Number(row.price).toLocaleString()} $`} sortable style={{ minWidth: '120px' }} />
              <Column field="created_at" header="Created At" body={dateTemplate} sortable style={{ minWidth: '180px' }} />
              <Column header="Actions" body={actionTemplate} style={{ width: '120px' }} frozen alignFrozen="right" />
            </DataTable>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
