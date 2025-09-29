import React, { useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";

export default function Inventory({ auth, store, inventories }) {
  const toast = useRef(null);

  const quantityEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) =>
          options.editorCallback(e.value != null ? e.value : 0)
        }
        min={0}
      />
    );
  };

  const onRowEditComplete = (e) => {
    const { newData } = e;

    router.put(
      route("stores.inventory.update", [store.id, newData.id]),
      { quantity: newData.quantity },
      {
        onSuccess: () => {
          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: "Quantity updated successfully",
          });
        },
      }
    );
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={`Inventory - ${store.name}`} />
      <Toast ref={toast} />

      <div className="py-6">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <Card title={`Inventory of ${store.name}`} className="shadow-3">
            <DataTable
            value={inventories}
            editMode="row"
            dataKey="id"
            onRowEditComplete={onRowEditComplete}
            paginator
            rows={10} // số mặc định
            rowsPerPageOptions={[10, 25, 50, 100]} // thêm lựa chọn ở paginator
            stripedRows
            responsiveLayout="scroll"
            emptyMessage="No products found"
            className="p-datatable-sm"
            >
            <Column
                field="product.name"
                header="Product"
                style={{ minWidth: "250px" }}
            />
            <Column
                field="quantity"
                header="Quantity"
                editor={(options) => quantityEditor(options)}
                style={{ width: "180px" }}
            />
            <Column
                rowEditor
                header="Actions"
                bodyStyle={{ textAlign: "center" }}
                style={{ width: "100px" }}
            />
            </DataTable>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
