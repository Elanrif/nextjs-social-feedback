import { notFound } from "next/navigation";
import { CategoryEditForm } from "@/components/features/dashboard/categories/category-edit-form";
import { fetchCategory } from "@/lib/categories/services/category.service";
import { headers } from "next/headers";
import { isApiError } from "@/shared/errors/api-error";

export const metadata = {
  title: "Edit Category",
  description: "Edit an existing category",
};

// SSR is intentional here: the edit form needs data immediately to pre-fill fields
// (no skeleton pattern applies cleanly to forms), and notFound() gives a proper 404
// if the product ID doesn't exist — both benefits justify the server-side fetch.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchCategory(config, Number(id));
  if (isApiError(res)) notFound();

  return <CategoryEditForm category={res} />;
}
