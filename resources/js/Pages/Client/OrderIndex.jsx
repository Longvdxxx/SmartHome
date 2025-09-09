import React from "react";
import { Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

export default function OrderIndex({ orders }) {
  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
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
                  <td className="border p-2">
                    ${(order.total ?? 0).toFixed(2)}
                  </td>
                  <td className="border p-2">{order.created_at}</td>
                  <td className="border p-2">
                    <Link
                      href={`/shop/orders/${order.id}`}
                      className="text-blue-600 underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </CustomerLayout>
  );
}
