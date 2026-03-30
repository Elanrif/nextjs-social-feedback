"use client";
import { useState } from "react";
import Link from "next/link";
import type { Post } from "@/lib/posts/models/post.model";
import { DataTable, DataTableColumn } from "@/components/features/dashboard/data-table";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { Eye, Pencil, Trash2, FileText, Plus, Heart, User } from "lucide-react";
import LoadingPage from "@components/features/loading-page";
import { usePosts, useDeletePost } from "@/lib/posts/hooks/use-posts";

const { DASHBOARD, POSTS } = ROUTES;

export function PostList() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading } = usePosts();
  const posts = data?.content ?? [];
  const { mutate: remove, isPending: deleteLoading } = useDeletePost();

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleteError(null);
    remove(deleteId, {
      onSuccess: () => {
        setModalOpen(false);
        setDeleteId(null);
        toast.success("Post supprimé avec succès");
      },
      onError: (err) => {
        setDeleteError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      },
    });
  };

  const columns: DataTableColumn<Post>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="font-mono text-xs text-gray-400">#{row.id}</span>,
    },
    {
      key: "title",
      label: "Post",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.imageUrl && (
            <img
              src={row.imageUrl}
              alt={row.title}
              className="w-9 h-9 rounded-lg object-cover shrink-0"
            />
          )}
          <div>
            <p className="font-medium text-gray-800 line-clamp-1">{row.title}</p>
            <p className="text-xs text-gray-400 line-clamp-1">{row.description}</p>
          </div>
        </div>
      ),
    },
    {
      key: "author",
      label: "Auteur",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-sm text-gray-700">
            {row.author.firstName} {row.author.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "likes",
      label: "Likes",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-rose-500 font-semibold text-sm">
          <Heart className="w-3.5 h-3.5 fill-rose-500" />
          {row.likes}
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Créé le",
      render: (row) => (
        <span className="text-xs text-gray-400">
          {new Date(row.createdAt).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <div className="flex items-center gap-1 justify-end">
          <Link href={`${DASHBOARD}${POSTS}/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50
                transition-colors"
              title="Détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`${DASHBOARD}${POSTS}/edit/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-teal-600 hover:bg-teal-50
                transition-colors"
              title="Modifier"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </Link>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50
              transition-colors"
            title="Supprimer"
            onClick={() => {
              setDeleteId(row.id);
              setModalOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <LoadingPage loading={isLoading} text="Chargement des posts..." />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50">
              <FileText className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Posts</h1>
              {!isLoading && (
                <p className="text-xs text-gray-400">
                  {posts.length} post{posts.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <Link href={`${DASHBOARD}${POSTS}/create`}>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-sm
                font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </Link>
        </div>

        <DataTable columns={columns} data={posts} loading={isLoading} emptyText="Aucun post." />

        <ConfirmModal
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setDeleteError(null);
            setDeleteId(null);
          }}
          onConfirm={handleDelete}
          loading={deleteLoading}
          error={deleteError ?? undefined}
          title="Supprimer ce post ?"
          description="Cette action est irréversible. Le post sera définitivement supprimé."
        />
      </div>
    </>
  );
}
