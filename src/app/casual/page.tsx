import CategoryProductsPage from "@/components/category-products-page";

export const revalidate = 60;

export default function CasualPage() {
  return (
    <CategoryProductsPage
      slug="casual"
      label="Lifestyle"
      title="Casual Collection"
      description="Comfortable everyday wear that blends athletic style with street fashion."
    />
  );
}
