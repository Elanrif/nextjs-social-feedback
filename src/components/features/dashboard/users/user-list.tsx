"use client";
import { useState } from "react";
import Link from "next/link";
import { DataTable, DataTableColumn } from "@/components/features/dashboard/data-table";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import type { User } from "@/lib/users/models/user.model";
import { Eye, Pencil, Trash2, Users, Plus, ShieldCheck } from "lucide-react";
import LoadingPage from "@components/features/loading-page";
import { useUsers, useDeleteUser } from "@/lib/users/hooks/use-users";
import { useAuthUser } from "@/lib/auth/context/auth.user.context";

const { DASHBOARD, USERS } = ROUTES;

export function UserList() {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { id: currentUserId } = useAuthUser();
  const { data: users = [], isLoading } = useUsers();
  const filteredUsers = users.filter((u) => u.id !== currentUserId);
  const { mutate: remove, isPending: deleteLoading } = useDeleteUser();

  const handleDelete = () => {
    if (!deleteId) return;
    setDeleteError(null);
    remove(deleteId, {
      onSuccess: () => {
        setModalOpen(false);
        setDeleteId(null);
        toast.success("Utilisateur supprimé avec succès");
      },
      onError: (error) => {
        setDeleteError(error instanceof Error ? error.message : "Erreur lors de la suppression");
      },
    });
  };

  const columns: DataTableColumn<User>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="font-mono text-xs text-gray-400">#{row.id}</span>,
    },
    {
      key: "name",
      label: "Utilisateur",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-500 flex
              items-center justify-center text-white text-xs font-semibold shrink-0"
          >
            {row.firstName?.slice(0, 1).toUpperCase() || row.email?.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Rôle",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            row.role === "ADMIN" ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.role === "ADMIN" && <ShieldCheck className="w-3 h-3" />}
          {row.role}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Statut",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
            ${row.isActive ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}
        >
          {row.isActive ? "Actif" : "Inactif"}
        </span>
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
          <Link href={`${DASHBOARD}${USERS}/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50
                transition-colors"
              title="Détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`${DASHBOARD}${USERS}/edit/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50
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
      <LoadingPage loading={isLoading} text="Chargement des utilisateurs..." />
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
              {!isLoading && (
                <p className="text-xs text-gray-400">
                  {filteredUsers.length} utilisateur
                  {filteredUsers.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <Link href={`${DASHBOARD}${USERS}/create`}>
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
          data={filteredUsers}
          loading={isLoading}
          emptyText="Aucun utilisateur."
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
          title="Supprimer cet utilisateur ?"
          description="Cette action est irréversible. L'utilisateur sera définitivement supprimé."
        />
      </div>
    </>
  );
}
