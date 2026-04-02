import { useState } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteComment } from "@/lib/comments/hooks/use-comments";
import { toast } from "react-toastify";
import type { Comment } from "@/lib/comments/models/comment.model";
import { isValidImgUrl } from "@/utils/utils";

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b", "#10b981", "#0ea5e9"];

function getAvatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

interface CommentItemProps {
  comment: Comment;
}

export function CommentItem({ comment }: CommentItemProps) {
  const { data: session } = useSession();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { mutate: deleteComment, isPending } = useDeleteComment();

  const { author } = comment;
  const initials = getInitials(author.firstName, author.lastName);
  const color = getAvatarColor(author.id);

  // Vérifier si l'utilisateur actuel est l'auteur du commentaire
  const isOwnComment = session?.user?.id === author.id.toString();

  const handleDeleteComment = () => {
    deleteComment(comment.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        toast.success("Commentaire supprimé avec succès");
      },
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : "Erreur lors de la suppression");
      },
    });
  };

  return (
    <>
      <div className="flex gap-3 py-3 group">
        {isValidImgUrl(author.avatarUrl) ? (
          <Image
            src={author.avatarUrl}
            alt={`${author.firstName} ${author.lastName}`}
            width={32}
            height={32}
            className="size-8 rounded-full object-cover shrink-0"
          />
        ) : (
          <div
            className="size-8 rounded-full flex items-center justify-center text-xs font-bold
              text-white shrink-0"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold">
              {author.firstName} {author.lastName}
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <p className="text-sm mt-0.5 text-foreground/80 wrap-break-words">{comment.content}</p>
        </div>

        {/* Bouton supprimer (visible seulement pour l'auteur) */}
        {isOwnComment && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0
              group-hover:opacity-100 transition-opacity shrink-0"
            onClick={() => setDeleteModalOpen(true)}
            title="Supprimer le commentaire"
          >
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>

      {/* Modal de confirmation */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce commentaire ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Le commentaire sera supprimé définitivement.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteComment} disabled={isPending}>
              {isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
