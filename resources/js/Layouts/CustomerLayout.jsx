import React, { useEffect, useRef, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function CustomerLayout({ children }) {
  const { auth, categories = [], brands = [], cartCount = 0, flash, errors } =
    usePage().props;

  const customer = auth?.customer;

  const [search, setSearch] = useState("");
  const [openCat, setOpenCat] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const [openChat, setOpenChat] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const catRef = useRef(null);
  const brandRef = useRef(null);
  const customerRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setOpenCat(false);
      if (brandRef.current && !brandRef.current.contains(e.target))
        setOpenBrand(false);
      if (customerRef.current && !customerRef.current.contains(e.target))
        setOpenCustomer(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (flash?.success || errors?.error) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [flash, errors]);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get("/shop/products", { search });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not connect to assistant." },
      ]);
      console.error("Chat API error:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showFlash && flash?.success && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in z-50">
          {flash.success}
        </div>
      )}
      {showFlash && errors?.error && (
        <div className="fixed top-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in z-50">
          {errors.error}
        </div>
      )}

      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            MyShop
          </Link>
          <form onSubmit={handleSearch} className="flex items-center w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-l px-3 py-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r"
            >
              Search
            </button>
          </form>
          <div className="flex items-center space-x-6">
            <div ref={catRef} className="relative">
              <button
                onClick={() => setOpenCat(!openCat)}
                className="text-gray-700 hover:text-blue-600"
              >
                Categories
              </button>
              {openCat && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border z-50">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/shop/products?category=${c.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div ref={brandRef} className="relative">
              <button
                onClick={() => setOpenBrand(!openBrand)}
                className="text-gray-700 hover:text-blue-600"
              >
                Brands
              </button>
              {openBrand && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border z-50">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={`/shop/products?brand=${b.id}`}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/shop/cart" className="relative text-gray-700 hover:text-blue-600">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <div ref={customerRef} className="relative">
              {customer ? (
                <>
                  <button
                    onClick={() => setOpenCustomer(!openCustomer)}
                    className="text-gray-700 hover:text-blue-600"
                  >
                    {customer.name}
                  </button>
                  {openCustomer && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border z-50">
                      <Link
                        href="/customer/profile"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/customer/orders"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/customer/logout"
                        method="post"
                        as="button"
                        className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                      >
                        Logout
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <Link href="/customer/login" className="text-gray-700 hover:text-blue-600">
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 p-6">{children}</main>

      <footer className="bg-gray-800 text-white text-center py-4">
        © {new Date().getFullYear()} MyShop. All rights reserved.
      </footer>

      <div className="fixed bottom-6 right-6">
        {openChat ? (
          <div className="w-80 h-96 bg-white shadow-lg rounded-lg flex flex-col">
            <div className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
              <span>Chat Assistant</span>
              <button onClick={() => setOpenChat(false)}>×</button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg ${
                    m.sender === "user"
                      ? "bg-blue-100 self-end text-right"
                      : "bg-gray-100 self-start text-left"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>
            <form onSubmit={handleSend} className="p-3 border-t flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-l px-3 py-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setOpenChat(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700"
          >
            💬
          </button>
        )}
      </div>
    </div>
  );
}
