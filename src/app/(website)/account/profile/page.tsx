import { ProfileDetail } from "@/components/features/account/profile/profile-detail";

export const metadata = {
  title: "Profile Details",
  description: "View details of your profile",
};

export default async function Page() {
  return <ProfileDetail />;
}
