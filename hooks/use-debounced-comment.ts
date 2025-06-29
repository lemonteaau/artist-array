import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

interface Comment {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  users?: {
    email: string;
  };
}

interface UseDebouncedCommentProps {
  promptId: string;
  userId: string | null;
  onAuthRequired: () => void;
  onCommentAdded: (comment: Comment) => void;
}

export function useDebouncedComment({
  promptId,
  userId,
  onAuthRequired,
  onCommentAdded,
}: UseDebouncedCommentProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingComment, setIsDeletingComment] = useState<
    Record<number, boolean>
  >({});

  const lastSubmittedContentRef = useRef<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedSubmitComment = useDebouncedCallback(
    async (content: string) => {
      if (!userId || !content.trim()) return;

      if (content.trim() === lastSubmittedContentRef.current) {
        setIsSubmitting(false);
        toast.error("Please wait before submitting the same comment again");
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch("/api/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt_id: parseInt(promptId),
            content: content.trim(),
          }),
          signal: controller.signal,
        });

        if (response.ok) {
          const { data: newComment } = await response.json();

          lastSubmittedContentRef.current = content.trim();

          onCommentAdded(newComment);

          toast.success("Comment added!");

          setTimeout(() => {
            lastSubmittedContentRef.current = "";
          }, 5000);
        } else {
          throw new Error("Failed to add comment");
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        console.error("Comment submission error:", error);
        toast.error("Failed to add comment. Please try again.");
      } finally {
        setIsSubmitting(false);
        abortControllerRef.current = null;
      }
    },
    800
  );

  const submitComment = useCallback(
    (content: string) => {
      if (!userId) {
        onAuthRequired();
        return;
      }

      if (!content.trim()) {
        toast.error("Comment cannot be empty");
        return;
      }

      if (isSubmitting) {
        toast.error("Please wait for the previous comment to be submitted");
        return;
      }

      setIsSubmitting(true);
      debouncedSubmitComment(content);
    },
    [userId, isSubmitting, onAuthRequired, debouncedSubmitComment]
  );

  const debouncedDeleteComment = useDebouncedCallback(
    async (commentId: number) => {
      try {
        const response = await fetch(`/api/comments/${commentId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          toast.success("Comment deleted!");
          return true;
        } else {
          throw new Error("Failed to delete comment");
        }
      } catch (error) {
        console.error("Delete comment error:", error);
        toast.error("Failed to delete comment. Please try again.");
        return false;
      } finally {
        setIsDeletingComment((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    300
  );

  const deleteComment = useCallback(
    (commentId: number) => {
      if (!userId) {
        onAuthRequired();
        return;
      }

      if (isDeletingComment[commentId]) {
        toast.error("Please wait for the previous action to complete");
        return;
      }

      setIsDeletingComment((prev) => ({ ...prev, [commentId]: true }));
      return debouncedDeleteComment(commentId);
    },
    [userId, isDeletingComment, onAuthRequired, debouncedDeleteComment]
  );

  const isDeleting = useCallback(
    (commentId: number) => {
      return !!isDeletingComment[commentId];
    },
    [isDeletingComment]
  );

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    debouncedSubmitComment.cancel();
    debouncedDeleteComment.cancel();
  }, [debouncedSubmitComment, debouncedDeleteComment]);

  return {
    isSubmitting,
    submitComment,
    deleteComment,
    isDeleting,
    cleanup,
  };
}
