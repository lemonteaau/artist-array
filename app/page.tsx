import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SortSelector } from "@/components/sort-selector";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Prompt {
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

async function getPrompts(sortBy = "newest"): Promise<Prompt[]> {
  const supabase = await createClient();

  try {
    // Get all prompts
    let promptsQuery = supabase.from("prompts").select("*");

    if (sortBy === "newest") {
      promptsQuery = promptsQuery.order("created_at", { ascending: false });
    }

    const { data: prompts, error: promptsError } = await promptsQuery;

    if (promptsError) {
      throw promptsError;
    }

    if (!prompts) {
      return [];
    }

    // Get likes count for each prompt
    const promptsWithLikes = await Promise.all(
      prompts.map(async (prompt) => {
        const { count } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("prompt_id", prompt.id);

        return {
          ...prompt,
          likes_count: count || 0,
        };
      })
    );

    // Sort by popularity if requested
    let finalData = promptsWithLikes;
    if (sortBy === "popular") {
      finalData = promptsWithLikes.sort(
        (a, b) => b.likes_count - a.likes_count
      );
    }

    return finalData;
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return [];
  }
}

interface HomePageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const sortBy = resolvedSearchParams.sort || "newest";
  const prompts = await getPrompts(sortBy);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">Sort by:</span>
          <SortSelector currentSort={sortBy} />
        </div>
      </div>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prompts.map((prompt) => (
            <Link href={`/prompt/${prompt.id}`} key={prompt.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={prompt.image_url}
                    alt={prompt.artist_string}
                    width={500}
                    height={500}
                    className="object-cover aspect-square"
                    priority={prompt.id === prompts[0]?.id}
                  />
                </CardContent>
                <CardFooter className="p-4">
                  <div className="w-full">
                    <p className="text-sm truncate font-medium">
                      {prompt.artist_string}
                    </p>
                    {prompt.model && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {prompt.model}
                      </p>
                    )}
                    {typeof prompt.likes_count !== "undefined" && (
                      <Badge variant="outline" className="mt-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        {prompt.likes_count}
                      </Badge>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No prompts yet!</h2>
          <p className="text-muted-foreground">Be the first to share one.</p>
        </div>
      )}
    </div>
  );
}
