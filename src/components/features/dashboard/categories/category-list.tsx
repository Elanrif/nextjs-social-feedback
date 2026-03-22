"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCategory } from "@/lib/categories/services/category.client.service";
import { isCrudError } from "@/lib/categories/hooks/use-categories";
import { DataTable, DataTableColumn } from "@/components/features/dashboard/data-table";
import { ConfirmModal } from "@/components/features/dashboard/confirm-modal";
import { toast } from "react-toastify";
import { Category } from "@/lib/categories/models/category.model";
import { ROUTES } from "@/utils/routes";
import { Eye, Pencil, Trash2, Tag, Plus } from "lucide-react";
import LoadingPage from "@components/features/loading-page";

const { DASHBOARD, CATEGORIES } = ROUTES;

export function CategoryList({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (!mounted) return;
      setCategories(initialCategories);
      setLoading(false);
    }, 100);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [initialCategories]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await deleteCategory(deleteId);
      if (isCrudError(res)) {
        setDeleteError(res.message ?? "Erreur lors de la suppression");
      } else {
        setModalOpen(false);
        setDeleteId(null);
        setCategories((prev) => prev.filter((c) => c.id !== deleteId));
        toast.success("Catégorie supprimée avec succès");
      }
    } catch {
      setDeleteError("Une erreur inattendue s'est produite. Veuillez réessayer.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns: DataTableColumn<Category>[] = [
    {
      key: "id",
      label: "ID",
      render: (row) => <span className="font-mono text-xs text-gray-400">#{row.id}</span>,
    },
    {
      key: "name",
      label: "Catégorie",
      render: (row) => (
        <div>
          <p className="font-medium text-gray-800">{row.name}</p>
          {row.slug && <p className="text-xs text-gray-400 font-mono">{row.slug}</p>}
        </div>
      ),
    },
    {
      key: "description",
      label: "Description",
      render: (row) => (
        <p className="text-sm text-gray-500 truncate max-w-xs">{row.description || "—"}</p>
      ),
    },
    {
      key: "isActive",
      label: "Statut",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
            ${row.isActive ? "bg-violet-50 text-violet-700" : "bg-gray-100 text-gray-500"}`}
        >
          {row.isActive ? "Active" : "Inactive"}
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
          <Link href={`${DASHBOARD}${CATEGORIES}/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50
                transition-colors"
              title="Détails"
            >
              <Eye className="w-4 h-4" />
            </button>
          </Link>
          <Link href={`${DASHBOARD}${CATEGORIES}/edit/${row.id}`}>
            <button
              className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50
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
      <LoadingPage loading={loading} text="Chargement des catégories..." />
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-50">
              <Tag className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Catégories</h1>
              {!loading && (
                <p className="text-xs text-foreground/50">
                  {categories.length} catégorie
                  {categories.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>
          <Link href={`${DASHBOARD}${CATEGORIES}/create`}>
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
          data={categories}
          loading={loading}
          emptyText="Aucune catégorie."
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
          title="Supprimer cette catégorie ?"
          description="Cette action est irréversible. La catégorie sera définitivement supprimée."
        />
      </div>
    </>
  );
}
