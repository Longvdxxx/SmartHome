import React from "react";
import EmployeeLayout from "@/Layouts/EmployeeLayout";
import { router } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function PaymentConfirm({ customer, selectedProducts, total, csrfToken }) {
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitting order...");
    console.log("Customer:", customer);
    console.log("Selected Products:", selectedProducts);

    router.post(route("staff.payment.store"), { _token: csrfToken }, {
      onSuccess: () => {
        console.log("Order completed, clearing localStorage...");
        localStorage.removeItem('cartItems');
        alert('Order completed!');
        window.location.href = route('staff.dashboard');
      },
      onError: (errors) => {
        console.error("Error submitting order:", errors);
        alert("Error submitting order, check console.");
      }
    });
  };

  return (
    <EmployeeLayout>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Confirm Order</h1>

        <div className="border p-4 rounded bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">Customer Info</h2>
          <p><b>Name:</b> {customer.name}</p>
          <p><b>Phone:</b> {customer.phone}</p>
          <p><b>Address:</b> {customer.address}</p>
        </div>

        <table className="w-full table-auto border-collapse text-center mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Product</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {selectedProducts.map((item, i) => {
              const price = parseFloat(item.price) || 0;
              const subtotal = price * (item.quantity || 1);
              return (
                <tr key={i}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">${price.toFixed(2)}</td>
                  <td className="border p-2">{item.quantity || 1}</td>
                  <td className="border p-2">${subtotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="text-right font-bold text-lg mt-4">Total: ${total.toFixed(2)}</div>

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={() => window.history.back()} className="bg-gray-400 text-white px-4 py-2 rounded">Back</button>
          <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">Complete Payment</button>
        </div>
      </div>
    </EmployeeLayout>
  );
}
