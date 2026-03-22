// TODO: delete src/app/forgot-password/page.tsx (route group migration)
"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetAction } from "@/lib/auth/actions/auth";
import { searchUsersFilter } from "@/lib/users/services/user.client.service";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Lock,
  KeyRound,
  UserX,
} from "lucide-react";
import { ROUTES } from "@/utils/routes";
import { Field } from "@/components/ui/form/field";
import { icDark } from "@/components/ui/form/input-class";
import { cn } from "@/utils/utils";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotFound(false);
    setLoading(true);

    try {
      // Vérifie que l'email existe bien en base avant d'envoyer le lien
      const search = await searchUsersFilter({
        email,
      });
      if (!search.ok || search.data.length === 0) {
        setNotFound(true);
        return;
      }

      const result = await sendPasswordResetAction(email);
      if ("error" in result) {
        setError(result.message || "Failed to send reset email");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Déjà un compte ?{" "}
            <Link
              href={ROUTES.SIGN_IN}
              className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm lg:min-w-lg">
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

            {submitted ? (
              /* ── Success state ── */
              <div
                className="bg-white/5 border border-white/8 rounded-2xl p-6 backdrop-blur-sm
                  text-center"
              >
                <div
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                    bg-emerald-500/10 border border-emerald-500/20 mb-5"
                >
                  <CheckCircle className="w-7 h-7 text-emerald-400" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Email envoyé !</h1>
                <p className="text-sm text-white/40 mb-5 leading-relaxed">
                  Un lien de réinitialisation a été envoyé à{" "}
                  <span className="text-white/70 font-medium">{email}</span>. Vérifiez aussi vos
                  spams.
                </p>

                {/* Email chip */}
                <div
                  className="flex items-center gap-2.5 px-4 py-3 bg-indigo-500/10 border
                    border-indigo-500/20 rounded-xl mb-5 text-left"
                >
                  <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-sm text-white/70 break-all">{email}</span>
                </div>

                {/* Tip */}
                <div
                  className="flex items-start gap-2 px-4 py-3 bg-amber-500/8 border
                    border-amber-500/15 rounded-xl mb-6 text-left"
                >
                  <span className="text-amber-400 text-xs shrink-0 mt-0.5">💡</span>
                  <p className="text-xs text-white/40 leading-relaxed">
                    Le lien expire dans <span className="text-white/60">1 heure</span>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                    "text-white text-sm font-semibold",
                    "bg-linear-to-r from-indigo-600 to-violet-600",
                    "hover:from-indigo-500 hover:to-violet-500",
                    "shadow-lg shadow-indigo-900/30 transition-all",
                  )}
                >
                  Envoyer à une autre adresse
                </button>
              </div>
            ) : (
              /* ── Form state ── */
              <>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold text-white mb-1">Mot de passe oublié ?</h1>
                  <p className="text-sm text-white/40">
                    Entrez votre email et nous vous enverrons un lien de réinitialisation.
                  </p>
                </div>

                <div className="bg-white/5 border border-white/8 rounded-2xl p-6 backdrop-blur-sm">
                  {notFound && (
                    <div
                      className="flex flex-col gap-3 p-4 bg-amber-500/8 border border-amber-500/20
                        rounded-xl mb-4"
                    >
                      <div className="flex items-start gap-2">
                        <UserX className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-amber-300 mb-0.5">
                            Aucun compte trouvé
                          </p>
                          <p className="text-xs text-white/40 leading-relaxed">
                            Aucun compte n&apos;est associé à{" "}
                            <span className="text-white/60 font-medium">{email}</span>.
                          </p>
                        </div>
                      </div>
                      <Link
                        href={ROUTES.SIGN_UP}
                        className={cn(
                          "flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg",
                          "text-xs font-medium text-amber-300",
                          "bg-amber-500/15 border border-amber-500/25",
                          "hover:bg-amber-500/25 transition-colors",
                        )}
                      >
                        Créer un compte
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {error && (
                    <div
                      className="flex items-start gap-2 p-3 text-xs text-red-400 bg-red-500/10
                        border border-red-500/20 rounded-xl mb-4"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <Field label="Adresse email" icon={<Mail className="w-4 h-4" />}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@exemple.com"
                        required
                        disabled={loading}
                        className={icDark}
                      />
                    </Field>
                    <p className="text-xs text-white/25 -mt-2">
                      Nous vérifierons si un compte existe avec cet email.
                    </p>

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
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer le lien
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-white/8" />
                    <span className="text-xs text-white/25">ou</span>
                    <div className="flex-1 h-px bg-white/8" />
                  </div>

                  <div className="space-y-2 text-center text-sm">
                    <p className="text-white/40">
                      Vous vous souvenez de votre mot de passe ?{" "}
                      <Link
                        href={ROUTES.SIGN_IN}
                        className="text-indigo-400 font-medium hover:text-indigo-300
                          transition-colors"
                      >
                        Se connecter
                      </Link>
                    </p>
                    <p className="text-white/40">
                      Pas encore de compte ?{" "}
                      <Link
                        href={ROUTES.SIGN_UP}
                        className="text-indigo-400 font-medium hover:text-indigo-300
                          transition-colors"
                      >
                        S&apos;inscrire
                      </Link>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right — Decorative panel */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-linear-to-br
          from-indigo-600 via-violet-600 to-purple-700"
      >
        {/* Blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-violet-300/20
          blur-3xl" />

        {/* Content */}
        <div className="relative w-full flex flex-col justify-between p-12">
          {/* Top quote */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 max-w-xs">
            <p className="text-white text-sm leading-relaxed">
              &ldquo;La sécurité de vos données est notre priorité absolue.&rdquo;
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
                  <Lock className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Réinitialisation</p>
                  <p className="text-[10px] text-gray-400">Lien sécurisé</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div
                    className="h-full w-full bg-linear-to-r from-indigo-500 to-violet-500
                      rounded-full"
                  />
                </div>
                <p className="text-[10px] text-gray-400">Chiffrement AES-256</p>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 w-48 border
              border-white/20">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-white/80 text-xs font-medium">Connexion sécurisée</span>
              </div>
              <p className="text-white/50 text-[10px]">HTTPS · Données chiffrées</p>
            </div>
          </div>

          {/* Bottom — security features */}
          <div className="space-y-2.5">
            {["Lien expirant en 1 heure", "Token à usage unique", "Notification par email"].map(
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
    </div>
  );
}
