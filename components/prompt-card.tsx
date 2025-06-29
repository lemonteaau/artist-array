"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SmartLikeButton } from "@/components/smart-like-button";
import Image from "next/image";
import Link from "next/link";

interface PromptCardProps {
  prompt: {
    id: number;
    created_at: string;
    artist_string: string;
    image_url: string;
    prompt: string | null;
    negative_prompt: string | null;
    user_id: string | null;
    model: string | null;
    likes_count?: number;
  };
  userId: string | null;
  priority?: boolean;
}

export function PromptCard({
  prompt,
  userId,
  priority = false,
}: PromptCardProps) {
  return (
    <Link href={`/prompt/${prompt.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
          <Image
            src={prompt.image_url}
            alt={prompt.artist_string}
            width={500}
            height={500}
            className="object-cover aspect-square"
            priority={priority}
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
                  userId={userId}
                  variant="badge"
                />
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
