"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Prompt } from "@/lib/prompts";

export function useFavorites() {
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchFavoritePrompts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Fetch all prompts that the user has liked
        const { data: likes, error: likesError } = await supabase
          .from("likes")
          .select(
            `
            prompt_id,
            prompts (
              id,
              created_at,
              artist_string,
              image_url,
              prompt,
              negative_prompt,
              model,
              user_id
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (likesError) throw likesError;

        if (likes && likes.length > 0) {
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const likedPrompts = likes
            .map((like: any) => like.prompts)
            .filter(Boolean) as Prompt[];

          // Get prompt IDs for fetching counts
          const promptIds = likedPrompts.map((p) => p.id);

          // Fetch likes counts for all prompts
          const { data: allLikes } = await supabase
            .from("likes")
            .select("prompt_id")
            .in("prompt_id", promptIds);

          // Count likes per prompt
          const likesCountMap: Record<number, number> = {};
          allLikes?.forEach((like) => {
            likesCountMap[like.prompt_id] =
              (likesCountMap[like.prompt_id] || 0) + 1;
          });

          // Format prompts with likes count
          const formattedPrompts = likedPrompts.map((prompt) => ({
            ...prompt,
            likes_count: likesCountMap[prompt.id] || 0,
          }));

          setPrompts(formattedPrompts);
        } else {
          setPrompts([]);
        }
      } catch (error) {
        console.error("Error fetching favorite prompts:", error);
        toast.error("Failed to load favorite prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePrompts();
  }, [router, supabase]);

  return {
    user,
    prompts,
    loading,
  };
}
