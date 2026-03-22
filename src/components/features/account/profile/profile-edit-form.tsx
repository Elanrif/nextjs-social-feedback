"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "@components/features/loading-page";
import { ROUTES } from "@/utils/routes";
import { User } from "@/lib/users/models/user.model";
import { User as UserIcon, Mail, Phone, Pencil, ArrowLeft, Save } from "lucide-react";
import { ProfileUserFormData, ProfileUserSchema } from "@/lib/auth/models/auth.model";
import { editProfileAction } from "@/lib/auth/actions/auth";

const { MY_ACCOUNT } = ROUTES;

interface FieldProps {
  label: string;
  error?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Field({ label, error, icon, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center
          gap-1.5"
      >
        {label}
        <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <div
          className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none
            text-gray-400"
        >
          {icon}
        </div>
        {children}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
    </div>
  );
}

export function ProfileEditForm({ loadedUser }: { loadedUser: User }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUserFormData>({
    resolver: zodResolver(ProfileUserSchema) as any,
    defaultValues: {
      firstName: loadedUser?.firstName || "",
      lastName: loadedUser?.lastName || "",
      email: loadedUser?.email || "",
      phoneNumber: loadedUser?.phoneNumber || "",
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: ProfileUserFormData) => {
    if (!loadedUser) {
      setError("User data is not loaded");
      toast.error("User data is not loaded");
      return;
    }
    setLoading(true);
    try {
      const response = await editProfileAction(data);
      if ("error" in response) {
        setError(response.error.message || "Erreur lors de la mise à jour");
        toast.error(response.error.message || "Erreur lors de la mise à jour");
        return;
      }
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
    <>
      <LoadingPage loading={loading} text="Mise à jour du profil..." />
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
            {error && (
              <div
                className="flex items-start gap-2.5 p-4 text-sm text-red-700 bg-red-50 border
                  border-red-100 rounded-xl"
              >
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field
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
    </>
  );
}
