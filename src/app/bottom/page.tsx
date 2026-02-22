import CategoryProductsPage from "@/components/category-products-page";

export const revalidate = 60;

export default function BottomPage() {
  return (
    <CategoryProductsPage
      slug="bottom"
      label="Bottoms"
      title="Bottom Collection"
      description="High-performance shorts, joggers, and leggings built for every rep and every run."
    />
  );
}

