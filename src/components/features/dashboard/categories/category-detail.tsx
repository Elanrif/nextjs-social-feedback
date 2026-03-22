"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@/lib/categories/models/category.model";
import LoadingPage from "@components/features/loading-page";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  Tag,
  Hash,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Link as LinkIcon,
} from "lucide-react";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryDetail({ data }: { data: Category | null }) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setCategory(data);
      setLoading(false);
    }, 200);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [data]);

  if (loading) return <LoadingPage loading={true} text="Chargement de la catégorie..." />;
  if (!category)
    return <div className="text-center py-16 text-gray-400 text-sm">Catégorie introuvable.</div>;

  const createdAt = new Date(category.createdAt).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl card-gradient shadow-xl">
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full
            bg-violet-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-12 h-56 w-56 rounded-full
            bg-purple-500/15 blur-3xl"
        />

        <div className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="relative shrink-0">
              <div
                className="h-20 w-20 rounded-2xl bg-violet-500/20 ring-2 ring-violet-400/30 flex
                  items-center justify-center shadow-lg"
              >
                <Tag className="w-9 h-9 text-violet-300" />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2
                  border-slate-900 ${category.isActive ? "bg-emerald-400" : "bg-red-400"}`}
              />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">{category.name}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                    font-semibold ring-1 ${
                      category.isActive
                        ? "bg-violet-500/25 text-violet-300 ring-violet-400/30"
                        : "bg-red-500/20 text-red-300 ring-red-400/30"
                    }`}
                >
                  {category.isActive ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {category.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-slate-500 text-sm mt-1.5 font-mono truncate">/{category.slug}</p>

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Créée le {createdAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-mono text-slate-400">{category.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="relative border-t border-white/5 px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <LinkIcon className="w-3.5 h-3.5" />
            <span className="font-mono truncate">{category.slug}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div
            className={`text-xs font-semibold ${
              category.isActive ? "text-violet-400" : "text-red-400"
            }`}
          >
            {category.isActive ? "Catégorie active" : "Catégorie inactive"}
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Tag,
            label: "Nom",
            value: category.name,
            sub: "Nom affiché en catalogue",
            color: "text-violet-600",
            bg: "bg-violet-50",
            ring: "ring-violet-100",
          },
          {
            icon: LinkIcon,
            label: "Slug",
            value: category.slug,
            sub: "Identifiant URL",
            color: "text-blue-600",
            bg: "bg-blue-50",
            ring: "ring-blue-100",
            mono: true,
          },
          {
            icon: category.isActive ? CheckCircle2 : XCircle,
            label: "Statut",
            value: category.isActive ? "Active" : "Inactive",
            sub: category.isActive ? "Visible en catalogue" : "Masquée du catalogue",
            color: category.isActive ? "text-emerald-600" : "text-red-500",
            bg: category.isActive ? "bg-emerald-50" : "bg-red-50",
            ring: category.isActive ? "ring-emerald-100" : "ring-red-100",
          },
          {
            icon: Calendar,
            label: "Créée le",
            value: createdAt,
            sub: "Date de création",
            color: "text-gray-500",
            bg: "bg-gray-50",
            ring: "ring-gray-100",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg, ring, mono }) => (
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
              <p
                className={`text-sm font-semibold text-gray-800 mt-0.5 truncate
                ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      {category.description && (
        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="bg-gray-50 text-gray-500 ring-1 ring-gray-100 p-3 rounded-xl shrink-0
            h-fit">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{category.description}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${CATEGORIES}`}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border
            border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
            transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${CATEGORIES}/edit/${category.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl
            bg-linear-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700
            text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
            transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier la catégorie
        </Link>
      </div>
    </div>
  );
}
