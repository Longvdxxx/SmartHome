import React from "react";
import { Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

export default function ProductList({ products, filters, categories, brands }) {
  const { search, category, brand, sort } = filters;

  const handleFilter = (e) => {
    router.get(route("client-products.index"), {
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    router.get(route("client-products.index"), {
      ...filters,
      search: formData.get("search"),
    });
  };

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder="Search products..."
              className="border rounded px-4 py-2 w-64"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </form>

          {/* Category */}
          <select
            name="category"
            value={category || ""}
            onChange={handleFilter}
            className="border rounded px-4 py-2"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand */}
          <select
            name="brand"
            value={brand || ""}
            onChange={handleFilter}
            className="border rounded px-4 py-2"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            name="sort"
            value={sort || ""}
            onChange={handleFilter}
            className="border rounded px-4 py-2"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Products */}
        {products.data.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.data.map((p) => (
              <Link
                key={p.id}
                href={`/shop/products/${p.id}`}
                className="group relative border rounded-lg p-4 bg-gray-50 w-60 h-80 flex flex-col justify-between
                           transition-transform duration-300 hover:scale-125 hover:z-50 hover:shadow-2xl"
              >
                <div className="w-full h-48 bg-gray-200 mb-2 rounded overflow-hidden flex items-center justify-center">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>

                <div>
                  <p className="font-bold overflow-hidden whitespace-nowrap text-ellipsis
                                 group-hover:whitespace-normal group-hover:break-words group-hover:overflow-visible">
                    {p.name}
                  </p>
                  <p className="text-green-600">{p.price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}

        {/* Pagination */}
        <div className="mt-6 flex justify-center gap-2">
          {products.links.map((link, i) => (
            <button
              key={i}
              disabled={!link.url}
              onClick={() => link.url && router.get(link.url)}
              className={`px-3 py-1 rounded ${
                link.active
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      </div>
    </CustomerLayout>
  );
}
