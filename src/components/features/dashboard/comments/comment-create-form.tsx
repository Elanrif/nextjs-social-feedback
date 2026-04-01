"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCreateComment } from "@/lib/comments/hooks/use-comments";
import { usePosts } from "@/lib/posts/hooks/use-posts";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { CommentFormData, commentSchema } from "@/lib/comments/models/comment.model";
import { ArrowLeft, MessageSquare, Save, FileText, BookOpen } from "lucide-react";
import { icLight } from "@/components/ui/form/input-class";
import { SectionTitle } from "@/components/ui/form/section-title";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";
import { useSession } from "next-auth/react";

const { DASHBOARD, COMMENTS } = ROUTES;

export function CommentCreateForm() {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema) as any,
    defaultValues: {
      content: "",
      postId: 0,
      authorId: session?.user.id ? Number(session.user.id) : 0,
    },
  });

  const router = useRouter();
  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate: create, isPending: loading } = useCreateComment();
  const { data: postsPage, isLoading: postsLoading } = usePosts({ size: 100 });

  const onSubmit = (data: CommentFormData) => {
    setApiError(null);
    create(
      { ...data, postId: Number(data.postId) },
      {
        onSuccess: (comment) => {
          router.push(`${DASHBOARD}${COMMENTS}/${comment?.id}`);
          toast.success("Commentaire créé avec succès");
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
          <div className="p-3 rounded-xl bg-amber-500/20 ring-1 ring-amber-400/30">
            <MessageSquare className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Ajouter un commentaire</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Créer un nouveau commentaire sur un post
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7 space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FormError message={apiError} />

          <div className="space-y-4">
            <SectionTitle
              icon={<MessageSquare className="w-4 h-4" />}
              label="Contenu du commentaire"
            />
            <Field
              variant="light"
              label="Post"
              error={errors.postId?.message}
              icon={<BookOpen className="w-4 h-4" />}
            >
              {postsLoading ? (
                <input disabled value="Chargement des posts..." className={icLight} />
              ) : (
                <select {...register("postId", { valueAsNumber: true })} className={icLight}>
                  <option value={0} style={{ color: "#9ca3af" }}>
                    Sélectionner un post
                  </option>
                  {postsPage?.content?.map((post) => (
                    <option key={post.id} value={post.id} style={{ fontWeight: "bold" }}>
                      {post.title}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field
              variant="light"
              label="Commentaire"
              error={errors.content?.message}
              icon={<FileText className="w-4 h-4" />}
            >
              <textarea
                {...register("content")}
                placeholder="Écrivez votre commentaire..."
                rows={4}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm
                  text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
                  focus:ring-amber-500/30 focus:border-amber-400 transition-all resize-none"
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
              {loading ? "Création..." : "Créer le commentaire"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
