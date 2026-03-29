"use client";

import { useState } from "react";
import { ROUTES } from "@/utils/routes";
import { signOutAction } from "@/lib/auth/actions/auth";
import LoadingPage from "@/components/features/loading-page";

interface SignOutButtonProps {
  children?: React.ReactNode;
  redirectTo?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  onSignOut?: () => void;
}

export function SignOutButton({
  children = "Sign Out",
  redirectTo = ROUTES.HOME,
  className = "",
  variant = "default",
  onSignOut,
}: SignOutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    if (onSignOut) onSignOut();
    await signOutAction();
    window.location.href = redirectTo ?? "/";
  };

  const variantStyles = {
    default: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <>
      <LoadingPage loading={loading} text="Déconnexion en cours..." />
      <button
        onClick={handleSignOut}
        disabled={loading}
        className={`px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2
          focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors
          ${variantStyles[variant]} ${className}`}
      >
        {loading ? "Déconnexion..." : children}
      </button>
    </>
  );
}
