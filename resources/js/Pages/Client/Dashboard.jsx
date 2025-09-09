import React from "react";
import { Link } from "@inertiajs/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CustomerLayout from "@/Layouts/CustomerLayout";

export default function Dashboard({ user, banners, bestSellers, newProducts }) {
  const shuffledBanners = [...banners].sort(() => 0.5 - Math.random()).slice(0, 6);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <CustomerLayout>
      <div className="p-6 space-y-10">
        {user && (
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user.name} 👋</h1>
            <p className="text-gray-600">Check out the latest deals and updates.</p>
          </div>
        )}

        {/* Banner slider */}
        <div className="w-full">
          <Slider {...sliderSettings}>
            {shuffledBanners.map((banner) => (
              <Link
                key={banner.id}
                href={`/shop/products/${banner.productId}`}
                className="block w-full h-[400px] bg-gray-300 flex items-center justify-center"
              >
                <img
                  src={banner.image}
                  alt={banner.name}
                  className="w-full h-full object-contain"
                />
              </Link>
            ))}
          </Slider>
        </div>

        {/* Best Sellers */}
        <div>
          <h2 className="text-xl font-bold mb-4">🔥 Best Sellers</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {bestSellers.map((product) => (
              <Link
                key={product.id}
                href={`/shop/products/${product.id}`}
                className="border rounded-lg p-4 hover:shadow bg-gray-50 flex flex-col"
              >
                <div className="w-48 h-48 bg-gray-200 mb-2 rounded overflow-hidden flex items-center justify-center mx-auto">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>

                <div className="flex flex-col flex-1">
                  <p className="font-bold text-left line-clamp-1">{product.name}</p>
                  <p className="text-green-600 text-left">{product.price}</p>
                  <p className="text-sm text-gray-500 text-left">{product.sold} sold</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div>
          <h2 className="text-xl font-bold mb-4">🆕 New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {newProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/products/${product.id}`}
                className="border rounded-lg p-4 hover:shadow bg-gray-50 flex flex-col"
              >
                <div className="w-48 h-48 bg-gray-200 mb-2 rounded overflow-hidden flex items-center justify-center mx-auto">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">No Image</span>
                  )}
                </div>
                <p className="font-bold line-clamp-1 text-left">{product.name}</p>
                <p className="text-green-600 text-left">{product.price}</p>
                <p className="text-xs text-gray-400 text-left">{product.addedDate}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
