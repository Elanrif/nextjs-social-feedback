"use client";
import LoadingPage from "@components/features/loading-page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProduct } from "@/lib/products/hooks/use-products";
import { toast } from "react-toastify";
import { fetchCategories } from "@/lib/categories/services/category.client.service";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/utils/routes";
import { Product, ProductFormData, productSchema } from "@/lib/products/models/product.model";
import {
  ArrowLeft,
  Pencil,
  Package,
  Save,
  Euro,
  Box,
  Tag,
  FileText,
  Link as LinkIcon,
  CheckSquare,
} from "lucide-react";
import { icLight } from "@/components/ui/form/input-class";
import { SectionTitle } from "@/components/ui/form/section-title";
import { Field } from "@/components/ui/form/field";

const { DASHBOARD, PRODUCTS } = ROUTES;

export function ProductEditForm({ loadedProduct }: { loadedProduct: Product }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: loadedProduct?.name || "",
      slug: loadedProduct?.slug || "",
      description: loadedProduct?.description || "",
      price: loadedProduct?.price || 0,
      stock: loadedProduct?.stock || 0,
      isActive: loadedProduct?.isActive ?? true,
      categoryId: loadedProduct?.category?.id || 0,
    },
  });

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories().then((res) => {
      if (Array.isArray(res))
        setCategories(
          res.map((c) => ({
            id: c.id,
            name: c.name,
          })),
        );
      if (loadedProduct && "id" in loadedProduct) {
        reset({
          name: loadedProduct?.name || "",
          slug: loadedProduct?.slug || "",
          description: loadedProduct?.description || "",
          price: loadedProduct?.price || 0,
          stock: loadedProduct?.stock || 0,
          isActive: loadedProduct?.isActive ?? true,
          categoryId: loadedProduct?.category?.id || 0,
        });
      }
      setCategoriesLoading(false);
    });
  }, [loadedProduct, reset]);

  const { mutate: update, isPending: submitLoading } = useUpdateProduct();
  const loading = categoriesLoading || submitLoading;

  const onSubmit = (data: ProductFormData) => {
    update(
      {
        id: Number(loadedProduct.id),
        data: {
          ...data,
          price: Number(data.price),
          stock: Number(data.stock),
          categoryId: Number(data.categoryId),
        },
      },
      {
        onSuccess: (product) => {
          toast.success("Produit modifié avec succès");
          router.push(`${DASHBOARD}${PRODUCTS}/${product?.id}`);
        },
        onError: (err) => {
          toast.error(err instanceof Error ? err.message : "Erreur lors de la modification");
        },
      },
    );
  };

  return (
    <>
      <LoadingPage loading={loading} text="Modification du produit..." />
      <div className="max-w-3xl lg:min-w-2xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 ring-1 ring-blue-400/30">
              <Pencil className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Modifier le produit</h1>
              <p className="text-sm text-slate-400 mt-0.5">{loadedProduct?.name}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <SectionTitle
                icon={<Package className="w-4 h-4" />}
                label="Informations du produit"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  variant="light"
                  label="Nom"
                  error={errors.name?.message}
                  icon={<Package className="w-4 h-4" />}
                >
                  <input {...register("name")} placeholder="Ex: Laptop Pro" className={icLight} />
                </Field>
                <Field
                  variant="light"
                  label="Slug"
                  error={errors.slug?.message}
                  icon={<LinkIcon className="w-4 h-4" />}
                >
                  <input {...register("slug")} placeholder="Ex: laptop-pro" className={icLight} />
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
                  placeholder="Décrivez votre produit..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white
                    text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                    focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
                />
              </Field>
            </div>

            <div className="space-y-4">
              <SectionTitle icon={<Euro className="w-4 h-4" />} label="Tarification & Inventaire" />
              <div className="grid grid-cols-2 gap-4">
                <Field
                  variant="light"
                  label="Prix (€)"
                  error={errors.price?.message}
                  icon={<Euro className="w-4 h-4" />}
                >
                  <input
                    {...register("price", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    step="0.01"
                    min={0}
                    inputMode="decimal"
                    placeholder="0.00"
                    className={icLight}
                  />
                </Field>
                <Field
                  variant="light"
                  label="Stock"
                  error={errors.stock?.message}
                  icon={<Box className="w-4 h-4" />}
                >
                  <input
                    {...register("stock", {
                      valueAsNumber: true,
                    })}
                    type="number"
                    step={1}
                    min={0}
                    placeholder="0"
                    className={icLight}
                  />
                </Field>
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle icon={<Tag className="w-4 h-4" />} label="Catégorie & Statut" />
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Catégorie
                </label>
                <div className="relative">
                  <Tag
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                      pointer-events-none"
                  />
                  <select
                    {...register("categoryId", {
                      valueAsNumber: true,
                    })}
                    className={icLight + " appearance-none"}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={String(cat.id)}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.categoryId && (
                  <p className="text-xs text-red-500">{errors.categoryId.message}</p>
                )}
              </div>
              <label
                className="flex items-center gap-3 p-4 rounded-xl border border-gray-200
                  hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  {...register("isActive")}
                  className="w-4 h-4 accent-blue-600 rounded"
                />
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">Produit actif</span>
                </div>
              </label>
            </div>

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
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
