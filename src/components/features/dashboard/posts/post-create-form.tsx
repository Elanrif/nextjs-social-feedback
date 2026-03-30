"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreatePost } from "@/lib/posts/hooks/use-posts";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { PostFormData, postSchema } from "@/lib/posts/models/post.model";
import { ArrowLeft, FileText, Save, ImageIcon, Heart, AlignLeft } from "lucide-react";
import { icLight } from "@/components/ui/form/input-class";
import { SectionTitle } from "@/components/ui/form/section-title";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";

const { DASHBOARD, POSTS } = ROUTES;

export function PostCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      likes: 0,
    },
  });

  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate: create, isPending: loading } = useCreatePost();

  const onSubmit = (data: PostFormData) => {
    setApiError(null);
    create(
      { ...data, likes: Number(data.likes) },
      {
        onSuccess: (post) => {
          toast.success("Post créé avec succès");
          router.push(`${DASHBOARD}${POSTS}/${post?.id}`);
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : "Erreur lors de la création";
          setApiError(message);
        },
      },
    );
  };

  return (
    <div className="max-w-3xl lg:min-w-2xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl bg-teal-500/20 ring-1 ring-teal-400/30">
            <FileText className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ajouter un post</h1>
            <p className="text-sm text-slate-400 mt-0.5">Créer un nouveau post</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormError message={apiError} />

          {/* Informations */}
          <div className="space-y-4">
            <SectionTitle icon={<FileText className="w-4 h-4" />} label="Informations du post" />
            <Field
              variant="light"
              label="Titre"
              error={errors.title?.message}
              icon={<FileText className="w-4 h-4" />}
            >
              <input
                {...register("title")}
                placeholder="Ex: Mon premier post"
                className={icLight}
              />
            </Field>
            <Field
              variant="light"
              label="URL de l'image"
              error={errors.imageUrl?.message}
              icon={<ImageIcon className="w-4 h-4" />}
            >
              <input {...register("imageUrl")} placeholder="https://..." className={icLight} />
            </Field>
          </div>

          {/* Contenu */}
          <div className="space-y-4">
            <SectionTitle icon={<AlignLeft className="w-4 h-4" />} label="Contenu" />
            <Field
              variant="light"
              label="Description"
              error={errors.description?.message}
              icon={<AlignLeft className="w-4 h-4" />}
            >
              <textarea
                {...register("description")}
                placeholder="Décrivez votre post..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                  text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                  focus:ring-teal-500/30 focus:border-teal-400 transition-all resize-none"
              />
            </Field>
          </div>

          {/* Métriques */}
          <div className="space-y-4">
            <SectionTitle icon={<Heart className="w-4 h-4" />} label="Métriques" />
            <Field
              variant="light"
              label="Likes"
              required={false}
              error={errors.likes?.message}
              icon={<Heart className="w-4 h-4" />}
            >
              <input
                {...register("likes", { valueAsNumber: true })}
                type="number"
                min={0}
                placeholder="0"
                className={icLight}
              />
            </Field>
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
              {loading ? "Création..." : "Créer le post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
