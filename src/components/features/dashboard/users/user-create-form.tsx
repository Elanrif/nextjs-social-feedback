"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingPage from "@components/features/loading-page";
import { ROUTES } from "@/utils/routes";
import { UserFormData, UserSchema } from "@/lib/users/models/user.model";
import { useCreateUser } from "@/lib/users/hooks/use-users";
import { usePasswordValidation } from "@/hooks/use-password-validation";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowLeft,
  UserPlus,
  Save,
  ShieldCheck,
} from "lucide-react";
import ValidationItem from "@/components/ui/validation-item";
import { Field } from "@/components/ui/form/field";
import { icLight, icLightPwd } from "@/components/ui/form/input-class";
import { cn } from "@/utils/utils";

const { DASHBOARD, USERS } = ROUTES;

export function UserCreateForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(UserSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const validation = usePasswordValidation(password);
  const allValid = validation.minLength && validation.hasNumber && validation.hasCase;

  const { mutate: create, isPending: loading } = useCreateUser();

  const onSubmit = (data: UserFormData) => {
    setError(null);
    create(data, {
      onSuccess: () => {
        toast.success("Utilisateur créé avec succès !");
        router.push(`${DASHBOARD}${USERS}`);
      },
      onError: (err) => {
        const message = err instanceof Error ? err.message : "Erreur lors de la création";
        setError(message);
        toast.error(message);
      },
    });
  };

  return (
    <>
      <LoadingPage loading={loading} text="Création de l'utilisateur..." />
      <div className="max-w-3xl lg:min-w-2xl mx-auto space-y-6">
        <div
          className="card-gradient relative overflow-hidden rounded-2xl card-gradient p-7 shadow-xl"
        >
          <div
            className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full
              blur-3xl"
          />
          <div
            className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full
              blur-3xl"
          />
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 ring-1 ring-emerald-400/30">
              <UserPlus className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Ajouter un utilisateur</h1>
              <p className="text-sm text-slate-400 mt-0.5">Créer un nouveau compte utilisateur</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && (
              <div
                className="flex items-start gap-2.5 p-4 text-sm text-red-700 bg-red-50 border
                  border-red-100 rounded-xl"
              >
                <span className="shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

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
                  placeholder="Prénom"
                  disabled={loading}
                  className={icLight}
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
                  placeholder="Nom"
                  disabled={loading}
                  className={icLight}
                />
              </Field>
              <Field
                variant="light"
                label="E-mail"
                error={errors.email?.message}
                icon={<Mail className="w-4 h-4" />}
              >
                <input
                  type="email"
                  {...register("email")}
                  placeholder="exemple@email.com"
                  disabled={loading}
                  className={icLight}
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
                  className={icLight}
                />
              </Field>
            </div>

            <div className="h-px bg-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Field
                  variant="light"
                  label="Mot de passe"
                  error={errors.password?.message}
                  icon={<Lock className="w-4 h-4" />}
                  action={
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                >
                  <input
                    type={showPwd ? "text" : "password"}
                    {...register("password")}
                    placeholder="Mot de passe"
                    disabled={loading}
                    className={icLightPwd}
                  />
                </Field>
                {password && (
                  <div
                    className={cn(
                      "mt-2 p-3 rounded-xl space-y-1.5 border",
                      allValid ? "bg-emerald-50 border-emerald-100" : "bg-gray-50 border-gray-100",
                    )}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <ShieldCheck
                        className={`w-3.5 h-3.5 ${allValid ? "text-emerald-600" : "text-gray-400"}`}
                      />
                      <span
                        className={`text-xs font-semibold
                        ${allValid ? "text-emerald-700" : "text-gray-500"}`}
                      >
                        {allValid ? "Mot de passe fort" : "Exigences"}
                      </span>
                    </div>
                    <ValidationItem valid={validation.minLength} text="Au moins 8 caractères" />
                    <ValidationItem valid={validation.hasNumber} text="Un chiffre ou symbole" />
                    <ValidationItem valid={validation.hasCase} text="Majuscule et minuscule" />
                  </div>
                )}
              </div>
              <Field
                variant="light"
                label="Confirmer le mot de passe"
                error={errors.confirmPassword?.message}
                icon={<Lock className="w-4 h-4" />}
                action={
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              >
                <input
                  type={showPwd ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Répéter le mot de passe"
                  disabled={loading}
                  className={icLightPwd}
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
                  card-gradient text-white text-sm font-semibold shadow-sm hover:shadow-md
                  hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
              >
                <Save className="w-4 h-4" />
                {loading ? "Création..." : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
