"use client";

import { User } from "@/lib/users/models/user.model";
import { createContext, useContext } from "react";

const AuthUserContext = createContext<User | null>(null);

export function AuthUserProvider({ user, children }: { user: User; children: React.ReactNode }) {
  return <AuthUserContext.Provider value={user}>{children}</AuthUserContext.Provider>;
}

export function useAuthUser(): User {
  const user = useContext(AuthUserContext);
  if (!user) {
    throw new Error("useAuthUser must be used inside AuthUserProvider");
  }
  return user;
}
