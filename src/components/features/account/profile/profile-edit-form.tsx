"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { User as UserIcon, Mail, Phone, Pencil, ArrowLeft, Save } from "lucide-react";
import { ProfileUserFormData, ProfileUserSchema } from "@/lib/auth/models/auth.model";
import { editProfileAction } from "@/lib/auth/actions/auth";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";
import { isApiError } from "@/shared/errors/api-error";
import { ImageUpload } from "@/components/ui/image-upload";
import { useImageDraft } from "@/lib/cloudinary/hooks/use-image-draft";
import { useSession } from "next-auth/react";

const { MY_ACCOUNT } = ROUTES;

export function ProfileEditForm() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const user = session?.user;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUserFormData>({
    resolver: zodResolver(ProfileUserSchema) as any,
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const avatar = useImageDraft({
    storageKey: "profile:avatar",
    initialUrl: user?.avatarUrl,
  });

  const onSubmit = async (data: ProfileUserFormData) => {
    if (!user) {
      setError("User data is not loaded");
      toast.error("User data is not loaded");
      return;
    }
    setLoading(true);
    try {
      const payload: ProfileUserFormData = {
        ...data,
        avatarUrl: avatar.url || undefined,
      };
      const response = await editProfileAction(payload);
      if (isApiError(response)) {
        setError(response.detail || "Erreur lors de la mise à jour");
        toast.error(response.detail || "Erreur lors de la mise à jour");
        return;
      }
      avatar.clearDraft();
      await update({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        avatarUrl: avatar.url || undefined,
      });
      toast.success("Profil mis à jour avec succès !");
      router.push(MY_ACCOUNT);
    } catch (error_: any) {
      setError(error_.message || "Erreur inattendue");
      toast.error("Erreur inattendue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white" +
    " text-sm text-gray-800 placeholder-gray-400" +
    " focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400" +
    " transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-3xl lg:min-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full
            bg-indigo-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full
            bg-blue-500/20 blur-3xl"
        />
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-400/30">
            <Pencil className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Modifier mon profil</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Mettez à jour vos informations personnelles
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={error} />

          {/* Avatar */}
          <Field variant="light" label="Photo de profil" required={false}>
            <div className="pt-1">
              <ImageUpload
                value={avatar.url}
                publicId={avatar.publicId}
                onChange={avatar.handleChange}
                onRemove={avatar.handleRemove}
                variant="light"
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field
              variant="light"
              label="Prénom"
              error={errors.firstName?.message}
              icon={<UserIcon className="w-4 h-4" />}
            >
              <input
                type="text"
                {...register("firstName")}
                placeholder="Votre prénom"
                disabled={loading}
                className={inputClass}
              />
            </Field>

            <Field
              variant="light"
              label="Nom"
              error={errors.lastName?.message}
              icon={<UserIcon className="w-4 h-4" />}
            >
              <input
                type="text"
                {...register("lastName")}
                placeholder="Votre nom"
                disabled={loading}
                className={inputClass}
              />
            </Field>

            <Field
              variant="light"
              label="Adresse e-mail"
              error={errors.email?.message}
              icon={<Mail className="w-4 h-4" />}
            >
              <input
                type="email"
                {...register("email")}
                placeholder="exemple@email.com"
                disabled={loading}
                className={inputClass}
              />
            </Field>

            <Field
              variant="light"
              label="Téléphone"
              error={errors.phoneNumber?.message}
              icon={<Phone className="w-4 h-4" />}
            >
              <input
                type="tel"
                {...register("phoneNumber")}
                placeholder="+33 6 00 00 00 00"
                disabled={loading}
                className={inputClass}
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
                bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700
                text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all disabled:opacity-50 disabled:translate-y-0"
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
