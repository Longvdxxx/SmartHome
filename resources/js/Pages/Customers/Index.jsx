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

export default function Index({ auth, customers, filters }) {
  const [globalFilter, setGlobalFilter] = useState(filters?.search || '');
  const toast = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('customers.index'), { search: globalFilter }, {
      preserveState: true,
      replace: true
    });
  };

  const confirmDelete = (customer) => {
    confirmDialog({
      message: `Are you sure you want to delete customer "${customer.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        router.delete(route('customers.destroy', customer.id), {
          onSuccess: () => {
            toast.current?.show({
              severity: 'success',
              summary: 'Success',
              detail: 'Customer deleted successfully'
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
        onClick={() => router.visit(route('customers.edit', rowData.id))}
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
          placeholder="Search customers..."
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
        label="Add customer"
        className="p-button-success p-button-sm"
        onClick={() => router.visit(route('customers.create'))}
      />
    </div>
  );

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Customer Management" />
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="py-6">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-3">
            <DataTable
              value={customers.data}
              header={tableHeader}
              paginator
              rows={10}
              totalRecords={customers.total}
              lazy
              first={(customers.current_page - 1) * customers.per_page}
              sortField={filters?.sortField || 'created_at'}
              sortOrder={filters?.sortOrder || -1}
              onPage={(e) => {
                const page = Math.floor(e.first / e.rows) + 1;
                router.get(route('customers.index'),
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
                router.get(route('customers.index'), {
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
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} customers"
              rowsPerPageOptions={[10, 25, 50]}
              className="p-datatable-sm"
              stripedRows
              responsiveLayout="scroll"
              emptyMessage="No customers found"
            >
              <Column field="id" header="ID" body={idTemplate} sortable style={{ width: '80px' }} />
              <Column field="name" header="Name" sortable style={{ minWidth: '200px' }} className="font-medium" />
              <Column field="email" header="Email" sortable style={{ minWidth: '250px' }} />
              <Column field="phone" header="Phone" sortable style={{ minWidth: '150px' }} />
              <Column field="created_at" header="Created At" body={dateTemplate} sortable style={{ minWidth: '180px' }} />
              <Column header="Actions" body={actionTemplate} style={{ width: '120px' }} frozen alignFrozen="right" />
            </DataTable>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="text-center shadow-2">
              <div className="flex align-items-center justify-content-center mb-3">
                <div className="bg-blue-100 p-3 border-round-xl">
                  <i className="pi pi-users text-blue-500 text-2xl"></i>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{customers.total}</span>
              <div className="text-gray-600 mt-1">Total Customers</div>
            </Card>

            <Card className="text-center shadow-2">
              <div className="flex align-items-center justify-content-center mb-3">
                <div className="bg-green-100 p-3 border-round-xl">
                  <i className="pi pi-check-circle text-green-500 text-2xl"></i>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{customers.current_page}</span>
              <div className="text-gray-600 mt-1">Current Page</div>
            </Card>

            <Card className="text-center shadow-2">
              <div className="flex align-items-center justify-content-center mb-3">
                <div className="bg-purple-100 p-3 border-round-xl">
                  <i className="pi pi-list text-purple-500 text-2xl"></i>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-800">{customers.last_page}</span>
              <div className="text-gray-600 mt-1">Total Pages</div>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
