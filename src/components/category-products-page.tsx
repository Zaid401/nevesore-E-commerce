import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { supabase } from "@/lib/supabase";

interface ProductRow {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  product_images: { image_url: string; is_primary: boolean; sort_order: number }[];
}

async function fetchCategoryProducts(slug: string): Promise<ProductRow[]> {
  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) return [];

  const { data } = await supabase
    .from("products")
    .select(
      "id, name, base_price, sale_price, product_images(image_url, is_primary, sort_order)"
    )
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (data as ProductRow[]) ?? [];
}

function getProductImage(product: ProductRow): string {
  if (!product.product_images?.length) return "/images/categories/placeholder.png";
  const sorted = [...product.product_images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    return a.sort_order - b.sort_order;
  });
  return sorted[0]?.image_url ?? "/images/categories/placeholder.png";
}

interface CategoryPageConfig {
  slug: string;
  label: string;
  title: string;
  description: string;
}

export default async function CategoryProductsPage({
  slug,
  label,
  title,
  description,
}: CategoryPageConfig) {
  const products = await fetchCategoryProducts(slug);

  return (
    <main className="min-h-screen bg-neutral-50">
      <Navbar />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-red-600">
              {label}
            </span>
            <h1 className="mt-3 text-4xl font-black uppercase tracking-[0.08em] text-neutral-900">
              {title}
            </h1>
            <div className="mt-3 h-1 w-16 bg-red-600" />
            <p className="mt-4 max-w-2xl text-sm text-neutral-600">{description}</p>
          </div>

          {products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="text-base text-neutral-500">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.base_price}
                  sale_price={product.sale_price}
                  image={getProductImage(product)}
                  category={title}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
