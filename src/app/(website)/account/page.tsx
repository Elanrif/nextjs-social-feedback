import { auth } from "@/lib/auth/api/auth";
import { ROUTES } from "@/utils/routes";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  KeyRound,
  User,
  Pencil,
  Clock,
  Fingerprint,
} from "lucide-react";

export const metadata = {
  title: "Mon compte",
  description: "Gérez votre profil et vos paramètres",
};

export default async function AccountPage() {
  const response = await auth.api.getCurrentUser();

  if (!response.ok || !response.data) {
    redirect("/sign-in?callbackUrl=/account");
  }
  const { session, user } = response.data;

  const initials =
    user.firstName?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase() || "U";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const sessionExpires = "N/A";

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-7xl mx-auto">
      {/* Profile Hero Card */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-8 shadow-2xl">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full
            bg-indigo-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-8 h-48 w-48 rounded-full
            bg-blue-500/20 blur-3xl"
        />

        <div className="relative flex items-center gap-6">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className="h-20 w-20 rounded-2xl bg-linear-to-br from-indigo-400 to-blue-600 flex
                items-center justify-center text-white text-2xl font-bold shadow-lg ring-2
                ring-white/10"
            >
              {initials}
            </div>
            {user.emailVerified && (
              <div
                className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex
                  items-center justify-center ring-2 ring-slate-900"
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white truncate">
                {user.firstName} {user.lastName}
              </h1>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs
                  font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-indigo-500/30 text-indigo-300 ring-1 ring-indigo-400/30"
                      : "bg-white/10 text-white/70"
                  }`}
              >
                {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                {user.role}
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-1 truncate">{user.email}</p>
            <div className="flex items-center gap-1 mt-2 text-slate-500 text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>Membre depuis {memberSince}</span>
            </div>
          </div>

          {/* Edit button */}
          <Link
            href={ROUTES.EDIT_PROFILE}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10
              hover:bg-white/20 text-white text-sm font-medium transition-colors backdrop-blur-sm"
          >
            <Pencil className="w-3.5 h-3.5" />
            Modifier
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Info */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <Fingerprint className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">Session active</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Expire le</span>
              </div>
              <span className="text-xs font-medium text-gray-700 text-right">{sessionExpires}</span>
            </div>
            <div className="h-px bg-gray-50" />
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>ID utilisateur</span>
              </div>
              <span className="text-xs font-mono text-gray-600 bg-gray-50 px-2 py-0.5 rounded">
                {user.id}
              </span>
            </div>
          </div>
        </div>

        {/* Email Verification */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-violet-50">
              <Mail className="w-4 h-4 text-violet-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">Vérification</h2>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Adresse e-mail</p>
              <p className="text-sm font-medium text-gray-800 mt-0.5 truncate max-w-45">
                {user.email}
              </p>
            </div>
            {user.emailVerified ? (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50
                  text-emerald-700 text-xs font-semibold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vérifié
              </div>
            ) : (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50
                  text-amber-700 text-xs font-semibold"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                Non vérifié
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-800">Paramètres du compte</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            {
              href: ROUTES.VIEW_PROFILE,
              icon: User,
              label: "Voir mon profil",
              desc: "Informations personnelles",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              href: ROUTES.EDIT_PROFILE,
              icon: Pencil,
              label: "Modifier le profil",
              desc: "Nom, prénom, informations",
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              href: ROUTES.CHANGE_PASSWORD,
              icon: KeyRound,
              label: "Changer le mot de passe",
              desc: "Sécurité du compte",
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map(({ href, icon: Icon, label, desc, color, bg }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/80 transition-colors
                group"
            >
              <div className={`${bg} ${color} p-2.5 rounded-xl shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <ChevronRight
                className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors
                  shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
