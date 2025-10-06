import React from "react";
import { router } from "@inertiajs/react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";

export default function OrderIndex({ orders }) {
  const handleCancel = (orderId) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      router.post(`/staff/orders/${orderId}/cancel`);
    }
  };

  return (
    <EmployeeLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>

        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Created At</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border p-2">{order.id}</td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">${(order.total ?? 0).toFixed(2)}</td>
                  <td className="border p-2">{order.created_at}</td>
                  <td className="border p-2 flex justify-center gap-2">
                    <button
                      onClick={() => router.get(`/staff/orders/${order.id}`)}
                      className="bg-blue-300 text-white px-2 py-1 rounded hover:bg-blue-400"
                    >
                      View
                    </button>
                    {order.can_cancel && order.status.toLowerCase() !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </EmployeeLayout>
  );
}
