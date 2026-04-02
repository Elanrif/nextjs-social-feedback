/**
 * User types — API response models (no validation)
 * See: src/lib/users/schemas/user.schema.ts for form validation
 */

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Payload for creating a new user (includes password)
 */
export interface UserCreatePayload {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  avatarUrl?: string;
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email: string;
  role?: UserRole;
}

export interface UserLogin {
  token: string;
  refreshToken: string;
  user: User;
}

export type UserUpdate = Partial<User>;

export interface UserSearchFilter {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface ResetPassword {
  code: string;
  resetToken: string;
  email: string;
  newPassword: string;
}
