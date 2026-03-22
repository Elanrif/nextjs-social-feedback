import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/features/dashboard/users/user-edit-form";
import { fetchUserById } from "@/lib/users/services/user.service";
import { headers } from "next/headers";

export const metadata = {
  title: "Edit User",
  description: "Edit a user",
};

// SSR is intentional here: the edit form needs data immediately to pre-fill fields
// (no skeleton pattern applies cleanly to forms), and notFound() gives a proper 404
// if the user ID doesn't exist — both benefits justify the server-side fetch.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const res = await fetchUserById(Number(id), config);
  if (!res.ok) notFound();

  return <UserEditForm loadedUser={res.data} />;
}
