"use client";

import { Post } from "@/lib/posts/models/post.model";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import { ArrowLeft, Pencil, FileText, User, Calendar, Hash, Heart, ImageIcon } from "lucide-react";

const { DASHBOARD, POSTS } = ROUTES;

export function PostDetail({ post }: { post: Post }) {
  const createdAt = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const updatedAt = post.updatedAt
    ? new Date(post.updatedAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl card-gradient shadow-xl">
        <div className="relative p-8">
          <div className="flex items-start gap-6">
            {/* Image ou icône */}
            <div className="shrink-0">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-teal-400/30 shadow-lg"
                />
              ) : (
                <div
                  className="h-20 w-20 rounded-2xl bg-teal-500/20 ring-2 ring-teal-400/30 flex
                    items-center justify-center shadow-lg"
                >
                  <FileText className="w-9 h-9 text-teal-300" />
                </div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white tracking-tight line-clamp-1">
                  {post.title}
                </h1>
              </div>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {post.author.firstName} {post.author.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{createdAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="font-mono">{post.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="relative border-t border-white/5 px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
            <Heart className="w-3.5 h-3.5 fill-rose-300" />
            <span>{post.likes} likes</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-xs text-white/70 truncate">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{post.description}</span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md
            transition-all hover:-translate-y-0.5 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-lg bg-rose-50">
              <Heart className="w-4 h-4 text-rose-500" />
            </div>
          </div>
          <p className="text-xl font-bold text-gray-900">{post.likes}</p>
          <p className="text-xs text-gray-400 mt-0.5">Likes</p>
        </div>

        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md
            transition-all hover:-translate-y-0.5 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-lg bg-teal-50">
              <User className="w-4 h-4 text-teal-600" />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900">
            {post.author.firstName} {post.author.lastName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Auteur</p>
        </div>

        <div
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md
            transition-all hover:-translate-y-0.5 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <div className="p-2 rounded-lg bg-gray-50">
              <Calendar className="w-4 h-4 text-gray-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-900">{createdAt}</p>
          <p className="text-xs text-gray-400 mt-0.5">Date de création</p>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: User,
            label: "Auteur",
            value: `${post.author.firstName} ${post.author.lastName}`,
            sub: post.author.email,
            color: "text-teal-600",
            bg: "bg-teal-50",
            ring: "ring-teal-100",
          },
          {
            icon: ImageIcon,
            label: "Image URL",
            value: post.imageUrl || "—",
            sub: "URL de l'image du post",
            color: "text-blue-600",
            bg: "bg-blue-50",
            ring: "ring-blue-100",
            mono: true,
          },
          {
            icon: Calendar,
            label: "Créé le",
            value: createdAt,
            sub: "Date de publication",
            color: "text-gray-500",
            bg: "bg-gray-50",
            ring: "ring-gray-100",
          },
          {
            icon: Calendar,
            label: "Modifié le",
            value: updatedAt,
            sub: "Dernière modification",
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
      <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="bg-teal-50 text-teal-600 ring-1 ring-teal-100 p-3 rounded-xl shrink-0 h-fit">
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Description
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{post.description}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${POSTS}`}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border
            border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
            transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${POSTS}/edit/${post.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl
            gradient-primary text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
            transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier le post
        </Link>
      </div>
    </div>
  );
}
