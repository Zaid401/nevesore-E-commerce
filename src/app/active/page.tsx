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
      
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
              Activewear
            </span>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-neutral-900 sm:mt-3 sm:text-3xl lg:text-4xl">
              Active Collection
            </h1>
            <div className="mt-2 h-1 w-12 bg-red-600 sm:mt-3 sm:w-16" />
            <p className="mt-3 max-w-2xl text-xs text-neutral-600 sm:text-sm">
              Complete training sets designed for intense workouts and heavy sessions.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
