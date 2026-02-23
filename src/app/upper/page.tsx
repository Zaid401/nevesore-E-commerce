import CategoryProductsPage from "@/components/category-products-page";

export const revalidate = 60;

export default function UpperPage() {
  return (
    <CategoryProductsPage
      slug="upper"
      label="Upper Body"
      title="Upper Collection"
      description="Premium tops, tanks, and tees engineered for maximum performance and muscle definition."
    />
  );
}
