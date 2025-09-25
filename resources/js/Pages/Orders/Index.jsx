import React, { useState, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';

export default function Index({ auth, orders, filters }) {
  const [globalFilter, setGlobalFilter] = useState(filters?.search || '');
  const toast = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('orders.index'), { search: globalFilter }, {
      preserveState: true,
      replace: true
    });
  };

  const actionTemplate = (rowData) => (
    <div className="flex gap-2">
      <Button
        icon="pi pi-eye"
        className="p-button-rounded p-button-text p-button-help"
        tooltip="Show"
        tooltipOptions={{ position: 'top' }}
        onClick={() => router.visit(route('orders.show', rowData.id))}
      />
      <Button
        icon="pi pi-pencil"
        className="p-button-rounded p-button-text p-button-info"
        tooltip="Edit"
        tooltipOptions={{ position: 'top' }}
        onClick={() => router.visit(route('orders.edit', rowData.id))}
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

  const statusTemplate = (rowData) => {
    const severity = rowData.status === 'completed' ? 'success'
      : rowData.status === 'pending' ? 'warning'
      : 'danger';
    return <Tag value={rowData.status} severity={severity} />;
  };

  const priceTemplate = (rowData) =>
    rowData.total_price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  const tableHeader = (
    <div className="flex flex-wrap align-items-center justify-content-between gap-3">
      <form onSubmit={handleSearch} className="p-inputgroup" style={{ width: '300px' }}>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search orders..."
          className="p-inputtext-sm"
        />
        <Button
          type="submit"
          icon="pi pi-search"
          className="p-button-primary p-button-sm"
        />
      </form>
    </div>
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Order Management" />
      <Toast ref={toast} />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-3">
            <DataTable
              value={orders.data}
              header={tableHeader}
              paginator
              rows={10}
              totalRecords={orders.total}
              lazy
              first={(orders.current_page - 1) * orders.per_page}
              sortField={filters?.sortField || 'created_at'}
              sortOrder={filters?.sortOrder || -1}
              onPage={(e) => {
                const page = Math.floor(e.first / e.rows) + 1;
                router.get(route('orders.index'),
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
                router.get(route('orders.index'), {
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
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"

              className="p-datatable-sm"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No orders found"
            >
              <Column field="id" header="ID" body={idTemplate} sortable style={{ width: '80px' }} />
              <Column field="customer_id" header="Customer ID" sortable style={{ minWidth: '120px' }} />
              <Column field="status" header="Status" body={statusTemplate} sortable style={{ minWidth: '150px' }} />
              <Column field="total_price" header="Total Price" body={priceTemplate} sortable style={{ minWidth: '150px' }} />
              <Column field="created_at" header="Created At" body={dateTemplate} sortable style={{ minWidth: '180px' }} />
              <Column header="Actions" body={actionTemplate} style={{ width: '120px' }} frozen alignFrozen="right" />
            </DataTable>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="text-center shadow-2">
              <div className="flex align-items-center justify-content-center mb-3">
                <div className="bg-blue-100 p-3 border-round-xl">
                  <i className="pi pi-shopping-cart text-blue-500 text-2xl"></i>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{orders.total}</span>
              <div className="text-gray-600 mt-1">Total Orders</div>
            </Card>

            <Card className="text-center shadow-2">
              <div className="flex align-items-center justify-content-center mb-3">
                <div className="bg-green-100 p-3 border-round-xl">
                  <i className="pi pi-check-circle text-green-500 text-2xl"></i>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{orders.current_page}</span>
              <div className="text-gray-600 mt-1">Current Page</div>
            </Card>

            <Card className="text-center shadow-2">
              <div className="flex align-items-center justify-content-center mb-3">
                <div className="bg-purple-100 p-3 border-round-xl">
                  <i className="pi pi-list text-purple-500 text-2xl"></i>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{orders.last_page}</span>
              <div className="text-gray-600 mt-1">Total Pages</div>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
