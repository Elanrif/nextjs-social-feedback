"use client";
import { useState } from "react";
import Link from "next/link";
import type { Comment } from "@/lib/comments/models/comment.model";
import { DataTable, DataTableColumn } from "@/components/features/dashboard/data-table";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { Eye, Pencil, Trash2, MessageSquare, Plus } from "lucide-react";
import LoadingPage from "@components/features/loading-page";
import { useComments, useDeleteComment } from "@/lib/comments/hooks/use-comments";

const { DASHBOARD, COMMENTS } = ROUTES;

export function CommentList() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data, isLoading } = useComments();
  const comments = data?.content ?? [];
  const { mutate: remove, isPending: deleteLoading } = useDeleteComment();

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleteError(null);
    remove(deleteId, {
      onSuccess: () => {
        setModalOpen(false);
        setDeleteId(null);
        toast.success("Commentaire supprimé avec succès");
      },
      onError: (err) => {
        setDeleteError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      },
    });
  };

  const columns: DataTableColumn<Comment>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="font-mono text-xs text-gray-400">#{row.id}</span>,
    },
    {
      key: "content",
      label: "Commentaire",
      render: (row) => <p className="text-sm text-gray-800 truncate max-w-xs">{row.content}</p>,
    },
    {
      key: "postId",
      label: "Post",
      render: (row) => (
        <span className="font-mono text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          #{row.postId}
        </span>
      ),
    },
    {
      key: "author",
      label: "Auteur",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-800">
            {row.author.firstName} {row.author.lastName}
          </p>
          <p className="text-xs text-gray-400">{row.author.email}</p>
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
          <Link href={`${DASHBOARD}${COMMENTS}/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50
                transition-colors"
              title="Détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`${DASHBOARD}${COMMENTS}/edit/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50
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
      <LoadingPage loading={isLoading} text="Chargement des commentaires..." />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Commentaires</h1>
              {!isLoading && (
                <p className="text-xs text-gray-400">
                  {comments.length} commentaire{comments.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <Link href={`${DASHBOARD}${COMMENTS}/create`}>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-sm
                font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Ajouter
            </button>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={comments}
          loading={isLoading}
          emptyText="Aucun commentaire."
        />

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
          title="Supprimer ce commentaire ?"
          description="Cette action est irréversible. Le commentaire sera définitivement supprimé."
        />
      </div>
    </>
  );
}
