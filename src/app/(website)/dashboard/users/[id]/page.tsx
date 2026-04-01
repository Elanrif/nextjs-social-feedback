import { notFound } from "next/navigation";
import { UserDetail } from "@/components/features/dashboard/users/user-detail";
import { fetchUserById } from "@/lib/users/services/user.service";

export const metadata = {
  title: "User Details",
  description: "View details of a user",
};

// SSR is intentional here: a detail page either has data or doesn't exist.
// notFound() on the server gives a clean 404 without a client-side loading state.
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetchUserById(Number(id));
  if (!res.ok) notFound();

  return <UserDetail user={res.data} />;
}
