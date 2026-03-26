"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createCategory } from "@/lib/categories/services/category.client.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils/routes";
import { CategoryFormData, categorySchema } from "@/lib/categories/models/category.model";
import {
  ArrowLeft,
  Tag,
  Save,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon,
  CheckSquare,
} from "lucide-react";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";

const { DASHBOARD, CATEGORIES } = ROUTES;

const icv =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white" +
  " text-sm text-gray-800 placeholder-gray-400" +
  " focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400" +
  " transition-all disabled:opacity-50";

export function CategoryCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      isActive: true,
      sortOrder: undefined,
    },
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await createCategory(data);
      if (!res.ok) {
        setApiError(res.error.detail);
        return;
      }
      toast.success("Catégorie créée avec succès");
      router.push(`${DASHBOARD}${CATEGORIES}/${res.data.id}`);
    } catch (error: any) {
      setApiError(error?.message || "Erreur inattendue lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl lg:min-w-2xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl bg-violet-500/20 ring-1 ring-violet-400/30">
            <Tag className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ajouter une catégorie</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Créer une nouvelle catégorie pour votre catalogue
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={apiError} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              variant="light"
              label="Nom"
              error={errors.name?.message}
              icon={<Tag className="w-4 h-4" />}
            >
              <input
                {...register("name")}
                placeholder="Ex: Électronique"
                disabled={loading}
                className={icv}
              />
            </Field>
            <Field
              variant="light"
              label="Slug"
              error={errors.slug?.message}
              icon={<LinkIcon className="w-4 h-4" />}
            >
              <input
                {...register("slug")}
                placeholder="Ex: electronique"
                disabled={loading}
                className={icv}
              />
            </Field>
          </div>

          <Field
            variant="light"
            label="Description"
            required={false}
            icon={<FileText className="w-4 h-4" />}
          >
            <textarea
              {...register("description")}
              placeholder="Décrivez cette catégorie..."
              rows={3}
              disabled={loading}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none
                disabled:opacity-50"
            />
          </Field>

          <Field
            variant="light"
            label="Image URL"
            required={false}
            icon={<ImageIcon className="w-4 h-4" />}
          >
            <input
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
              className={icv}
            />
          </Field>

          <label
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200
              hover:border-violet-300 hover:bg-violet-50/50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              {...register("isActive")}
              className="w-4 h-4 accent-violet-600 rounded"
            />
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-violet-500" />
              <span className="text-sm font-medium text-gray-700">Catégorie active</span>
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border
                border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
                transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                gradient-primary text-sm font-semibold shadow-sm hover:shadow-md
                hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              <Save className="w-4 h-4" />
              {loading ? "Création..." : "Créer la catégorie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
