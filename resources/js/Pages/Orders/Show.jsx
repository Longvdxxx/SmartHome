import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Show({ auth, order, customer, items }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

        {/* Customer Info */}
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <div className="p-2 border rounded bg-white">{customer.name}</div>
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <div className="p-2 border rounded bg-white">{customer.email}</div>
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <div className="p-2 border rounded bg-white">{customer.phone}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Address</label>
              <div className="p-2 border rounded bg-white">{customer.address}</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-6 border p-4 rounded">
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <table className="w-full table-auto border-collapse text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Image</th>
                <th className="border p-2">Product</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const subtotal = item.price * item.quantity;
                return (
                  <tr key={item.id}>
                    <td className="border p-2">
                      <img
                        src={item.image_url || "/placeholder.png"}
                        alt={item.name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    </td>
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">${item.price.toFixed(2)}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-right font-bold text-lg mt-4">
            Total: ${total.toFixed(2)}
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Back
          </button>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
