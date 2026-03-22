"use server";

import { revalidatePath } from "next/cache";
import { deleteUser, updateUser } from "../services/user.client.service";

export async function deleteUserAction(id: number) {
  try {
    await deleteUser(id);
    revalidatePath("/dashboard/users");
    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "Failed to delete user",
    };
  }
}

export async function updateUserAction(id: number, data: Record<string, unknown>) {
  try {
    await updateUser(id, data);
    revalidatePath("/dashboard/users");
    return { ok: true };
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "Failed to update user",
    };
  }
}
