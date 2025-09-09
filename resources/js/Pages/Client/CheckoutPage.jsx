import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

export default function CheckoutPage({ cart, customer, csrfToken }) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const total = cart.items.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <form action="/shop/checkout/confirm" method="post">
          <input type="hidden" name="_token" value={csrfToken} />

          <div className="mb-6 border p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
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
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
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
                  placeholder="Street, City, State, ZIP..."
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
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Price</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => {
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
              Total: ${total.toFixed(2)}
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Next: Confirm
            </button>
            <Link
              href="/shop/cart"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Change Quantity
            </Link>
            <Link
              href="/shop/products"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </form>
      </div>
    </CustomerLayout>
  );
}
