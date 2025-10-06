import React, { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import EmployeeLayout from "@/Layouts/EmployeeLayout";

export default function PaymentSelectProducts() {
  const { inventories, flashError, clearLocalStorage } = usePage().props;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("selectedProducts");
    if (saved) {
      const parsed = JSON.parse(saved).map((p) => {
        const inv = inventories.find((i) => i.id === p.inventoryId);
        if (!inv) return null;
        if (p.quantity > inv.quantity) {
          alert(`Quantity for ${p.name} reset to available stock: ${inv.quantity}`);
        }
        return {
          ...p,
          quantity: Math.min(p.quantity, inv.quantity),
        };
      }).filter(Boolean);
      setSelectedProducts(parsed);
    }
  }, [inventories]);

  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  useEffect(() => {
    if (clearLocalStorage) {
      localStorage.removeItem("selectedProducts");
      setSelectedProducts([]);
    }
  }, [clearLocalStorage]);

  const handleSearch = () => {
    router.get(route("staff.payment.index"), { search }, { preserveState: true });
  };

  const handleQuantityChange = (inventoryId, value) => {
    const inv = inventories.find((i) => i.id === inventoryId);
    if (!inv) return;

    if (value > inv.quantity) {
      alert(`Not enough stock for ${inv.product.name}. Max available: ${inv.quantity}`);
      value = inv.quantity;
    }

    setSelectedProducts((prev) => {
      const existing = prev.find((p) => p.inventoryId === inventoryId);
      if (existing) {
        return prev.map((p) =>
          p.inventoryId === inventoryId ? { ...p, quantity: value || 0 } : p
        );
      } else {
        return [
          ...prev,
          {
            inventoryId,
            product_id: inv.product.id,
            name: inv.product.name,
            price: inv.product.price,
            quantity: value || 0,
          },
        ];
      }
    });
  };

  const handleProceed = () => {
    const filtered = selectedProducts.filter((p) => p.quantity > 0);
    if (filtered.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    router.post(route("staff.payment.checkout"), { selectedProducts: filtered });
  };

  const quantityEditor = (rowData) => {
    const inv = inventories.find((i) => i.id === rowData.id);
    const selected = selectedProducts.find((p) => p.inventoryId === rowData.id);
    return (
      <InputNumber
        value={selected?.quantity || 0}
        onValueChange={(e) => handleQuantityChange(rowData.id, e.value)}
        min={0}
        max={inv?.quantity || 0}
      />
    );
  };

  return (
    <EmployeeLayout>
      <Head title="Select Products for Payment" />
      <div className="p-6 space-y-4">
        <Card title="Select Products">
          {flashError && (
            <div className="p-2 mb-3 text-red-600 border border-red-300 rounded">
              {flashError}
            </div>
          )}
          <div className="flex gap-2 mb-3">
            <InputText
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
            />
            <Button label="Search" onClick={handleSearch} />
          </div>

          <DataTable
            value={inventories}
            paginator
            rows={10}
            stripedRows
            responsiveLayout="scroll"
          >
            <Column field="product.name" header="Product" />
            <Column field="product.price" header="Price" />
            <Column field="quantity" header="In Stock" />
            <Column
              header="Select Quantity"
              body={quantityEditor}
              style={{ width: "200px" }}
            />
          </DataTable>

          <div className="mt-4 text-right">
            <Button
              label="Proceed to Payment"
              icon="pi pi-arrow-right"
              onClick={handleProceed}
              className="p-button-success"
            />
          </div>
        </Card>
      </div>
    </EmployeeLayout>
  );
}
