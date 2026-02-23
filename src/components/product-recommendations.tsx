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
    <section className="bg-white py-16 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            You Might Also Like
          </h2>
          <div className="h-[2px] w-20 bg-gradient-to-r from-[#cc071e] to-transparent"></div>
          <p className="mt-4 text-gray-600">
            Explore our handpicked selection of products that complement your style
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

        {/* View All Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 border-2 border-slate-900 font-extrabold tracking-widest hover:bg-slate-900 hover:text-white transition">
            SHOP ALL PRODUCTS
          </button>
        </div>
      </div>
    </section>
  );
}
