import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Heart, MessageCircle, Trash2 } from "lucide-react";

interface PromptActionsProps {
  liked: boolean;
  likesCount: number;
  likesLoading: boolean;
  toggleLike: () => void;
  commentsCount: number;
  isOwner: boolean;
  isDeleting: boolean;
  onDeletePrompt: () => void;
}

export function PromptActions({
  liked,
  likesCount,
  likesLoading,
  toggleLike,
  commentsCount,
  isOwner,
  isDeleting,
  onDeletePrompt,
}: PromptActionsProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={toggleLike}
        disabled={likesLoading}
        className="flex items-center gap-1"
      >
        {likesLoading ? (
          <Heart className="w-4 h-4 animate-pulse" />
        ) : (
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        )}
        <span className="tabular-nums">{likesCount}</span>
      </Button>
      <Badge variant="secondary" className="flex items-center gap-1">
        <MessageCircle className="w-4 h-4" />
        {commentsCount}
      </Badge>
      {isOwner && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this prompt? This action cannot
                be undone. All likes and comments will also be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeletePrompt}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
