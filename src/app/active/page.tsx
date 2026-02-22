import CategoryProductsPage from "@/components/category-products-page";

export const revalidate = 60;

export default function ActivePage() {
  return (
    <CategoryProductsPage
      slug="active"
      label="Activewear"
      title="Active Collection"
      description="Complete training sets designed for intense workouts and heavy sessions."
    />
  );
}
