"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePost } from "@/lib/posts/hooks/use-posts";
import { toast } from "react-toastify";
import { PostFormData, postSchema } from "@/lib/posts/models/post.model";
import { X, FileText, Save, Heart, AlignLeft } from "lucide-react";
import { icLight } from "@/components/ui/form/input-class";
import { SectionTitle } from "@/components/ui/form/section-title";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ui/image-upload";
import { useImageDraft } from "@/lib/cloudinary/hooks/use-image-draft";

interface PostCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PostCreateModal({ open, onOpenChange }: PostCreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title: "",
      imageUrl: "",
      description: "",
      likes: 0,
    },
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const { mutate: create, isPending: loading } = useCreatePost();

  const image = useImageDraft({
    storageKey: "post:image",
    initialUrl: undefined,
  });

  const handleImageChange = (url: string, publicId: string) => {
    image.handleChange(url, publicId);
    setValue("imageUrl", url, { shouldValidate: true });
  };

  const handleImageRemove = () => {
    image.handleRemove();
    setValue("imageUrl", "", { shouldValidate: true });
  };

  const onSubmit = (data: PostFormData) => {
    setApiError(null);
    create(
      { ...data, likes: Number(data.likes), imageUrl: image.url || data.imageUrl },
      {
        onSuccess: () => {
          toast.success("Post créé avec succès");
          image.handleRemove();
          reset();
          onOpenChange(false);
        },
        onError: (err) => {
          const message = err instanceof Error ? err.message : "Erreur lors de la création";
          setApiError(message);
        },
      },
    );
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      reset();
      image.clearDraft();
    }
    onOpenChange(open);
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => handleClose(false)}
        />
      )}
      <Dialog open={open} onOpenChange={handleClose} modal={false}>
        <DialogContent
          className="max-w-2xl z-51"
          onInteractOutside={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onFocusOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-500" />
              Créer un nouveau post
            </DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto"
          >
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
                label="Image du post"
                required={false}
                error={errors.imageUrl?.message}
              >
                <div className="pt-1">
                  <input type="hidden" {...register("imageUrl")} />
                  <ImageUpload
                    value={image.url}
                    publicId={image.publicId}
                    onChange={handleImageChange}
                    onRemove={handleImageRemove}
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white
                    text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2
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

            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={() => {
                  reset();
                  image.clearDraft();
                  onOpenChange(false);
                }}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                  border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50
                  transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                  gradient-primary text-sm font-semibold shadow-sm hover:shadow-md
                  hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                <Save className="w-4 h-4" />
                {loading ? "Création..." : "Créer le post"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
