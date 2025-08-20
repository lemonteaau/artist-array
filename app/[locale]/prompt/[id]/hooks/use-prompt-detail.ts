"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSmartLike } from "@/hooks/use-smart-like";
import { useDebouncedComment } from "@/hooks/use-debounced-comment";
import { useTranslations } from "next-intl";

export interface Comment {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface Prompt {
  id: number;
  created_at: string;
  artist_string: string;
  image_url: string;
  prompt: string | null;
  negative_prompt: string | null;
  model: string | null;
  user_id: string | null;
  likes_count: number;
  comments: Comment[];
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export function usePromptDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingComments, setDeletingComments] = useState<Set<number>>(
    new Set()
  );

  const supabase = createClient();
  const tToast = useTranslations("Toast");

  const handleAuthRequired = () => {
    toast.error(tToast("pleaseLoginToInteract"));
    router.push("/login");
  };

  const {
    liked,
    count: likesCount,
    isLoading: likesLoading,
    toggleLike,
  } = useSmartLike({
    promptId: id,
    userId: user?.id || null,
    onAuthRequired: handleAuthRequired,
  });

  const { isSubmitting: submittingComment, submitComment } =
    useDebouncedComment({
      promptId: id,
      userId: user?.id || null,
      onAuthRequired: handleAuthRequired,
      onCommentAdded: (newComment) => {
        setPrompt((prev) =>
          prev
            ? {
                ...prev,
                comments: [...prev.comments, newComment],
              }
            : null
        );
        setNewComment("");
      },
    });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const { data: promptData, error: promptError } = await supabase
          .from("prompts")
          .select(
            `
            *,
            profiles!prompts_user_id_fkey ( display_name, avatar_url )
          `
          )
          .eq("id", id)
          .single();

        if (promptError) {
          throw promptError;
        }

        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("prompt_id", id);

        const { data: comments, error: commentsError } = await supabase
          .from("comments")
          .select(
            `
            id,
            created_at,
            content,
            user_id,
            profiles ( display_name, avatar_url )
          `
          )
          .eq("prompt_id", id)
          .order("created_at", { ascending: true });

        if (commentsError) {
          throw commentsError;
        }

        const transformedData = {
          ...promptData,
          likes_count: likesCount || 0,
          comments: comments || [],
        };

        setPrompt(transformedData);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load prompt");
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id, supabase]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    submitComment(newComment);
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!user) {
      handleAuthRequired();
      return;
    }

    // Optimistic update - immediately mark comment as deleting and add fade-out animation
    setDeletingComments((prev) => new Set(prev).add(commentId));

    // After animation duration, optimistically remove from UI
    setTimeout(() => {
      setPrompt((prev) =>
        prev
          ? {
              ...prev,
              comments: prev.comments.filter((c) => c.id !== commentId),
            }
          : null
      );
    }, 300); // Match animation duration

    // Perform the actual deletion
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      toast.success("Comment deleted!");
    } catch (error) {
      console.error("Delete comment error:", error);
      toast.error("Failed to delete comment. Please try again.");

      // Rollback optimistic update on error
      setDeletingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });

      // Restore the comment to the UI
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select(
          `
          id,
          created_at,
          content,
          user_id,
          profiles ( display_name, avatar_url )
        `
        )
        .eq("prompt_id", id)
        .order("created_at", { ascending: true });

      if (!commentsError && comments) {
        setPrompt((prev) =>
          prev
            ? {
                ...prev,
                comments: comments.map((comment) => ({
                  ...comment,
                  profiles: Array.isArray(comment.profiles)
                    ? comment.profiles[0]
                    : comment.profiles,
                })) as Comment[],
              }
            : null
        );
      }
    } finally {
      setDeletingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleDeletePrompt = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Prompt deleted successfully!");
        router.push("/");
      } else {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete prompt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = !!(user && prompt?.user_id === user.id);

  return {
    // State
    prompt,
    loading,
    user,
    newComment,
    setNewComment,
    isDeleting,
    deletingComments,
    isOwner,

    // Like functionality
    liked,
    likesCount,
    likesLoading,
    toggleLike,

    // Comment functionality
    submittingComment,
    handleComment,
    handleDeleteComment,

    // Prompt actions
    handleDeletePrompt,
    handleAuthRequired,
  };
}
