"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "@/lib/auth/schemas/auth.schema";
import Link from "next/link";
import { ROUTES } from "@/utils/routes";
import { signInAction } from "@/lib/auth/actions/auth.action";
import { Field } from "@/components/ui/form/field";
import { FormError } from "@/components/ui/form/form-error";
import { icDark, icDarkPwd } from "@/components/ui/form/input-class";
import { isApiError } from "@/shared/errors/api-error";
import { useSession } from "next-auth/react";

export function SignInForm() {
  const router = useRouter();
  const { update } = useSession();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema) as any,
    defaultValues: { email: "", password: "" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillDemo = () => {
    setValue("email", "admin@gmail.com");
    setValue("password", "admin123456");
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError(null);
    try {
      const result = await signInAction({
        email: data.email,
        password: data.password,
      });
      if (isApiError(result)) {
        setApiError(result.detail || "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      // Server Action signIn sets the cookie, but the client SessionProvider
      // doesn't automatically know it changed. Force a re-fetch of /api/auth/session.
      await update();

      router.push("/dashboard");
      router.refresh();
      // isLoading reste true pendant la navigation
    } catch (error: any) {
      setApiError(error?.message || "Une erreur est survenue.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormError message={apiError} variant="dark" />

      {/* Email */}
      <Field
        label="Adresse email"
        error={errors.email?.message}
        icon={<Mail className="w-4 h-4" />}
      >
        <input
          type="email"
          {...register("email")}
          placeholder="exemple@email.com"
          disabled={loading}
          className={icDark}
        />
      </Field>

      {/* Password */}
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
          placeholder="Votre mot de passe"
          disabled={loading}
          className={icDarkPwd}
        />
      </Field>

      {/* Forgot password */}
      <div className="text-right">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
          bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500
          text-white text-sm font-semibold shadow-lg shadow-emerald-900/30
          hover:shadow-emerald-900/50 hover:-translate-y-0.5 transition-all disabled:opacity-50
          disabled:translate-y-0"
      >
        {loading ? (
          "Connexion en cours..."
        ) : (
          <>
            Se connecter <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Divider + socials */}
      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-px bg-white/8" />
        <span className="text-xs text-white/25">ou</span>
        <div className="flex-1 h-px bg-white/8" />
      </div>

      <div className="flex items-center gap-2">
        {/* Demo fill */}
        <button
          type="button"
          onClick={fillDemo}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/15 border
            border-blue-500/20 text-blue-400 hover:bg-blue-500/25 transition-colors"
          title="Remplir avec compte démo"
        >
          <User className="w-4 h-4" />
        </button>
        <SocialButton icon="google" />
        <SocialButton icon="facebook" />
      </div>
    </form>
  );
}

function SocialButton({ icon }: { icon: "facebook" | "google" }) {
  return (
    <button
      type="button"
      className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10
        bg-white/5 hover:bg-white/10 transition-colors"
    >
      {icon === "facebook" ? (
        <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
    </button>
  );
}
