import { CategoryList } from "@/components/features/dashboard/categories/category-list";
import { Category } from "@/lib/categories/models/category.model";
import { fetchCategories } from "@/lib/categories/services/category.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Categories",
  description: "Manage your categories",
};

//⚠️ SSR is intentional here — this page deliberately does NOT use React Query.
// The goal is to demonstrate the alternative pattern:
//   1. The server fetches categories and passes them as `initialCategories` props.
//   2. CategoryList stores them in local useState.
//   3. On delete, the component filters the deleted item out of the local state
//      directly (setCategories(prev => prev.filter(...))), so the row disappears
//      instantly without any refetch or external cache.
// This is a valid approach when you want full control over local state mutations
// without the overhead of a caching layer like React Query.
export default async function Page() {
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };
  const res = await fetchCategories(config);
  let initialCategory: Category[] = [];
  if (res.ok) {
    initialCategory = res.data || [];
  }
  return <CategoryList initialCategories={initialCategory} />;
}
