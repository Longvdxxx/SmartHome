import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

export default function ProductPage({ product, relatedProducts }) {
  const [mainImage, setMainImage] = useState(
    product.images.length ? product.images[0].image_url : null
  );
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { flash } = usePage().props;

  const firstThreeReviews = product.reviews.slice(0, 3);

  const handleAddToCart = () => {
    router.post(
      `/shop/cart/add/${product.id}`,
      { quantity: 1 },
      {
        preserveScroll: true,
        onSuccess: () => {
          alert(flash.success || "Added to cart successfully!");
        },
      }
    );
  };

  return (
    <CustomerLayout>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            {mainImage && (
              <div className="w-full h-[450px] bg-gray-100 flex items-center justify-center rounded">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            )}
            {product.images.length > 1 && (
              <div className="flex mt-4 gap-2 overflow-x-auto">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded cursor-pointer border"
                    onClick={() => setMainImage(img.image_url)}
                  >
                    <img
                      src={img.image_url}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-xl text-green-600 font-semibold">{product.price}</p>
            <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            <p className="text-gray-500">Stock: {product.stock}</p>
            <p className="text-lg font-semibold">
              ⭐{" "}
              {product.reviews.length > 0
                ? `${product.averageRating}/5`
                : "No review yet"}
            </p>

            {product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Add to Cart
              </button>
            ) : (
              <div className="text-red-600 font-bold py-2 px-4 border rounded bg-red-100">
                Out of Stock
              </div>
            )}

            {product.reviews.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Reviews</h2>
                <div className="space-y-4">
                  {firstThreeReviews.map((r) => {
                    const fullStars = Math.floor(r.rating);
                    const halfStar = r.rating - fullStars >= 0.5;
                    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                    return (
                      <div key={r.id} className="border-b pb-2">
                        <div className="flex items-center mb-1">
                          {Array(fullStars)
                            .fill(0)
                            .map((_, i) => (
                              <span key={`full-${i}`} className="text-yellow-400 text-lg">
                                ★
                              </span>
                            ))}
                          {halfStar && <span className="text-yellow-400 text-lg">☆</span>}
                          {Array(emptyStars)
                            .fill(0)
                            .map((_, i) => (
                              <span key={`empty-${i}`} className="text-gray-300 text-lg">
                                ★
                              </span>
                            ))}
                          <span className="ml-2 text-gray-500 text-sm">{r.rating}/5</span>
                        </div>
                        <p className="text-gray-600">{r.comment}</p>
                        <p className="text-xs text-gray-400">{r.created_at}</p>
                      </div>
                    );
                  })}
                  {product.reviews.length > 3 && (
                    <button
                      onClick={() => setShowAllReviews(true)}
                      className="text-blue-600 underline text-sm mt-2"
                    >
                      Show All Reviews
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">You may also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {relatedProducts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/products/${p.id}`}
                    className="group relative border rounded-lg p-4 bg-gray-50 flex flex-col w-52 h-80
                              transition-transform duration-300 hover:scale-125 hover:z-50 hover:shadow-2xl"
                  >
                    <div className="w-full h-40 bg-gray-200 mb-2 rounded overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No Image</span>
                      )}
                    </div>

                    <div className="flex flex-col flex-1">
                      <p className="font-bold text-left overflow-hidden whitespace-nowrap text-ellipsis
                                    group-hover:whitespace-normal group-hover:break-words group-hover:overflow-visible">
                        {p.name}
                      </p>
                      <p className="text-green-600 text-left">{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
          </div>
        )}

        {showAllReviews && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded shadow-lg max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">All Reviews</h3>
                <button
                  onClick={() => setShowAllReviews(false)}
                  className="text-gray-500 hover:text-gray-700 text-lg font-bold"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                {product.reviews.map((r) => {
                  const fullStars = Math.floor(r.rating);
                  const halfStar = r.rating - fullStars >= 0.5;
                  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

                  return (
                    <div key={r.id} className="border-b pb-2">
                      <div className="flex items-center mb-1">
                        {Array(fullStars)
                          .fill(0)
                          .map((_, i) => (
                            <span key={`full-${i}`} className="text-yellow-400 text-lg">
                              ★
                            </span>
                          ))}
                        {halfStar && <span className="text-yellow-400 text-lg">☆</span>}
                        {Array(emptyStars)
                          .fill(0)
                          .map((_, i) => (
                            <span key={`empty-${i}`} className="text-gray-300 text-lg">
                              ★
                            </span>
                          ))}
                        <span className="ml-2 text-gray-500 text-sm">{r.rating}/5</span>
                      </div>
                      <p className="text-gray-600">{r.comment}</p>
                      <p className="text-xs text-gray-400">{r.created_at}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
