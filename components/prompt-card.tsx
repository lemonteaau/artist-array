"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SmartLikeButton } from "@/components/smart-like-button";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDateFormat } from "@/lib/date-utils";

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
    user_liked?: boolean;
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
  const { formatDateSimple } = useDateFormat();

  return (
    <Link href={`/prompt/${prompt.id}`} className="group">
      <Card
        className="
        overflow-hidden 
        border-border/50 
        p-0 
        gap-1
        transition-all 
        duration-500 
        ease-out
        hover:-translate-y-1 
        hover:scale-[1.02]
        hover:shadow-lg 
        hover:shadow-primary/25
        dark:hover:-translate-y-2 
        dark:hover:shadow-2xl 
        dark:hover:shadow-white/5
        dark:hover:bg-white/[0.02]
        dark:hover:border-white/10
      "
      >
        <CardContent className="p-0 relative">
          <div className="aspect-square relative overflow-hidden bg-muted">
            <Image
              src={prompt.image_url}
              alt={prompt.artist_string}
              width={500}
              height={500}
              className="
                object-cover 
                w-full 
                h-full 
                group-hover:scale-105 
                transition-transform 
                duration-300
              "
              priority={priority}
            />

            {/* Light mode gradient overlay */}
            <div
              className="
              absolute 
              inset-0 
              bg-gradient-to-t 
              from-black/30 
              via-transparent 
              to-transparent 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity 
              duration-300 
              dark:hidden
            "
            />

            {/* Dark mode gradient overlay */}
            <div
              className="
              absolute 
              inset-0 
              bg-gradient-to-t 
              from-black/40 
              via-black/10 
              to-transparent 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity 
              duration-300 
              hidden 
              dark:block
            "
            />

            {/* Dark mode edge glow effect */}
            <div
              className="
              absolute 
              inset-0 
              opacity-0 
              group-hover:opacity-100 
              transition-opacity 
              duration-300 
              hidden 
              dark:block
            "
            ></div>
          </div>
          {prompt.model && (
            <Badge
              variant="secondary"
              className="
                absolute 
                top-2 
                right-2 
                glass-effect 
                border-0
                dark:bg-black/40 
                dark:text-white/90 
                dark:border 
                dark:border-white/10
                transition-all
                duration-300
                group-hover:scale-105
                dark:group-hover:bg-black/60
                dark:group-hover:border-white/20
              "
            >
              <Sparkles className="w-3 h-3 mr-1" />
              {prompt.model}
            </Badge>
          )}
        </CardContent>
        <CardFooter className="p-4 dark:bg-card dark:group-hover:bg-card">
          <div className="w-full space-y-3">
            <div className="space-y-1">
              <p
                className="
                text-sm 
                font-medium 
                truncate 
                group-hover:text-primary 
                transition-colors
                duration-300
              "
              >
                {prompt.artist_string}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateSimple(prompt.created_at)}
              </p>
            </div>
            {typeof prompt.likes_count !== "undefined" && (
              <div className="flex items-center justify-between">
                <SmartLikeButton
                  promptId={prompt.id.toString()}
                  userId={userId}
                  variant="badge"
                  initialLiked={prompt.user_liked}
                  initialCount={prompt.likes_count}
                />
                {prompt.prompt && (
                  <Badge
                    variant="outline"
                    className="
                      text-xs 
                      transition-all
                      duration-300
                      dark:border-white/20 
                      dark:text-white/80
                      group-hover:scale-105
                      dark:group-hover:border-white/40
                      dark:group-hover:text-white/90
                    "
                  >
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
