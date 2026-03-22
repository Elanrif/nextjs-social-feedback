import { ChangePassword } from "@/components/features/account/change-password";

export const metadata = {
  title: "Change Password",
  description: "Change your password",
};

export default async function Page() {
  return <ChangePassword />;
}
