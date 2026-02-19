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
      
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
              Lifestyle
            </span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.08em] text-neutral-900">
              Casual Collection
            </h1>
            <div className="mt-3 h-1 w-16 bg-red-600" />
            <p className="mt-4 max-w-2xl text-sm text-neutral-600">
              Comfortable everyday wear that blends athletic style with street fashion.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
