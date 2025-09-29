import React, { useRef, useState, useEffect } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import EmployeeLayout from "@/Layouts/EmployeeLayout";

export default function InventoryIndex() {
  const { store, inventories: rawInventories, auth } = usePage().props;
  const toast = useRef(null);

  const items = Array.isArray(rawInventories)
    ? rawInventories.filter((item) => item && item.product)
    : [];

  const [inventoryItems, setInventoryItems] = useState(items);
  const [employee, setEmployee] = useState(auth.user);

  useEffect(() => {
    if (auth.user) setEmployee(auth.user);
  }, [auth.user]);

  const isEditable = employee && ["manager", "stock"].includes(employee.role);

  const onRowEditInit = (event) => {
    console.log("Edit init:", event.data);
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === event.data.id ? { ...item, editing: true } : item
      )
    );
  };

  const onRowEditCancel = (event) => {
    console.log("Edit cancelled:", event.data);
    setInventoryItems((prev) =>
      prev.map((item) =>
        item.id === event.data.id ? { ...event.data, editing: false } : item
      )
    );
  };

  const onRowEditComplete = (event) => {
    const newData = { ...event.newData };
    newData.quantity = Number(newData.quantity); // fix type

    console.log("Edit complete, sending update:", newData);

    router.put(
      route("staff.stores.inventory.update", {
        store: store.id,
        inventory: newData.id,
      }),
      { quantity: newData.quantity },
      {
        onSuccess: (page) => {
          console.log("Update success response:", page.props.flash);
          const msg = page.props.flash?.success || "Quantity updated successfully";

          toast.current?.show({
            severity: "success",
            summary: "Success",
            detail: msg,
            life: 2000,
          });

          setInventoryItems((prev) =>
            prev.map((item) =>
              item.id === newData.id
                ? { ...item, quantity: newData.quantity, editing: false }
                : item
            )
          );
        },
        onError: (errors) => {
          console.log("Update error:", errors);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail:
              errors?.message || "You are not allowed to update this inventory.",
            life: 3000,
          });
        },
      }
    );
  };

  const quantityEditor = (options) => {
    if (!isEditable) return <span>{options.value ?? 0}</span>;
    return (
      <InputNumber
        value={options.value ?? 0}
        onValueChange={(e) => {
          console.log("Input changed:", e.value);
          options.rowData.quantity = Number(e.value); // update rowData để gửi đúng giá trị
          setInventoryItems((prev) =>
            prev.map((item) =>
              item.id === options.rowData.id
                ? { ...item, quantity: Number(e.value) }
                : item
            )
          );
        }}
        min={0}
      />
    );
  };

  return (
    <EmployeeLayout>
      <Head title={`Inventory - ${store.name}`} />
      <Toast ref={toast} />
      <div className="p-6">
        <Card title={`Inventory of ${store.name}`}>
          <DataTable
            value={inventoryItems}
            paginator
            rows={10}
            stripedRows
            editMode="row"
            dataKey="id"
            onRowEditInit={onRowEditInit}
            onRowEditCancel={onRowEditCancel}
            onRowEditComplete={onRowEditComplete}
          >
            <Column field="product.name" header="Product" />
            <Column
              field="quantity"
              header="Quantity"
              editor={quantityEditor}
              style={{ width: "200px" }}
            />
            {isEditable && (
              <Column
                rowEditor
                header="Actions"
                style={{ width: "100px" }}
              />
            )}
          </DataTable>
        </Card>
      </div>
    </EmployeeLayout>
  );
}
