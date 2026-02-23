import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

const casualProducts = [
  {
    id: "casual-1",
    name: "Comfort Fit Hoodie",
    price: 64.99,
    image: "/images/categories/active.png",
    category: "Casual",
  },
  {
    id: "casual-2",
    name: "Lifestyle Crew Tee",
    price: 34.99,
    image: "/images/categories/active.png",
    category: "Casual",
  },
  {
    id: "casual-3",
    name: "Everyday Joggers",
    price: 54.99,
    image: "/images/categories/active.png",
    category: "Casual",
  },
  {
    id: "casual-4",
    name: "Relaxed Track Jacket",
    price: 74.99,
    image: "/images/categories/active.png",
    category: "Casual",
  },
  {
    id: "casual-5",
    name: "Street Style Shorts",
    price: 39.99,
    image: "/images/categories/active.png",
    category: "Casual",
  },
  {
    id: "casual-6",
    name: "Urban Comfort Sweats",
    price: 59.99,
    image: "/images/categories/active.png",
    category: "Casual",
  },
];

export default function CasualPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
              Lifestyle
            </span>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-neutral-900 sm:mt-3 sm:text-3xl lg:text-4xl">
              Casual Collection
            </h1>
            <div className="mt-2 h-1 w-12 bg-red-600 sm:mt-3 sm:w-16" />
            <p className="mt-3 max-w-2xl text-xs text-neutral-600 sm:text-sm">
              Comfortable everyday wear that blends athletic style with street fashion.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {casualProducts.map((product) => (
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
