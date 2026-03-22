import { ProductCreateForm } from "@/components/features/dashboard/products/product-create-form";

export const metadata = {
  title: "Create Product",
  description: "Create a new product",
};

export default function Page() {
  return <ProductCreateForm />;
}
