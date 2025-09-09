import React, { useState, useEffect } from "react";
import { useForm, usePage, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

export default function Cart({ cart }) {
  const { flash } = usePage().props;

  const [quantities, setQuantities] = useState(
    cart.items.reduce((acc, item) => {
      acc[item.id] = item.quantity;
      return acc;
    }, {})
  );

  const { post, delete: destroy } = useForm();

  useEffect(() => {
    if (flash.error) {
      alert(flash.error);
      window.location.reload();
    }
  }, [flash.error]);

  const handleQuantityChange = (itemId, value) => {
    if (value < 1) return;
    setQuantities((prev) => ({ ...prev, [itemId]: value }));
  };

  const updateQuantity = (itemId) => {
    const qty = quantities[itemId];
    if (!qty || qty < 1) return;

    post(`/shop/cart/update/${itemId}/${qty}`, {
      preserveScroll: true,
      onSuccess: (page) => {
        if (page && page.quantity !== undefined) {
          setQuantities((prev) => ({
            ...prev,
            [itemId]: page.quantity,
          }));
        }
      },
      onError: (e) => console.error("Update failed", e),
    });
  };

  const removeItem = (itemId) => {
    destroy(`/shop/cart/remove/${itemId}`, {
      preserveScroll: true,
      onSuccess: (page) => {
        setQuantities((prev) => {
          const newQuantities = { ...prev };
          delete newQuantities[itemId];
          return newQuantities;
        });
      },
      onError: (e) => console.error("Remove failed", e),
    });
  };

  const total = cart.items.reduce((sum, item) => {
    const price = parseFloat(item.product.price) || 0;
    const qty = quantities[item.id] || item.quantity;
    return sum + price * qty;
  }, 0);

  return (
    <CustomerLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

        {flash.success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{flash.success}</div>
        )}

        {cart.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => {
              const price = parseFloat(item.product.price) || 0;
              const qty = quantities[item.id] || item.quantity;
              const subtotal = price * qty;

              return (
                <div key={item.id} className="flex justify-between items-center border p-4 rounded">
                  <div>
                    <h2 className="font-semibold">{item.product.name}</h2>
                    <p>Price: ${price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={qty}
                        onChange={(e) =>
                          handleQuantityChange(item.id, parseInt(e.target.value))
                        }
                        className="w-16 border rounded p-1"
                      />
                      <button
                        onClick={() => updateQuantity(item.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="font-semibold">${subtotal.toFixed(2)}</p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="text-right font-bold text-lg">Total: ${total.toFixed(2)}</div>
            <div className="text-right">
              <Link
                href="/shop/checkout"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
