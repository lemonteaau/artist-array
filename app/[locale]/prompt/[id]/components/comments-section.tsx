import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useDateFormat } from "@/lib/date-utils";
import { Comment } from "../hooks/use-prompt-detail";
import { User } from "@supabase/supabase-js";

interface CommentsSectionProps {
  comments: Comment[];
  user: User | null;
  newComment: string;
  setNewComment: (value: string) => void;
  submittingComment: boolean;
  handleComment: (e: React.FormEvent) => void;
  handleDeleteComment: (commentId: number) => void;
  deletingComments: Set<number>;
}

export function CommentsSection({
  comments,
  user,
  newComment,
  setNewComment,
  submittingComment,
  handleComment,
  handleDeleteComment,
  deletingComments,
}: CommentsSectionProps) {
  const t = useTranslations("PromptDetails");
  const { formatDate } = useDateFormat();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("comments")} ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-muted p-3 rounded-md space-y-2 transition-all duration-300 ${
                  deletingComments.has(comment.id)
                    ? "opacity-0 transform scale-95"
                    : "opacity-100 transform scale-100"
                }`}
              >
                <p className="text-sm">{comment.content}</p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {comment.profiles?.display_name ??
                      `User ${comment.user_id.slice(0, 8)}...`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{formatDate(comment.created_at)}</span>
                    {user && comment.user_id === user.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteComment(comment.id)}
                        disabled={deletingComments.has(comment.id)}
                        className="h-auto p-1 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-50"
                      >
                        {deletingComments.has(comment.id) ? (
                          <div className="w-3 h-3 border-2 border-destructive border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center">
            {t("noCommentsYet")}
          </p>
        )}

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleComment} className="mt-6 flex flex-col gap-4">
            <Textarea
              placeholder={t("addComment")}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={submittingComment}
              className="resize-none"
            />
            <Button
              className="cursor-pointer self-end"
              type="submit"
              disabled={submittingComment || !newComment.trim()}
            >
              {submittingComment ? t("addingComment") : t("addComment")}
            </Button>
          </form>
        ) : (
          <div className="mt-6 p-4 bg-muted rounded-md text-center">
            <p className="text-sm text-muted-foreground">
              <Link href="/login" className="text-primary hover:underline">
                {t("loginToComment")}
              </Link>{" "}
              {t("toAddComment")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
