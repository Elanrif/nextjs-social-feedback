"use server";

import { revalidatePath } from "next/cache";
import {
  createComment,
  updateComment,
  deleteComment,
} from "@/lib/comments/services/comment.service";
import { CommentCreate, CommentUpdate } from "@/lib/comments/models/comment.model";

export async function createCommentAction(data: CommentCreate) {
  const result = await createComment(data);
  if (result.ok) {
    revalidatePath("/comments");
  }
  return result;
}

export async function updateCommentAction(id: number, data: CommentUpdate) {
  const result = await updateComment(id, data);
  if (result.ok) {
    revalidatePath("/comments");
  }
  return result;
}

export async function deleteCommentAction(id: number) {
  const result = await deleteComment(id);
  if (result.ok) {
    revalidatePath("/comments");
  }
  return result;
}
