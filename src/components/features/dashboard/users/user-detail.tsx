"use client";

import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Hash,
  Calendar,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react";
import { User, UserRole } from "@/lib/users/models/user.model";

const { DASHBOARD, USERS } = ROUTES;

export function UserDetail({ user }: { user: User }) {
  const initials = (user.firstName?.slice(0, 1) || "") + (user.lastName?.slice(0, 1) || "");
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "—";

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl card-gradient shadow-xl">
        <div className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="h-24 w-24 rounded-2xl bg-linear-to-br from-emerald-400 to-teal-500 flex
                  items-center justify-center text-white text-3xl font-bold shadow-lg ring-4
                  ring-white/10"
              >
                {initials.toUpperCase() || "U"}
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2
                  border-slate-900 flex items-center justify-center ${
                    user.isActive ? "bg-emerald-400" : "bg-red-400"
                  }`}
              >
                {user.isActive ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-white" />
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">{fullName}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                    font-semibold ring-1 ${
                      isAdmin
                        ? "bg-emerald-500/25 text-emerald-300 ring-emerald-400/30"
                        : "bg-white/10 text-white/60 ring-white/10"
                    }`}
                >
                  {isAdmin && <ShieldCheck className="w-3 h-3" />}
                  {user.role}
                </span>
              </div>

              <p className="text-slate-400 text-sm mt-1.5 truncate">{user.email}</p>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {memberSince && (
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Membre depuis {memberSince}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-400">{user.id}</span>
                </div>
                <div
                  className={`flex items-center gap-1.5 text-xs font-semibold ${
                    user.isActive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {user.isActive ? "Compte actif" : "Compte inactif"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="relative border-t border-white/5 px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3.5 h-3.5" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.phoneNumber && (
            <>
              <div className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone className="w-3.5 h-3.5" />
                <span>{user.phoneNumber}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Mail,
            label: "E-mail",
            value: user.email,
            sub: "Adresse de connexion",
            color: "text-violet-600",
            bg: "bg-violet-50",
            ring: "ring-violet-100",
          },
          {
            icon: Phone,
            label: "Téléphone",
            value: user.phoneNumber || "—",
            sub: user.phoneNumber ? "Numéro vérifié" : "Non renseigné",
            color: "text-blue-600",
            bg: "bg-blue-50",
            ring: "ring-blue-100",
          },
          {
            icon: isAdmin ? ShieldCheck : UserIcon,
            label: "Rôle",
            value: user.role,
            sub: isAdmin ? "Accès complet" : "Accès standard",
            color: isAdmin ? "text-emerald-600" : "text-gray-500",
            bg: isAdmin ? "bg-emerald-50" : "bg-gray-50",
            ring: isAdmin ? "ring-emerald-100" : "ring-gray-100",
          },
          {
            icon: user.isActive ? CheckCircle2 : XCircle,
            label: "Statut",
            value: user.isActive ? "Actif" : "Inactif",
            sub: user.isActive ? "Peut se connecter" : "Accès suspendu",
            color: user.isActive ? "text-emerald-600" : "text-red-500",
            bg: user.isActive ? "bg-emerald-50" : "bg-red-50",
            ring: user.isActive ? "ring-emerald-100" : "ring-red-100",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg, ring }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5
              shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
          >
            <div className={`${bg} ${color} ${ring} p-3 rounded-xl shrink-0 ring-1`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-semibold text-gray-800 mt-0.5 truncate">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${USERS}`}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border
            border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
            transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${USERS}/edit/${user.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl
            gradient-primary text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
            transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier l&apos;utilisateur
        </Link>
      </div>
    </div>
  );
}
