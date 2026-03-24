import { AxiosResponse } from "axios";
import { CrudApiError, Result } from "@lib/shared/helpers/crud-api-error";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { AuthPayload, Login, Registrer } from "@lib/auth/models/auth.model";
import { User } from "@lib/users/models/user.model";

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Auth client service for handling user authentication operations.
 * This service interacts with the proxy API endpoints for authentication.
 */
const {
  api: {
    endpoints: {
      passwordChange: passwordChangeUrl,
      register: registerUrl,
      login: loginUrl,
      signOut: _signOutUrl,
    },
  },
} = proxyEnvironment;

/**
 * Sign in a user with email and password (client-side)
 */
export async function signIn(login: Login): Promise<Result<AuthPayload, CrudApiError>> {
  const result = await frontendHttp().post<any, AxiosResponse<Result<AuthPayload, CrudApiError>>>(
    loginUrl,
    login,
  );
  return result.data;
}

/**
 * Register a new user (client-side)
 */
export async function signUp(registration: Registrer): Promise<Result<AuthPayload, CrudApiError>> {
  const res = await frontendHttp().post<any, AxiosResponse<Result<AuthPayload, CrudApiError>>>(
    registerUrl,
    registration,
  );
  return res.data;
}

// ──────────────────────────── Profile management ─────────────────────────────
/**
 * Change the password of an authenticated user (client-side)
 */
export async function changeUserPassword({
  oldPassword,
  newPassword,
  confirmPassword,
}: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<Result<User, CrudApiError>> {
  const body = {
    oldPassword,
    newPassword,
    confirmPassword,
  };
  const result = await frontendHttp().patch<any, AxiosResponse<Result<User, CrudApiError>>>(
    passwordChangeUrl,
    body,
  );
  return result.data;
}
