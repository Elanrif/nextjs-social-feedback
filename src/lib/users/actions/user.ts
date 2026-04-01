"use server";

import { revalidatePath } from "next/cache";
import { createUser, deleteUser, updateUser } from "../services/user.service";
import type { User } from "../models/user.model";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";

export async function createUserAction(data: Omit<User, "id">): Promise<Result<User, ApiError>> {
  const result = await createUser(data);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}

export async function deleteUserAction(id: number) {
  const result = await deleteUser(id);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}

export async function updateUserAction(id: number, data: Record<string, unknown>) {
  const result = await updateUser(id, data);
  if (result.ok) {
    revalidatePath("/dashboard/users");
  }
  return result;
}
