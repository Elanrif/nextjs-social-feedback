// TODO: delete src/app/reset-password/page.tsx (route group migration)
"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { resetPasswordTokenAction } from "@/lib/auth/actions/auth";
import { ROUTES } from "@/utils/routes";
import { Field } from "@/components/ui/form/field";
import { icDarkPwd } from "@/components/ui/form/input-class";
import { cn } from "@/utils/utils";
import { isApiError } from "@/shared/errors/api-error";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const resetToken = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validatePasswords = () => {
    if (!password || !confirmPassword) {
      setError("Veuillez remplir tous les champs");
      return false;
    }
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetToken || !email || !code) {
      setError("Lien de réinitialisation invalide. Veuillez réessayer.");
      return;
    }

    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const res = await resetPasswordTokenAction({
        // ❌ not use to backend : oldPassword: confirmPassword,
        code,
        resetToken,
        email,
        newPassword: password,
      });
      if (isApiError(res)) {
        setError(res.detail || "Échec de la réinitialisation");
        return;
      }
      setSuccess(true);
    } catch {
      setError("Échec de la réinitialisation. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Invalid link ── */
  if (!resetToken || !email || !code) {
    return (
      <div className="min-h-screen flex bg-slate-950">
        <div className="flex-1 flex flex-col px-6 py-8 lg:px-12">
          <div className="flex items-center">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10
                text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div
                className="bg-white/5 border border-white/8 rounded-2xl p-8 backdrop-blur-sm
                  text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                    bg-red-500/10 border border-red-500/20 mb-5"
                >
                  <AlertCircle className="w-7 h-7 text-red-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Lien invalide</h1>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  Ce lien de réinitialisation est invalide ou a expiré. Veuillez en demander un
                  nouveau.
                </p>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl",
                    "text-white text-sm font-semibold",
                    "bg-linear-to-r from-indigo-600 to-violet-600",
                    "hover:from-indigo-500 hover:to-violet-500",
                    "shadow-lg shadow-indigo-900/30 transition-all",
                  )}
                >
                  Demander un nouveau lien
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <DecorativePanel />
      </div>
    );
  }

  /* ── Success state ── */
  if (success) {
    return (
      <div className="min-h-screen flex bg-slate-950">
        <div className="flex-1 flex flex-col px-6 py-8 lg:px-12">
          <div className="flex items-center">
            <Link
              href={ROUTES.SIGN_IN}
              className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10
                text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-sm">
              <div className="flex items-center gap-2.5 mb-8">
                <div
                  className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex
                    items-center justify-center shadow-lg shadow-indigo-900/40"
                >
                  <KeyRound className="w-4 h-4 text-white" />
                </div>
                <span className="text-white font-semibold text-sm">Kickstart</span>
              </div>

              <div
                className="bg-white/5 border border-white/8 rounded-2xl p-6 backdrop-blur-sm
                  text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                    bg-emerald-500/10 border border-emerald-500/20 mb-5"
                >
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Mot de passe réinitialisé !</h1>
                <p className="text-sm text-white/40 mb-6 leading-relaxed">
                  Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous
                  connecter.
                </p>
                <Link
                  href={ROUTES.SIGN_IN}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl",
                    "text-white text-sm font-semibold",
                    "bg-linear-to-r from-indigo-600 to-violet-600",
                    "hover:from-indigo-500 hover:to-violet-500",
                    "shadow-lg shadow-indigo-900/30 transition-all",
                  )}
                >
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <DecorativePanel />
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col px-6 py-8 lg:px-12">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href={ROUTES.SIGN_IN}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-white/10
              text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <p className="text-sm text-white/40">
            Vous vous souvenez ?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Brand */}
            <div className="flex items-center gap-2.5 mb-8">
              <div
                className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-violet-600 flex
                  items-center justify-center shadow-lg shadow-indigo-900/40"
              >
                <KeyRound className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold text-sm">Kickstart</span>
            </div>

            <div className="mb-7">
              <h1 className="text-2xl font-bold text-white mb-1">Nouveau mot de passe</h1>
              <p className="text-sm text-white/40">
                Créez un nouveau mot de passe pour votre compte.
              </p>
            </div>

            <div className="bg-white/5 border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
              {/* Email chip */}
              <div
                className="flex items-center gap-2.5 px-3 py-2.5 bg-indigo-500/10 border
                  border-indigo-500/20 rounded-xl mb-4"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                <span className="text-xs text-white/60 truncate">{email}</span>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-start gap-2 p-3 text-xs text-red-400 bg-red-500/10 border
                    border-red-500/20 rounded-xl mb-4"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <Field
                  label="Nouveau mot de passe"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className={icDarkPwd}
                  />
                </Field>
                <p className="text-xs text-white/25 -mt-2">Minimum 8 caractères requis</p>

                {/* Confirm password */}
                <Field
                  label="Confirmer le mot de passe"
                  icon={<Lock className="w-4 h-4" />}
                  action={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-white/30 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className={icDarkPwd}
                  />
                </Field>
                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <p
                    className={`text-xs flex items-center gap-1 -mt-2
                    ${password === confirmPassword ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {password === confirmPassword ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Les mots de passe correspondent
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Les mots de passe ne correspondent pas
                      </>
                    )}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                    "text-white text-sm font-semibold",
                    "bg-linear-to-r from-indigo-600 to-violet-600",
                    "hover:from-indigo-500 hover:to-violet-500",
                    "shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50",
                    "hover:-translate-y-0.5 transition-all",
                    "disabled:opacity-50 disabled:translate-y-0",
                  )}
                >
                  {loading ? (
                    <>
                      <div
                        className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full
                          animate-spin"
                      />
                      Réinitialisation...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Réinitialiser le mot de passe
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-white/8" />
                <span className="text-xs text-white/25">sécurisé</span>
                <div className="flex-1 h-px bg-white/8" />
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-white/25">
                <Shield className="w-3.5 h-3.5" />
                Connexion chiffrée · Token à usage unique
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Decorative panel */}
      <DecorativePanel />
    </div>
  );
}

function DecorativePanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-linear-to-br from-indigo-600
        via-violet-600 to-purple-700"
    >
      {/* Blobs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-violet-300/20 blur-3xl" />

      {/* Content */}
      <div className="relative w-full flex flex-col justify-between p-12">
        {/* Top quote */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 max-w-xs">
          <p className="text-white text-sm leading-relaxed">
            &ldquo;Votre sécurité est notre priorité. Chaque accès est protégé.&rdquo;
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            <div
              className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center
                text-white text-xs font-bold"
            >
              K
            </div>
            <div>
              <p className="text-white text-xs font-medium">Kickstart Team</p>
              <p className="text-white/50 text-[10px]">Next.js Starter Kit</p>
            </div>
          </div>
        </div>

        {/* Center — security visual */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-5 shadow-xl w-60">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Nouveau mot de passe</p>
                <p className="text-[10px] text-gray-400">Chiffrement fort</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full bg-linear-to-r from-indigo-500
                      to-violet-500"
                  />
                ))}
              </div>
              <p className="text-[10px] text-gray-400">Niveau de sécurité : Fort</p>
            </div>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-48 border border-white/20">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
              <span className="text-white/80 text-xs font-medium">Token valide</span>
            </div>
            <p className="text-white/50 text-[10px]">Expire dans 1 heure</p>
          </div>
        </div>

        {/* Bottom — security features */}
        <div className="space-y-2.5">
          {["Bcrypt hashing sécurisé", "Token à usage unique", "Historique des connexions"].map(
            (f) => (
              <div key={f} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center
                    shrink-0"
                >
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
          <div
            className="w-6 h-6 border-2 border-indigo-500/40 border-t-indigo-500 rounded-full
              animate-spin"
          />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
