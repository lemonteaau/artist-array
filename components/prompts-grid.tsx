"use client";

import { PromptCard } from "@/components/prompt-card";
import { type Prompt } from "@/lib/prompts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Upload, Sparkles, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useCallback } from "react";

interface PromptsGridProps {
  prompts: Prompt[];
  userId: string | null;
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function PromptsGrid({
  prompts,
  userId,
  loading = false,
  loadingMore = false,
  hasMore = true,
  onLoadMore,
}: PromptsGridProps) {
  const t = useTranslations("PromptsGrid");

  const handleScroll = useCallback(() => {
    if (!onLoadMore || !hasMore || loadingMore) return;

    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= documentHeight - 1000) {
      onLoadMore();
    }
  }, [onLoadMore, hasMore, loadingMore]);

  useEffect(() => {
    if (!onLoadMore) return;

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, onLoadMore]);

  if (loading) {
    return <PromptsLoadingFallback />;
  }

  if (!prompts || prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="p-6 rounded-full bg-muted mb-6">
          <Sparkles className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">{t("noPromptsYet")}</h2>
        <p className="text-muted-foreground text-center mb-6 max-w-md">
          {t("noPromptsMessage")}
        </p>
        <Button asChild size="lg" className="hover-glow">
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            {t("shareFirst")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {prompts.map((prompt, index) => (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            userId={userId}
            priority={index < 4}
          />
        ))}
      </div>

      {loadingMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t("loadingMore")}</span>
          </div>
        </div>
      )}

      {!loadingMore && hasMore && onLoadMore && (
        <div className="flex justify-center py-8">
          <Button variant="outline" onClick={onLoadMore} className="hover-glow">
            {t("loadMore")}
          </Button>
        </div>
      )}

      {!hasMore && prompts.length > 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          {t("noMorePrompts")}
        </div>
      )}
    </div>
  );
}

export function PromptsLoadingFallback() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden border-border/50">
          <CardContent className="p-0">
            <div className="aspect-square bg-muted animate-pulse" />
          </CardContent>
          <CardFooter className="p-4">
            <div className="w-full space-y-3">
              <div className="space-y-1">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                <div className="h-5 bg-muted rounded w-20 animate-pulse" />
              </div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
