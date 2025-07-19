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
  user_liked?: boolean;
}

export async function getPrompts(sortBy = "newest"): Promise<Prompt[]> {
  try {
    const response = await fetch(`/api/prompts?sort=${sortBy}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data } = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }
}
