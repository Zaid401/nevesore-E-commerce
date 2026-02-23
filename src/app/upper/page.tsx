import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";

const upperProducts = [
  {
    id: "upper-1",
    name: "Elite Performance Tank",
    price: 39.99,
    image: "/images/categories/top.png",
    category: "Upper",
  },
  {
    id: "upper-2",
    name: "Athletic Compression Tee",
    price: 44.99,
    image: "/images/categories/top.png",
    category: "Upper",
  },
  {
    id: "upper-3",
    name: "Muscle Fit Crew Neck",
    price: 49.99,
    image: "/images/categories/top.png",
    category: "Upper",
  },
  {
    id: "upper-4",
    name: "Seamless Training Top",
    price: 54.99,
    image: "/images/categories/top.png",
    category: "Upper",
  },
  {
    id: "upper-5",
    name: "Power Flex Tank",
    price: 42.99,
    image: "/images/categories/top.png",
    category: "Upper",
  },
  {
    id: "upper-6",
    name: "Pro Circuit Tee",
    price: 47.99,
    image: "/images/categories/top.png",
    category: "Upper",
  },
];

export default function UpperPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 lg:mb-10  ">
            <span className="text-xs font-semibold uppercase tracking-widest text-red-600 ">
              Upper Body
            </span>
            <h1 className="mt-2 text-2xl font-black uppercase tracking-[0.08em] text-neutral-900 sm:mt-3 sm:text-3xl lg:text-4xl">
              Upper Collection
            </h1>
            <div className="mt-2 h-1 w-12 bg-red-600 sm:mt-3 sm:w-16" />
            <p className="mt-3 max-w-2xl text-xs text-neutral-600 sm:text-sm">
              Premium tops, tanks, and tees engineered for maximum performance and muscle definition.
            </p>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:gap-5 sm:grid-cols-2 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {upperProducts.map((product) => (
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
