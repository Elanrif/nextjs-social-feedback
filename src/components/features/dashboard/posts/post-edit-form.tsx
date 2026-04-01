"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useUpdatePost } from "@/lib/posts/hooks/use-posts";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { Post, PostFormData, postSchema } from "@/lib/posts/models/post.model";
import { ArrowLeft, Pencil, FileText, Save, Heart, AlignLeft } from "lucide-react";
import { icLight } from "@/components/ui/form/input-class";
import { SectionTitle } from "@/components/ui/form/section-title";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";
import { ImageUpload } from "@/components/ui/image-upload";
import { useImageDraft } from "@/lib/cloudinary/hooks/use-image-draft";
import { useSession } from "next-auth/react";

const { DASHBOARD, POSTS } = ROUTES;

export function PostEditForm({ loadedPost }: { loadedPost: Post }) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title: loadedPost?.title || "",
      imageUrl: loadedPost?.imageUrl || "",
      description: loadedPost?.description || "",
      likes: loadedPost?.likes ?? 0,
      authorId: session?.user.id ? Number(session.user.id) : 0,
    },
  });

  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate: update, isPending: loading } = useUpdatePost();

  const image = useImageDraft({
    storageKey: `post:${loadedPost.id}:image`,
    initialUrl: loadedPost?.imageUrl,
  });

  const onSubmit = (data: PostFormData) => {
    setApiError(null);
    update(
      {
        id: Number(loadedPost.id),
        data: { ...data, likes: Number(data.likes), imageUrl: image.url || data.imageUrl },
      },
      {
        onSuccess: (post) => {
          image.clearDraft();
          router.push(`${DASHBOARD}${POSTS}/${post?.id}`);
          toast.success("Post modifié avec succès");
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : "Erreur lors de la modification";
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
            <Pencil className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Modifier le post</h1>
            <p className="text-sm text-slate-400 mt-0.5 truncate max-w-md">{loadedPost?.title}</p>
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
            <Field variant="light" label="Image du post" required={false}>
              <div className="pt-1">
                <ImageUpload
                  value={image.url}
                  publicId={image.publicId}
                  onChange={image.handleChange}
                  onRemove={image.handleRemove}
                  variant="light"
                />
              </div>
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
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
