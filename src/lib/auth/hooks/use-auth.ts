"use client";

import { useMutation } from "@tanstack/react-query";
import { signIn, signUp, changeUserPassword } from "@/lib/auth/auth.client.service";
import type { Login, Registrer } from "@/lib/auth/models/auth.model";

// ─── Mutations ────────────────────────────────────────────────────────────────

/** Connexion */
export function useSignIn() {
  return useMutation({
    mutationFn: (data: Login) => signIn(data),
  });
}

/** Inscription */
export function useSignUp() {
  return useMutation({
    mutationFn: (data: Registrer) => signUp(data),
  });
}

/** Changer le mot de passe */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string; confirmPassword: string }) =>
      changeUserPassword(data),
  });
}
