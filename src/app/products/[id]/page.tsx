"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductRecommendations from "@/components/product-recommendations";
import { useCart } from "@/context/cart-context";

const product = {
  id: "active-1",
  category: "PERFORMANCE CORE",
  name: "APEX COMPRESSION TEE",
  price: 68.0,
  rating: 4.9,
  reviews: 124,
  description:
    "Engineered for high-intensity training. The Apex Compression Tee features moisture-wicking technology and 4-way stretch fabric to keep you cool and mobile during your toughest sets.",
  images: [
    "/images/categories/active.png",
    "/images/categories/bottom.png",
    "/images/categories/upper.png",
    "/images/categories/active.png",
    "/images/categories/bottom.png",
  ],
  colors: [
    { name: "Onyx Black", value: "#000000" },
    { name: "Steel Grey", value: "#94a3b8" },
    { name: "Crimson Red", value: "#cc071e" },
  ],
  sizes: ["S", "M", "L", "XL", "XXL"],
};

export default function ProductDetailPage() {
  const { addItem, itemCount, items, subtotal } = useCart();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState("description");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? "" : section);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      category: product.category,
      name: product.name,
      price: product.price,
      image: product.images[selectedImage],
      color: product.colors[selectedColor].name,
      size: selectedSize,
      quantity,
    });
    setIsCartOpen(true);
  };

  const handleCartButton = () => {
    if (itemCount > 0) {
      router.push("/cart");
      return;
    }

    handleAddToCart();
  };

  return (
    <main className="bg-[#f8f8f8] min-h-screen text-slate-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN - IMAGE GALLERY */}
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 lg:w-28 lg:flex-col lg:overflow-visible lg:pb-0">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-none border-2 lg:h-24 lg:w-24 ${
                      selectedImage === index
                        ? "border-[#cc071e]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="bg-white rounded-sm overflow-hidden aspect-[4/5] shadow-sm relative flex-1">
                <Image
                  src={product.images[selectedImage]}
                  alt="Product"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-8">

            {/* Header */}
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-gray-400 mb-2">
                {product.category}
              </p>

              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                {product.name}
              </h1>

              <div className="h-[2px] w-1/3 bg-gradient-to-r from-[#cc071e] to-transparent mb-4"></div>

              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-semibold text-[#cc071e]">
                  ${product.price.toFixed(2)}
                </span>

                <div className="flex items-center text-yellow-400">
                  <span className="text-sm font-medium text-gray-600 mr-2">
                    {product.rating}
                  </span>
                  ⭐
                  <span className="text-xs text-gray-400 ml-2">
                    ({product.reviews} Reviews)
                  </span>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <span className="text-sm font-bold uppercase tracking-wider">
                Select Color:{" "}
                <span className="font-normal text-gray-500">
                  {product.colors[selectedColor].name}
                </span>
              </span>

              <div className="flex space-x-3 mt-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-8 h-8 rounded-full transition-all ${
                      selectedColor === index
                        ? "ring-2 ring-[#cc071e] ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold uppercase tracking-wider">
                  Select Size
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 border text-sm font-bold uppercase transition ${
                      selectedSize === size
                        ? "border-[#cc071e] text-[#cc071e]"
                        : "border-gray-200 hover:border-[#cc071e]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-200 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2"
                >
                  -
                </button>

                <span className="px-4 font-bold">{quantity}</span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2"
                >
                  +
                </button>
              </div>

              <p className="text-sm text-green-600 font-medium">
                In Stock • Ready to ship
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCartButton}
                className="w-full bg-[#cc071e] text-white py-4 font-extrabold tracking-widest hover:bg-red-700 transition"
              >
                {itemCount > 0 ? "VIEW YOUR CART" : "ADD TO CART"}
              </button>

              <button className="w-full border-2 border-slate-900 py-4 font-extrabold tracking-widest hover:bg-slate-900 hover:text-white transition">
                BUY IT NOW
              </button>
            </div>

            {/* Accordion */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              
              {/* Description */}
              <div className="border-b border-gray-100 py-4">
                <button
                  onClick={() => toggleAccordion("description")}
                  className="w-full text-left font-bold text-sm uppercase tracking-widest flex justify-between"
                >
                  Description
                  {activeAccordion === "description" ? "-" : "+"}
                </button>

                {activeAccordion === "description" && (
                  <div className="mt-4 text-sm text-gray-600">
                    Designed for the elite athlete. This tee provides a locked-in feel with ventilation zones in high-heat areas.
                  </div>
                )}
              </div>

              {/* Fabric */}
              <div className="border-b border-gray-100 py-4">
                <button
                  onClick={() => toggleAccordion("fabric")}
                  className="w-full text-left font-bold text-sm uppercase tracking-widest flex justify-between"
                >
                  Fabric & Care
                  {activeAccordion === "fabric" ? "-" : "+"}
                </button>

                {activeAccordion === "fabric" && (
                  <div className="mt-4 text-sm text-gray-600">
                    88% Polyester, 12% Spandex. Machine wash cold.
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      </div>

      <ProductRecommendations currentProductId={product.id} />

      <Footer />

      {isCartOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={() => setIsCartOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100 p-6">
            <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900">
              Your Cart
            </h2>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="text-sm font-semibold text-gray-500 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is currently empty.</p>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center gap-4 border-b border-gray-100 pb-4">
                    <div className="relative h-20 w-16 overflow-hidden rounded-md bg-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {item.category}
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {item.color} • {item.size}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#cc071e]">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-6">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="mt-4 block w-full bg-[#cc071e] py-3 text-center text-sm font-extrabold uppercase tracking-[0.2em] text-white hover:bg-red-700 transition"
            >
              Checkout
            </Link>
            <button
              className="mt-3 w-full border-2 border-slate-900 py-3 text-sm font-extrabold uppercase tracking-[0.2em] text-slate-900 hover:bg-slate-900 hover:text-white transition"
              onClick={() => setIsCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </aside>
    </main>
  );
}