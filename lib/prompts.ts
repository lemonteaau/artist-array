import { createClient } from "@/utils/supabase/client";

export interface Prompt {
  id: number;
  created_at: string;
  artist_string: string;
  image_url: string;
  prompt: string | null;
  negative_prompt: string | null;
  user_id: string | null;
  model: string | null;
  likes_count?: number;
}

export async function getPrompts(sortBy = "newest"): Promise<Prompt[]> {
  const supabase = createClient();

  try {
    const [promptsResult, likesResult] = await Promise.all([
      supabase
        .from("prompts")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("likes").select("prompt_id"),
    ]);

    if (promptsResult.error || likesResult.error) {
      throw promptsResult.error || likesResult.error;
    }

    const prompts = promptsResult.data || [];
    const likes = likesResult.data || [];

    const likesCountMap = likes.reduce((acc, like) => {
      acc[like.prompt_id] = (acc[like.prompt_id] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const formattedPrompts = prompts.map((prompt) => ({
      ...prompt,
      likes_count: likesCountMap[prompt.id] || 0,
    }));

    if (sortBy === "popular") {
      return formattedPrompts.sort((a, b) => b.likes_count - a.likes_count);
    }

    return formattedPrompts;
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }
}
