import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { router } from "@inertiajs/react";

export default function OrderShow({ order }) {
  const handleCancel = () => {
    if (
      confirm("Are you sure you want to cancel this order?")
    ) {
      router.post(`/shop/orders/${order.id}/cancel`);
    }
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Order #{order.id}</h1>

        <p className="mb-4">
          <span className="font-semibold">Status:</span> {order.status}
        </p>

        {/* Shipping Info */}
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Name</label>
              <div className="p-2 border rounded bg-white">{order.customer.name}</div>
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <div className="p-2 border rounded bg-white">{order.customer.email}</div>
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <div className="p-2 border rounded bg-white">{order.customer.phone}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block font-medium">Address</label>
              <div className="p-2 border rounded bg-white">{order.customer.address}</div>
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
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Quantity</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => {
                const imageUrl = item.product.default_image
                  ? "/" + item.product.default_image.replace(/^\/+/, "")
                  : "/placeholder.png";
                const price = parseFloat(item.product.price) || 0;
                const subtotal = price * item.quantity;

                return (
                  <tr key={item.id}>
                    <td className="border p-2">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover mx-auto"
                      />
                    </td>
                    <td className="border p-2">{item.product.name}</td>
                    <td className="border p-2">${price.toFixed(2)}</td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="text-right font-bold text-lg mt-4">
            Total: ${(order.total ?? 0).toFixed(2)}
          </div>
        </div>

        {order.status !== "completed" && order.status !== "cancelled" && (
          <button
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel Order
          </button>
        )}
      </div>
    </CustomerLayout>
  );
}
