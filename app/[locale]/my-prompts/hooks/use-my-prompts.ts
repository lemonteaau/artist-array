"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

interface Prompt {
  id: number;
  created_at: string;
  artist_string: string;
  image_url: string;
  prompt: string | null;
  negative_prompt: string | null;
  model: string | null;
  user_id: string | null;
  likes_count: number;
  comments_count: number;
}

export function useMyPrompts() {
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserPrompts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Fetch user's prompts with counts
        const { data: promptsData, error: promptsError } = await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (promptsError) throw promptsError;

        // Fetch likes and comments counts for each prompt
        if (promptsData && promptsData.length > 0) {
          const promptIds = promptsData.map((p) => p.id);

          const [likesResult, commentsResult] = await Promise.all([
            supabase
              .from("likes")
              .select("prompt_id")
              .in("prompt_id", promptIds),
            supabase
              .from("comments")
              .select("prompt_id")
              .in("prompt_id", promptIds),
          ]);

          // Count likes and comments per prompt
          const likesCount: Record<number, number> = {};
          const commentsCount: Record<number, number> = {};

          likesResult.data?.forEach((like) => {
            likesCount[like.prompt_id] = (likesCount[like.prompt_id] || 0) + 1;
          });

          commentsResult.data?.forEach((comment) => {
            commentsCount[comment.prompt_id] =
              (commentsCount[comment.prompt_id] || 0) + 1;
          });

          // Add counts to prompts
          const promptsWithCounts = promptsData.map((prompt) => ({
            ...prompt,
            likes_count: likesCount[prompt.id] || 0,
            comments_count: commentsCount[prompt.id] || 0,
          }));

          setPrompts(promptsWithCounts);
        } else {
          setPrompts([]);
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
        toast.error("Failed to load your prompts");
      }
    };

    fetchUserPrompts();
  }, [router, supabase]);

  const handleDeletePrompt = async (promptId: number) => {
    setDeletingId(promptId);

    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompts(prompts.filter((p) => p.id !== promptId));
        toast.success("Prompt deleted successfully!");
      } else {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete prompt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setDeletingId(null);
    }
  };

  return {
    // State
    user,
    prompts,
    deletingId,

    // Actions
    handleDeletePrompt,
  };
}

export type { Prompt };
