import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { supabase } from "@/lib/supabase";

interface ProductRow {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  short_description: string | null;
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
      "id, name, base_price, sale_price, short_description, product_images(image_url, is_primary, sort_order)"
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

      <section className="py-14 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-6">
          <div className="mb-8 sm:mb-10 lg:mb-10">
            <span className="text-[10px] font-semibold uppercase  text-red-600 sm:text-xs">
              {label}
            </span>
            <h1 className="mt-2 text-2xl font-black uppercase text-neutral-900 sm:mt-3 sm:text-3xl lg:mt-3 lg:text-4xl">
              {title}
            </h1>
            <div className="mt-3 h-1 w-16 bg-red-600" />
            <p className="mt-3 max-w-2xl text-xs text-neutral-600 sm:mt-4 sm:text-sm">{description}</p>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center sm:py-20 lg:py-24">
              <p className="text-sm text-neutral-500 sm:text-base">No products available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.base_price}
                  sale_price={product.sale_price}
                  image={getProductImage(product)}
                  category={title}
                  short_description={product.short_description}
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
