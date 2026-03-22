import { ProductList } from "@/components/features/dashboard/products/product-list";

export const metadata = {
  title: "Products",
  description: "Manage your products",
};

// No SSR here: this is a protected admin page (no SEO benefit), and the list
// works well with a skeleton loader. React Query handles fetching, caching,
// and automatic refetch after mutations (create/delete) without extra complexity.
export default function Page() {
  return <ProductList />;
}
