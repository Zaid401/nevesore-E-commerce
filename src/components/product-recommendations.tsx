"use client";

import ProductCard from "./product-card";

interface RecommendedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface ProductRecommendationsProps {
  currentProductId: string;
  allProducts?: RecommendedProduct[];
}

const defaultProducts: RecommendedProduct[] = [
  {
    id: "active-2",
    name: "ELITE PERFORMANCE SHORTS",
    price: 54.99,
    image: "/images/categories/bottom.png",
    category: "PERFORMANCE CORE",
  },
  {
    id: "active-3",
    name: "ULTRA COMFORT HOODIE",
    price: 89.99,
    image: "/images/categories/upper.png",
    category: "CASUAL WEAR",
  },
  {
    id: "casual-1",
    name: "FLEX TRAINING PANTS",
    price: 72.99,
    image: "/images/categories/bottom.png",
    category: "TRAINING",
  },
  {
    id: "casual-2",
    name: "BREATHABLE SPORTS BRA",
    price: 64.99,
    image: "/images/categories/active.png",
    category: "PERFORMANCE CORE",
  },
];

export default function ProductRecommendations({
  currentProductId,
  allProducts,
}: ProductRecommendationsProps) {
  const products = allProducts || defaultProducts;

  // Filter out the current product from recommendations
  const recommendedProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 4);

  return (
    <section className="bg-white py-12 border-t border-gray-200 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 sm:text-3xl lg:text-3xl">
            You Might Also Like
          </h2>
          <div className="h-[2px] w-16 bg-gradient-to-r from-[#cc071e] to-transparent sm:w-20 lg:w-20"></div>
          <p className="mt-3 text-sm text-gray-600 sm:mt-4 sm:text-base lg:text-base">
            Explore our handpicked selection of products that complement your style
          </p>
        </div>

        {/* Products Grid */}
        {recommendedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-10 text-center sm:px-6 sm:py-12 lg:px-8 lg:py-14">
            <p className="text-sm font-semibold text-slate-900 sm:text-base lg:text-base">
              No recommendations available right now.
            </p>
            <p className="mt-2 text-xs text-gray-600 sm:text-sm lg:text-sm">
              Check back soon for more suggestions.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="mt-8 text-center sm:mt-10 lg:mt-12">
          <button className="px-6 py-2 text-xs border-2 border-slate-900 font-extrabold uppercase transition hover:bg-slate-900 hover:text-white sm:px-8 sm:py-3 sm:text-sm lg:px-8 lg:py-3 lg:text-sm">
            SHOP ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
}
