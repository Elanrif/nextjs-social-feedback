"use client";

import { Comment } from "@/lib/comments/models/comment.model";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import {
  ArrowLeft,
  Pencil,
  MessageSquare,
  User,
  Calendar,
  Hash,
  FileText,
  BookOpen,
} from "lucide-react";

const { DASHBOARD, COMMENTS } = ROUTES;

export function CommentDetail({ comment }: { comment: Comment }) {
  const createdAt = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const updatedAt = comment.updatedAt
    ? new Date(comment.updatedAt).toLocaleDateString("fr-FR", {
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
            {/* Icon */}
            <div className="shrink-0">
              <div
                className="h-20 w-20 rounded-2xl bg-amber-500/20 ring-2 ring-amber-400/30 flex
                  items-center justify-center shadow-lg"
              >
                <MessageSquare className="w-9 h-9 text-amber-300" />
              </div>
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Commentaire #{comment.id}
                </h1>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs
                    font-semibold ring-1 bg-amber-500/25 text-amber-300 ring-amber-400/30"
                >
                  <BookOpen className="w-3 h-3" />
                  Post #{comment.postId}
                </span>
              </div>

              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <User className="w-3.5 h-3.5" />
                  <span>
                    {comment.author.firstName} {comment.author.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{createdAt}</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/70 text-xs">
                  <Hash className="w-3.5 h-3.5" />
                  <span className="font-mono">{comment.id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stripe */}
        <div className="relative border-t border-white/5 px-8 py-4 flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs text-white/70 truncate">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{comment.content}</span>
          </div>
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: BookOpen,
            label: "Post",
            value: `#${comment.postId}`,
            sub: "Identifiant du post associé",
            color: "text-amber-600",
            bg: "bg-amber-50",
            ring: "ring-amber-100",
            mono: true,
          },
          {
            icon: User,
            label: "Auteur",
            value: `${comment.author.firstName} ${comment.author.lastName}`,
            sub: comment.author.email,
            color: "text-blue-600",
            bg: "bg-blue-50",
            ring: "ring-blue-100",
          },
          {
            icon: Calendar,
            label: "Créé le",
            value: createdAt,
            sub: "Date de création",
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

      {/* Content */}
      <div className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div
          className="bg-amber-50 text-amber-600 ring-1 ring-amber-100 p-3 rounded-xl shrink-0 h-fit"
        >
          <FileText className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">
            Contenu
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`${DASHBOARD}${COMMENTS}`}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border
            border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
            transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <Link
          href={`${DASHBOARD}${COMMENTS}/edit/${comment.id}`}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl
            gradient-primary text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
            transition-all"
        >
          <Pencil className="w-4 h-4" />
          Modifier le commentaire
        </Link>
      </div>
    </div>
  );
}
