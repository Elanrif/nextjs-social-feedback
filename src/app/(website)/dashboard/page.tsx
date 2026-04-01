import { redirect } from "next/navigation";
import { fetchAllUsers } from "@/lib/users/services/user.service";
import { fetchPosts } from "@/lib/posts/services/post.service";
import { fetchComments } from "@/lib/comments/services/comment.service";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/utils/utils";
import { DashboardHero } from "@/components/features/dashboard/dashboard-hero";
import { UserRole } from "@/lib/users/models/user.model";
import { auth } from "@/lib/auth";

export const metadata = {
  title: "Dashboard",
  description: "My modern dashboard with stats and recent activity",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/dashboard");
  const user = session.user;

  const [usersRes, postsRes, commentsRes] = await Promise.all([
    fetchAllUsers(),
    fetchPosts({ size: 100 }),
    fetchComments({ size: 100 }),
  ]);

  const users = usersRes.ok ? usersRes.data : [];
  const postData = postsRes.ok ? postsRes.data.content : [];
  const commentData = commentsRes.ok ? commentsRes.data.content : [];

  const totalUsers = users.length;
  const totalPosts = postData.length;
  const totalComments = commentData.length;

  const recentUsers = users.slice(0, 5);
  const recentPosts = postData.slice(0, 5);
  const recentComments = commentData.slice(0, 5);

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Hero */}
      <div className="card-gradient relative overflow-hidden rounded-2xl p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full
            bg-blue-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full
            bg-indigo-500/20 blur-3xl"
        />
        <DashboardHero user={user} />
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Posts",
            value: totalPosts,
            sub: "articles créés",
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            href: "/dashboard/posts",
          },
          {
            label: "Commentaires",
            value: totalComments,
            sub: "discussions actives",
            icon: MessageSquare,
            color: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-100",
            href: "/dashboard/comments",
          },
          {
            label: "Utilisateurs",
            value: totalUsers,
            sub: "inscrits",
            icon: Users,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            href: "/dashboard/users",
          },
          {
            label: "Engagements",
            value: totalPosts + totalComments,
            sub: "interactions",
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100",
            href: "/dashboard/posts",
          },
        ].map(({ label, value, sub, icon: Icon, color, bg, border, href }) => (
          <Link
            key={label}
            href={href}
            className={`group relative rounded-2xl border ${border} bg-white p-5 shadow-sm
            hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {label}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-400">{sub}</p>
              </div>
              <div className={`${bg} ${color} p-2.5 rounded-xl`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <ArrowRight
              className="absolute bottom-4 right-4 w-4 h-4 text-gray-300 group-hover:text-gray-500
                transition-colors"
            />
          </Link>
        ))}
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-gray-800">Posts récents</h2>
            </div>
            <Link
              href="/dashboard/posts"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center
                gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/dashboard/posts/${post.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80
                    transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400">
                      Par {post.author?.firstName || post.author?.email || "Anonyme"}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucun post</p>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-gray-800">Commentaires récents</h2>
            </div>
            <Link
              href="/dashboard/comments"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center
                gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <Link
                  key={comment.id}
                  href={`/dashboard/posts/${comment.postId}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80
                    transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate line-clamp-2">
                      {comment.content}
                    </p>
                    <p className="text-xs text-gray-400">
                      Par {comment.author?.firstName || comment.author?.email || "Anonyme"}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucun commentaire</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-semibold text-gray-800">Utilisateurs récents</h2>
            </div>
            <Link
              href="/dashboard/users"
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex
                items-center gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <Link
                  key={u.id}
                  href={`/dashboard/users/${u.id}`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50/80
                    transition-colors"
                >
                  <div
                    className="h-7 w-7 rounded-full bg-linear-to-br from-emerald-400 to-teal-500
                      flex items-center justify-center text-white text-xs font-semibold shrink-0"
                  >
                    {u.firstName?.slice(0, 1).toUpperCase() || u.email?.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {u.firstName} {u.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{u.email}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                      "text-xs font-medium",
                      u.role === UserRole.ADMIN
                        ? "bg-slate-900 text-white"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {u.role === UserRole.ADMIN && <ShieldCheck className="w-3 h-3" />}
                    {u.role}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucun utilisateur</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              href: "/dashboard/posts/create",
              icon: FileText,
              label: "Nouveau post",
              desc: "Publier un article",
              color: "from-blue-500 to-blue-600",
              hover: "hover:from-blue-600 hover:to-blue-700",
            },
            {
              href: "/dashboard/comments",
              icon: MessageSquare,
              label: "Voir commentaires",
              desc: "Gérer les discussions",
              color: "from-violet-500 to-violet-600",
              hover: "hover:from-violet-600 hover:to-violet-700",
            },
            {
              href: "/dashboard/users",
              icon: Users,
              label: "Gérer utilisateurs",
              desc: "Ajouter ou éditer",
              color: "from-emerald-500 to-emerald-600",
              hover: "hover:from-emerald-600 hover:to-emerald-700",
            },
          ].map(({ href, icon: Icon, label, desc, color, hover }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r ${color}
              ${hover} text-white shadow-sm hover:shadow-md transition-all duration-200
              hover:-translate-y-0.5`}
            >
              <div className="p-2 rounded-xl bg-white/20">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs text-white/70">{desc}</p>
              </div>
              <Plus className="w-4 h-4 ml-auto opacity-60 group-hover:opacity-100
                transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
