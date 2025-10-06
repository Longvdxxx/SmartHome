import React, { useState } from "react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function PaymentCheckout({ selectedProducts = [], total = 0, employee, csrfToken }) {
  const [form, setForm] = useState({
    name: employee?.name || "",
    phone: employee?.phone || "",
    address: employee?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill in all customer information.");
      return;
    }

    router.post(route("staff.payment.confirm"), {
      ...form,
      selectedProducts,
      _token: csrfToken,
    });
  };

  const computedTotal =
    total || selectedProducts.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <EmployeeLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Payment Checkout</h1>

        <div className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <table className="w-full table-auto border-collapse text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Product</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((item, index) => {
                const price = parseFloat(item.price) || 0;
                const subtotal = price * (item.quantity || 1);
                return (
                  <tr key={index}>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">${price.toFixed(2)}</td>
                    <td className="border p-2">{item.quantity || 1}</td>
                    <td className="border p-2">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg mt-4">Total: ${computedTotal.toFixed(2)}</div>
        </div>

        <div className="flex space-x-4 justify-end">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Next: Confirm
          </button>
        </div>
      </div>
    </EmployeeLayout>
  );
}
