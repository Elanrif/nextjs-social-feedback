"use client";

import { Product } from "@/lib/products/models/product.model";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  Package,
  Euro,
  Box,
  Tag,
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Hash,
  Link as LinkIcon,
} from "lucide-react";

const { DASHBOARD, PRODUCTS } = ROUTES;

const getStockInfo = (stock: number) => {
  if (stock > 10)
    return {
      label: "En stock",
      sub: `${stock} unités disponibles`,
      cls: "bg-emerald-50 text-emerald-700 ring-emerald-100",
      dot: "bg-emerald-400",
    };
  if (stock > 0)
    return {
      label: "Stock faible",
      sub: `Plus que ${stock} unité${stock > 1 ? "s" : ""}`,
      cls: "bg-amber-50 text-amber-700 ring-amber-100",
      dot: "bg-amber-400",
    };
  return {
    label: "Rupture de stock",
    sub: "Aucune unité disponible",
    cls: "bg-red-50 text-red-700 ring-red-100",
    dot: "bg-red-400",
  };
};

export function ProductDetail({ product }: { product: Product }) {
  const stock = getStockInfo(product.stock);

  const createdAt = product.createdAt
    ? new Date(product.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const price = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(product.price);

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl card-gradient shadow-xl">
        <div className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Icon */}
            <div className="relative shrink-0">
              <div
                className="h-20 w-20 rounded-2xl bg-blue-500/20 ring-2 ring-blue-400/30 flex
                  items-center justify-center shadow-lg"
              >
                <Package className="w-9 h-9 text-blue-300" />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-5 h-5 rounded-full border-2
                  border-slate-900 ${stock.dot}`}
              />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight">{product.name}</h1>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                    font-semibold ring-1 ${
                      product.isActive
                        ? "bg-blue-500/25 text-blue-300 ring-blue-400/30"
                        : "bg-red-500/20 text-red-300 ring-red-400/30"
                    }`}
                >
                  {product.isActive ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {product.isActive ? "Actif" : "Inactif"}
                </span>
              </div>

              {product.slug && (
                <p className="text-white/70 text-sm mt-1.5 font-mono truncate">/{product.slug}</p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                {product.category?.name && (
                  <div className="flex items-center gap-1.5 text-white/70 text-xs">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{product.category.name}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ajouté le {createdAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs">
                  <Hash className="w-3.5 h-3.5 text-white/60" />
                  <span className="font-mono text-white/70">{product.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="relative border-t border-white/5 px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
            <Euro className="w-3.5 h-3.5" />
            <span>{price}</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Box className="w-3.5 h-3.5" />
            <span>{product.stock} unités</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="text-xs font-medium text-cyan-300">{stock.label}</div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md
            transition-all hover:-translate-y-0.5 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Euro className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900">{price}</p>
          <p className="text-xs text-gray-400 mt-0.5">Prix unitaire</p>
        </div>

        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md
            transition-all hover:-translate-y-0.5 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-lg bg-blue-50">
              <Box className="w-4 h-4 text-blue-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900">{product.stock}</p>
          <p className="text-xs text-gray-400 mt-0.5">Unités en stock</p>
        </div>

        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md
            transition-all hover:-translate-y-0.5 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <div className={`w-2.5 h-2.5 rounded-full ${stock.dot}`} />
          </div>
          <div
            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ring-1
              ${stock.cls}`}
          >
            {stock.label}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{stock.sub}</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Tag,
            label: "Catégorie",
            value: product.category?.name || "—",
            sub: product.category ? "Catégorie assignée" : "Non catégorisé",
            color: "text-violet-600",
            bg: "bg-violet-50",
            ring: "ring-violet-100",
          },
          {
            icon: LinkIcon,
            label: "Slug",
            value: product.slug || "—",
            sub: "Identifiant URL",
            color: "text-blue-600",
            bg: "bg-blue-50",
            ring: "ring-blue-100",
            mono: true,
          },
          {
            icon: product.isActive ? CheckCircle2 : XCircle,
            label: "Statut",
            value: product.isActive ? "Actif" : "Inactif",
            sub: product.isActive ? "Visible en catalogue" : "Masqué du catalogue",
            color: product.isActive ? "text-emerald-600" : "text-red-500",
            bg: product.isActive ? "bg-emerald-50" : "bg-red-50",
            ring: product.isActive ? "ring-emerald-100" : "ring-red-100",
          },
          {
            icon: Calendar,
            label: "Créé le",
            value: createdAt,
            sub: "Date d'ajout au catalogue",
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
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
              <p
                className={`text-sm font-semibold text-muted-foreground mt-0.5 truncate
                ${mono ? "font-mono" : ""}`}
              >
                {value}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      {product.description && (
        <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="bg-gray-50 text-gray-500 ring-1 ring-gray-100 p-3 rounded-xl shrink-0
            h-fit">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
              Description
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${PRODUCTS}`}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border
            border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
            transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${PRODUCTS}/edit/${product.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl
            gradient-primary text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
            transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier le produit
        </Link>
      </div>
    </div>
  );
}
