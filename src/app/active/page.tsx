import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

const activeProducts = [
  {
    id: "active-1",
    name: "Intensity Training Set",
    price: 89.99,
    image: "/images/categories/active.png",
    category: "Active",
  },
  {
    id: "active-2",
    name: "Elite Performance Kit",
    price: 99.99,
    image: "/images/categories/active.png",
    category: "Active",
  },
  {
    id: "active-3",
    name: "Athletic Pro Bundle",
    price: 94.99,
    image: "/images/categories/active.png",
    category: "Active",
  },
  {
    id: "active-4",
    name: "Power Flex Ensemble",
    price: 104.99,
    image: "/images/categories/active.png",
    category: "Active",
  },
  {
    id: "active-5",
    name: "Workout Essentials Set",
    price: 84.99,
    image: "/images/categories/active.png",
    category: "Active",
  },
  {
    id: "active-6",
    name: "Training Complete Pack",
    price: 109.99,
    image: "/images/categories/active.png",
    category: "Active",
  },
];

export default function ActivePage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
              Activewear
            </span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.08em] text-neutral-900">
              Active Collection
            </h1>
            <div className="mt-3 h-1 w-16 bg-red-600" />
            <p className="mt-4 max-w-2xl text-sm text-neutral-600">
              Complete training sets designed for intense workouts and heavy sessions.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {activeProducts.map((product) => (
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
