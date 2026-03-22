import { UserCreateForm } from "@/components/features/dashboard/users/user-create-form";

export const metadata = {
  title: "Create User",
  description: "Create a new user",
};

export default function Page() {
  return <UserCreateForm />;
}
