import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

const bottomProducts = [
  {
    id: "bottom-1",
    name: "Power Flex Joggers",
    price: 59.99,
    image: "/images/categories/bottom.png",
    category: "Bottom",
  },
  {
    id: "bottom-2",
    name: "Athletic Fit Shorts",
    price: 44.99,
    image: "/images/categories/bottom.png",
    category: "Bottom",
  },
  {
    id: "bottom-3",
    name: "Compression Tights",
    price: 54.99,
    image: "/images/categories/bottom.png",
    category: "Bottom",
  },
  {
    id: "bottom-4",
    name: "Training Sweatpants",
    price: 64.99,
    image: "/images/categories/bottom.png",
    category: "Bottom",
  },
  {
    id: "bottom-5",
    name: "Performance Leggings",
    price: 49.99,
    image: "/images/categories/bottom.png",
    category: "Bottom",
  },
  {
    id: "bottom-6",
    name: "Workout Track Pants",
    price: 69.99,
    image: "/images/categories/bottom.png",
    category: "Bottom",
  },
];

export default function BottomPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
              Lower Body
            </span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.08em] text-neutral-900">
              Bottom Collection
            </h1>
            <div className="mt-3 h-1 w-16 bg-red-600" />
            <p className="mt-4 max-w-2xl text-sm text-neutral-600">
              High-performance pants, shorts, and leggings built for unrestricted movement.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bottomProducts.map((product) => (
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
        </div>
      </section>

      <Footer />
    </main>
  );
}
