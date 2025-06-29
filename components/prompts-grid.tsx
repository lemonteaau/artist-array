"use client";

import { PromptCard } from "@/components/prompt-card";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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

interface PromptsGridProps {
  prompts: Prompt[];
  userId: string | null;
  loading?: boolean;
}

export function PromptsGrid({
  prompts,
  userId,
  loading = false,
}: PromptsGridProps) {
  if (loading) {
    return <PromptsLoadingFallback />;
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-semibold">No prompts yet!</h2>
        <p className="text-muted-foreground">Be the first to share one.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {prompts.map((prompt, index) => (
        <PromptCard
          key={prompt.id}
          prompt={prompt}
          userId={userId}
          priority={index === 0}
        />
      ))}
    </div>
  );
}

export function PromptsLoadingFallback() {
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
