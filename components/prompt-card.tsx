"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SmartLikeButton } from "@/components/smart-like-button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("PromptCard");

  return (
    <Link href={`/prompt/${prompt.id}`} className="group">
      <Card className="overflow-hidden hover-float hover-glow border-border/50 transition-all duration-300">
        <CardContent className="p-0 relative">
          <div className="aspect-square relative overflow-hidden bg-muted">
            <Image
              src={prompt.image_url}
              alt={prompt.artist_string}
              width={500}
              height={500}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          {prompt.model && (
            <Badge
              variant="secondary"
              className="absolute top-2 right-2 glass-effect border-0"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {prompt.model}
            </Badge>
          )}
        </CardContent>
        <CardFooter className="p-4">
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                {prompt.artist_string}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(prompt.created_at).toLocaleDateString()}
              </p>
            </div>
            {typeof prompt.likes_count !== "undefined" && (
              <div className="flex items-center justify-between">
                <SmartLikeButton
                  promptId={prompt.id.toString()}
                  userId={userId}
                  variant="badge"
                />
                {prompt.prompt && (
                  <Badge variant="outline" className="text-xs">
                    {t("hasPrompt")}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
