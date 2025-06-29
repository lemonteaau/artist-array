"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SortSelector } from "@/components/sort-selector";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { SmartLikeButton } from "@/components/smart-like-button";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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

function HomePageContent() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "newest";

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const [
        promptsData,
        {
          data: { user },
        },
      ] = await Promise.all([getPrompts(sortBy), supabase.auth.getUser()]);

      setPrompts(promptsData);
      setUser(user);
      setLoading(false);
    };

    fetchData();
  }, [sortBy, supabase]);

  if (loading) {
    return <PromptsLoadingFallback />;
  }

  return prompts && prompts.length > 0 ? (
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
                  <div className="mt-2">
                    <SmartLikeButton
                      promptId={prompt.id.toString()}
                      userId={user?.id || null}
                      variant="badge"
                    />
                  </div>
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
  );
}

function HomePageWrapper() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "newest";

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">Sort by:</span>
          <SortSelector currentSort={sortBy} />
        </div>
      </div>

      <Suspense fallback={<PromptsLoadingFallback />}>
        <HomePageContent />
      </Suspense>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-64">
          <div>Loading...</div>
        </div>
      }
    >
      <HomePageWrapper />
    </Suspense>
  );
}

function PromptsLoadingFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden animate-pulse">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted" />
          </CardContent>
          <CardFooter className="p-4">
            <div className="w-full space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-5 bg-muted rounded w-16" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
