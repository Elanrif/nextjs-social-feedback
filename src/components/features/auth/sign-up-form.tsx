"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Phone, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, RegisterSchema } from "@/lib/auth/models/auth.model";
import { signUpAction } from "@/lib/auth/actions/auth";
import { usePasswordValidation } from "@/hooks/use-password-validation";
import ValidationItem from "@/components/ui/validation-item";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";
import { icDark, icDarkPwd } from "@/components/ui/form/input-class";
import { isApiError } from "@/shared/errors/api-error";
import { useSession } from "next-auth/react";

export function SignUpForm() {
  const router = useRouter();
  const { update } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const validation = usePasswordValidation(password);
  const allValid = validation.minLength && validation.hasNumber && validation.hasCase;

  const fillDemo = () => {
    setValue("firstName", "Elanrif");
    setValue("lastName", "Said");
    setValue("phoneNumber", "0612345678");
    setValue("email", "saidbacoelanrif@gmail.com");
    setValue("password", "Demo1234");
    setValue("confirmPassword", "Demo1234");
  };

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signUpAction({
        action: "SIGN_UP",
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      if (isApiError(result)) {
        setError(result.detail || "Échec de la création du compte");
        setLoading(false);
        return;
      }

      // Same as sign-in: Server Action updated cookies, force client session refresh.
      await update();

      router.push("/dashboard");
      router.refresh();
      // loading reste true pendant la navigation
    } catch (error: any) {
      setError(error?.message || "Une erreur inattendue est survenue");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormError message={error} variant="dark" />

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" error={errors.firstName?.message} icon={<User className="w-4 h-4" />}>
          <input
            type="text"
            {...register("firstName")}
            placeholder="Prénom"
            disabled={loading}
            className={icDark}
          />
        </Field>
        <Field label="Nom" error={errors.lastName?.message} icon={<User className="w-4 h-4" />}>
          <input
            type="text"
            {...register("lastName")}
            placeholder="Nom"
            disabled={loading}
            className={icDark}
          />
        </Field>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Téléphone"
          error={errors.phoneNumber?.message}
          icon={<Phone className="w-4 h-4" />}
        >
          <input
            type="tel"
            {...register("phoneNumber")}
            placeholder="+33 6 00 00 00"
            disabled={loading}
            className={icDark}
          />
        </Field>
        <Field label="Email" error={errors.email?.message} icon={<Mail className="w-4 h-4" />}>
          <input
            type="email"
            {...register("email")}
            placeholder="exemple@email.com"
            disabled={loading}
            className={icDark}
          />
        </Field>
      </div>

      {/* Password row */}
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Mot de passe"
          error={errors.password?.message}
          icon={<Lock className="w-4 h-4" />}
          action={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        >
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            placeholder="Mot de passe"
            disabled={loading}
            className={icDarkPwd}
          />
        </Field>

        <Field
          label="Confirmer"
          error={errors.confirmPassword?.message}
          icon={<Lock className="w-4 h-4" />}
          action={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        >
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            placeholder="Répéter"
            disabled={loading}
            className={icDarkPwd}
          />
        </Field>
      </div>

      {/* Password strength */}
      {password && (
        <div
          className={`p-2.5 rounded-xl space-y-1 border ${
            allValid ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/8"
          }`}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <ShieldCheck className={`w-3 h-3 ${allValid ? "text-emerald-400" : "text-white/30"}`} />
            <span
              className={`text-[10px] font-semibold
              ${allValid ? "text-emerald-400" : "text-white/40"}`}
            >
              {allValid ? "Fort" : "Exigences"}
            </span>
          </div>
          <ValidationItem valid={validation.minLength} text="8 caractères min." />
          <ValidationItem valid={validation.hasNumber} text="Chiffre ou symbole" />
          <ValidationItem valid={validation.hasCase} text="Maj. et min." />
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
          bg-linear-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
          text-white text-sm font-semibold shadow-lg shadow-indigo-900/30 hover:-translate-y-0.5
          transition-all disabled:opacity-50 disabled:translate-y-0"
      >
        {loading ? (
          "Création en cours..."
        ) : (
          <>
            Créer mon compte <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Demo fill */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/25">ou</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>
      <button
        type="button"
        onClick={fillDemo}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border
          border-white/10 bg-white/5 hover:bg-white/8 text-white/50 hover:text-white/70 text-xs
          transition-colors"
      >
        <User className="w-3.5 h-3.5" />
        Remplir avec un compte démo
      </button>
    </form>
  );
}
