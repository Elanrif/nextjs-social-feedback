"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Repeat2, Send, Trash2, BadgeCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CommentItem } from "./comment-item";
import { useComments, useCreateComment } from "@/lib/comments/hooks/use-comments";
import { useDeletePost } from "@/lib/posts/hooks/use-posts";
import { useSession } from "next-auth/react";
import type { Post } from "@/lib/posts/models/post.model";
import { UserRole } from "@/lib/users/models/user.model";
import { isValidImgUrl } from "@/utils/utils";
import { toast } from "react-toastify";

// ── Helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#10b981", "#0ea5e9"];

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ── PostComments (lazy-loaded on expand) ─────────────────────────────────────

function PostComments({ postId, authorName }: { postId: number; authorName: string }) {
  const { data, isLoading } = useComments({ postId, size: 5 });
  const comments = data?.content ?? [];
  const { data: session } = useSession();
  const [commentText, setCommentText] = useState("");
  const { mutate: createComment, isPending } = useCreateComment();

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    if (!session?.user?.id) return;

    createComment(
      {
        content: commentText,
        postId,
        authorId: Number(session.user.id),
      },
      {
        onSuccess: () => {
          setCommentText("");
          toast.success("Commentaire ajouté avec succès");
        },
      },
    );
  };

  const renderCommentsList = () => {
    if (isLoading) {
      return <p className="py-4 text-xs text-muted-foreground text-center">Chargement…</p>;
    }

    if (comments.length === 0) {
      return <p className="py-4 text-xs text-muted-foreground text-center">Aucun commentaire</p>;
    }

    return (
      <div className="divide-y divide-border">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Input de création */}
      {session?.user && (
        <div className="flex items-end gap-2 pb-3 border-b border-border">
          <Input
            placeholder={`Répondre à ${authorName}`}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitComment();
              }
            }}
            className="flex-1 text-sm h-9"
            disabled={isPending}
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleSubmitComment}
            disabled={!commentText.trim() || isPending}
            className="shrink-0 text-blue-500"
          >
            <Send className="size-4" />
          </Button>
        </div>
      )}

      {/* Affichage des commentaires */}
      {renderCommentsList()}
    </div>
  );
}

// ── PostCard ──────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showComments, setShowComments] = useState(false);
  const [lightbox, setLightbox] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { data: session } = useSession();
  const { data: commentsData } = useComments({ postId: post.id, size: 100 });
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();
  const commentCount = commentsData?.content?.length ?? 0;

  const { author } = post;
  const initials = getInitials(author.firstName, author.lastName);
  const color = getAvatarColor(author.id);
  const isAdmin = author.role === UserRole.ADMIN;
  const authorName = `${author.firstName} ${author.lastName}`;
  const isOwnPost = session?.user?.id === post.author.id.toString();

  const handleDeletePost = () => {
    deletePost(post.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        toast.success("Post supprimé avec succès");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Erreur lors de la suppression");
      },
    });
  };

  return (
    <article
      className="border border-border rounded-xl p-4 bg-card hover:bg-accent/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        {isValidImgUrl(author.avatarUrl) ? (
          <Image
            src={author.avatarUrl}
            alt={`${author.firstName} ${author.lastName}`}
            width={40}
            height={40}
            className="rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="size-10 rounded-full flex items-center justify-center text-sm font-bold
              text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm">
              {author.firstName} {author.lastName}
            </span>
            {isAdmin && <BadgeCheck className="size-4 fill-indigo-500 text-white" />}
          </div>
          <span className="text-xs text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>

        {isOwnPost && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-red-500 shrink-0 transition-colors"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="mt-3 ml-13">
        {post.title && <p className="font-semibold text-sm mb-1">{post.title}</p>}
        <p className="text-sm leading-relaxed text-foreground/90">{post.description}</p>

        {isValidImgUrl(post.imageUrl) && (
          <>
            <button
              type="button"
              onClick={() => setLightbox(true)}
              className="mt-3 w-full rounded-xl overflow-hidden border border-border block
                cursor-zoom-in"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={600}
                height={300}
                className="w-full max-h-72 object-cover hover:scale-[1.02] transition-transform
                  duration-300"
              />
            </button>

            <Dialog open={lightbox} onOpenChange={setLightbox}>
              <DialogContent
                showCloseButton={false}
                className="max-w-[80vw] max-h-[80vh] p-0 bg-black/95 border-none shadow-2xl flex
                  items-center justify-center"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setLightbox(false)}
                  className="absolute top-3 right-3 z-10 text-white/70 hover:text-white
                    hover:bg-white/10 rounded-full"
                >
                  <X className="size-5" />
                </Button>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  width={1200}
                  height={800}
                  className="max-w-[75vw] max-h-[75vh] object-contain rounded-lg"
                />
              </DialogContent>
            </Dialog>
          </>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-1 mt-3 -ml-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 text-muted-foreground hover:text-rose-500 px-2",
              liked && "text-rose-500",
            )}
            onClick={() => {
              setLiked((v) => !v);
              setLikeCount((c) => (liked ? c - 1 : c + 1));
            }}
          >
            <Heart className={cn("size-4", liked && "fill-rose-500 stroke-rose-500")} />
            {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "gap-1.5 text-muted-foreground hover:text-foreground px-2",
              showComments && "text-foreground",
            )}
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="size-4" />
            {commentCount > 0 && <span className="text-xs">{commentCount}</span>}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground px-2"
          >
            <Repeat2 className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground px-2"
          >
            <Send className="size-4" />
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-border">
            <PostComments postId={post.id} authorName={authorName} />
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce post?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Cette action ne peut pas être annulée. Êtes-vous sûr?
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isDeleting}>
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );
}
