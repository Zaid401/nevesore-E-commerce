import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import CategoryProductsPage from "@/components/category-products-page";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from("categories")
    .select("slug")
    .eq("is_active", true)
    .is("parent_id", null);

  return (data ?? []).map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!category) notFound();

  return (
    <CategoryProductsPage
      slug={slug}
      label={category.name}
      title={`${category.name} Collection`}
      description={category.description ?? ""}
    />
  );
}
