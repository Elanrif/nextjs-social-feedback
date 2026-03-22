import { CategoryCreateForm } from "@/components/features/dashboard/categories/category-create-form";

export const metadata = {
  title: "Create Category",
  description: "Create a new category",
};

export default function Page() {
  return <CategoryCreateForm />;
}
