import { User } from "@/lib/users/models/user.model";
import { Token } from "@/config/auth.utils";

/**
 * Auth types — API contracts and session shapes (no validation)
 * See: src/lib/auth/schemas/auth.schema.ts for form validation
 */

export interface AuthSignIn {
  action?: "SIGN_IN" | "SIGN_UP";
}

export interface Registrer extends AuthSignIn {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Login extends AuthSignIn {
  email: string;
  password: string;
}

/**
 * Auth payload — mirrors the backend response shape.
 * Used by providers (sign-in result) and the session layer.
 * Token fields are flat via Partial<Token>.
 */
export type AuthPayload = Partial<Token> & {
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: string;
    avatarUrl?: string;
  };
};

/**
 * Current user — session context type
 */
export type CurrentUser = {
  user: User;
  session: AuthPayload;
};
