import { ProfileEditForm } from "@/components/features/account/profile/profile-edit-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Profile",
  description: "Edit my profile",
};

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");
  return <ProfileEditForm />;
}
