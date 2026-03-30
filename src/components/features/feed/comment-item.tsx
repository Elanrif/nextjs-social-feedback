import type { Comment } from "@/lib/comments/models/comment.model";

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
  const { author } = comment;
  const initials = getInitials(author.firstName, author.lastName);
  const color = getAvatarColor(author.id);

  return (
    <div className="flex gap-3 py-3">
      {author.avatarUrl ? (
        <img
          src={author.avatarUrl}
          alt={`${author.firstName} ${author.lastName}`}
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
        <p className="text-sm mt-0.5 text-foreground/80 break-words">{comment.content}</p>
      </div>
    </div>
  );
}
