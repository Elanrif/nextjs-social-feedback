"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { ROUTES } from "@/utils/routes";
import { usePasswordValidation } from "@/hooks/use-password-validation";
import { Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, KeyRound, Save } from "lucide-react";
import { FormError } from "@/components/ui/form/form-error";
import ValidationItem from "@/components/ui/validation-item";
import {
  ChangePasswordProfileFormData,
  ChangePasswordProfileSchema,
} from "@/lib/auth/models/auth.model";
import { useSession } from "next-auth/react";
import { changePasswordProfileAction, signOutAction } from "@/lib/auth/actions/auth";
import { isApiError } from "@/shared/errors/api-error";

const { MY_ACCOUNT } = ROUTES;

export function ChangePasswordForm() {
  const router = useRouter();
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordProfileFormData>({
    resolver: zodResolver(ChangePasswordProfileSchema) as any,
    defaultValues: {
      email: session?.user?.email || "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const password = watch("newPassword");
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validation = usePasswordValidation(password);
  const allValid = validation.minLength && validation.hasNumber && validation.hasCase;

  const onSubmit = async (data: ChangePasswordProfileFormData) => {
    setLoading(true);
    try {
      const response = await changePasswordProfileAction(data);
      if (isApiError(response)) {
        setError(response.detail || "Erreur lors de la mise à jour");
        toast.error(response.detail || "Erreur lors de la mise à jour");
        return;
      }
      toast.success("Mot de passe mis à jour avec succès !");
      router.push(MY_ACCOUNT);
    } catch (error_: any) {
      setError(error_.message || "Erreur inattendue");
      toast.error("Erreur inattendue lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full pl-10 pr-11 py-3 rounded-xl border border-gray-200 bg-white" +
    " text-sm text-gray-800 placeholder-gray-400" +
    " focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400" +
    " transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl">
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full
            bg-orange-500/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full
            bg-red-500/15 blur-3xl"
        />
        <div className="relative flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/20 ring-1 ring-orange-400/30">
            <KeyRound className="w-5 h-5 text-orange-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Changer le mot de passe</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Sécurisez votre compte avec un nouveau mot de passe
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormError message={error} />

          {/* Old password */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex
                items-center gap-1"
            >
              Ancien mot de passe <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                  pointer-events-none"
              />
              <input
                type={showOld ? "text" : "password"}
                {...register("oldPassword")}
                placeholder="Votre mot de passe actuel"
                disabled={loading}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                  hover:text-gray-600 transition-colors"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-red-500">{errors.oldPassword.message}</p>
            )}
          </div>

          <div className="h-px bg-gray-100" />

          {/* New password */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex
                items-center gap-1"
            >
              Nouveau mot de passe <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                  pointer-events-none"
              />
              <input
                type={showNew ? "text" : "password"}
                {...register("newPassword")}
                placeholder="Choisissez un nouveau mot de passe"
                disabled={loading}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                  hover:text-gray-600 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-red-500">{errors.newPassword.message}</p>
            )}

            {/* Strength checklist */}
            {password && (
              <div
                className={`mt-3 p-3 rounded-xl space-y-1.5 text-sm border
                ${allValid ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100"}`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <ShieldCheck
                    className={`w-3.5 h-3.5 ${allValid ? "text-emerald-600" : "text-gray-400"}`}
                  />
                  <span
                    className={`text-xs font-semibold
                    ${allValid ? "text-emerald-700" : "text-gray-500"}`}
                  >
                    {allValid ? "Mot de passe fort" : "Exigences de sécurité"}
                  </span>
                </div>
                <ValidationItem valid={validation.minLength} text="Au moins 8 caractères" />
                <ValidationItem valid={validation.hasNumber} text="Un chiffre (0-9) ou symbole" />
                <ValidationItem
                  valid={validation.hasCase}
                  text="Minuscule (a-z) et majuscule (A-Z)"
                />
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex
                items-center gap-1"
            >
              Confirmer le mot de passe <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
                  pointer-events-none"
              />
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Répétez le nouveau mot de passe"
                disabled={loading}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400
                  hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              disabled={loading}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium
                underline-offset-2 hover:underline transition-colors"
              onClick={async () => {
                setLoading(true);
                try {
                  await signOutAction();
                  router.push(ROUTES.FORGOT_PASSWORD);
                } catch {
                  toast.error("Erreur lors de la déconnexion");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
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
                bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600
                text-white text-sm font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5
                transition-all disabled:opacity-50 disabled:translate-y-0"
            >
              <Save className="w-4 h-4" />
              {loading ? "Enregistrement..." : "Mettre à jour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
