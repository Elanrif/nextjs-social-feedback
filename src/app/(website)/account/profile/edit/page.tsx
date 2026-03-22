import { ProfileEditForm } from "@/components/features/account/profile/profile-edit-form";
import { getCurrentUser } from "@/lib/auth/next-auth/next-auth.service";

export const metadata = {
  title: "Edit Profile",
  description: "Edit my profile",
};

export default async function Page() {
  const res = await getCurrentUser();
  if (!res.ok) {
    // Handle error, e.g., redirect to sign-in
    return <div>Error: Unauthorized</div>;
  }
  const { user } = res.data;

  return <ProfileEditForm loadedUser={user} />;
}
