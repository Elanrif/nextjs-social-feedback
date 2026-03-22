import { UserList } from "@/components/features/dashboard/users/user-list";

export const metadata = {
  title: "Users",
  description: "Manage your users",
};

// No SSR here: this is a protected admin page (no SEO benefit), and the list
// works well with a skeleton loader. React Query handles fetching, caching,
// and automatic refetch after mutations (create/delete) without extra complexity.
export default function Page() {
  return <UserList />;
}
