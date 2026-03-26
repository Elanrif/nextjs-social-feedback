import { redirect } from "next/navigation";
import { fetchProducts } from "@/lib/products/services/product.service";
import { fetchCategories } from "@/lib/categories/services/category.service";
import { fetchAllUsers } from "@/lib/users/services/user.service";
import { headers } from "next/headers";
import Link from "next/link";
import {
  Package,
  Tag,
  Users,
  TrendingUp,
  ArrowRight,
  Plus,
  Activity,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";
import { auth } from "@/lib/auth/api/auth";
import { cn } from "@/utils/utils";
import { isApiError } from "@/shared/errors/api-error";

export const metadata = {
  title: "Dashboard",
  description: "My modern dashboard with stats and recent activity",
};

export default async function DashboardPage() {
  const response = await auth.api.getCurrentUser();
  if (!response.ok || !response.data) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }
  const { user } = response.data;

  const reqHeaders = await headers();
  const config = { headers: reqHeaders };

  const [productsRes, categoriesRes, usersRes] = await Promise.all([
    fetchProducts(config),
    fetchCategories(config),
    fetchAllUsers(config),
  ]);

  const products = productsRes.ok ? productsRes.data.content || [] : [];
  const categories = isApiError(categoriesRes) ? [] : categoriesRes;
  const users = usersRes.ok ? usersRes.data : [];

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalUsers = users.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const activeRate = totalProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0;

  const recentProducts = products.slice(0, 5);
  const recentCategories = categories.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  const initials =
    user.firstName?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "U";

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
        <div className="relative flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
              <Activity className="w-4 h-4" />
              <span>Vue d&apos;ensemble</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Bonjour, {user.firstName || "Admin"} 👋
            </h1>
            <p className="text-slate-400 text-sm max-w-md">
              Voici un résumé de votre activité. Tout se passe bien aujourd&apos;hui.
            </p>
          </div>
          <div className="hidden md:flex flex-col items-center gap-2">
            <div
              className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-400 to-indigo-600 flex
                items-center justify-center text-white text-xl font-bold shadow-lg ring-2
                ring-white/10"
            >
              {initials}
            </div>
            <span className="text-xs text-slate-400">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Produits",
            value: totalProducts,
            sub: `${activeProducts} actifs`,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            href: "/dashboard/products",
          },
          {
            label: "Catégories",
            value: totalCategories,
            sub: "organisées",
            icon: Tag,
            color: "text-violet-600",
            bg: "bg-violet-50",
            border: "border-violet-100",
            href: "/dashboard/categories",
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
            label: "Taux actif",
            value: `${activeRate}%`,
            sub: "des produits",
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100",
            href: "/dashboard/products",
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
        {/* Recent Products */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              <h2 className="text-sm font-semibold text-gray-800">Produits récents</h2>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center
                gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentProducts.length > 0 ? (
              recentProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/dashboard/products/${product.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80
                    transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {new Intl.NumberFormat("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      }).format(product.price)}
                    </p>
                  </div>
                  {product.isActive ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-300 shrink-0 ml-2" />
                  )}
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucun produit</p>
            )}
          </div>
        </div>

        {/* Recent Categories */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-violet-500" />
              <h2 className="text-sm font-semibold text-gray-800">Catégories récentes</h2>
            </div>
            <Link
              href="/dashboard/categories"
              className="text-xs text-violet-600 hover:text-violet-700 font-medium flex items-center
                gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentCategories.length > 0 ? (
              recentCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/dashboard/categories/${category.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50/80
                    transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{category.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {category.description || "Aucune description"}
                    </p>
                  </div>
                  <span
                    className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
                      category.isActive
                        ? "bg-violet-100 text-violet-700"
                        : "bg-gray-100 text-gray-500"
                      }`}
                  >
                    {category.isActive ? "Active" : "Inactive"}
                  </span>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-8">Aucune catégorie</p>
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
                      u.role === "ADMIN" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {u.role === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
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
              href: "/dashboard/products/create",
              icon: Package,
              label: "Nouveau produit",
              desc: "Ajouter au catalogue",
              color: "from-blue-500 to-blue-600",
              hover: "hover:from-blue-600 hover:to-blue-700",
            },
            {
              href: "/dashboard/categories/create",
              icon: Tag,
              label: "Nouvelle catégorie",
              desc: "Organiser les produits",
              color: "from-violet-500 to-violet-600",
              hover: "hover:from-violet-600 hover:to-violet-700",
            },
            {
              href: "/dashboard/users/create",
              icon: Users,
              label: "Nouvel utilisateur",
              desc: "Ajouter un membre",
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
