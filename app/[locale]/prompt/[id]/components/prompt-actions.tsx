import { Button } from "@/components/ui/button";
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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("PromptDetails");
  return (
    <div className="flex gap-2">
      <Button
        variant={liked ? "default" : "outline"}
        size="sm"
        onClick={toggleLike}
        disabled={likesLoading}
        className="flex items-center"
      >
        {likesLoading ? (
          <Heart className="w-4 h-4 animate-pulse" />
        ) : (
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        )}
        <span className="tabular-nums font-mono">{likesCount}</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center cursor-default hover:bg-[]"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="tabular-nums font-mono">{commentsCount}</span>
      </Button>
      {isOwner && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deletePrompt")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deletePromptDescription")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDeletePrompt}
                className="bg-destructive text-white hover:bg-destructive/90"
                disabled={isDeleting}
              >
                {isDeleting ? t("deleting") : t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
