"use client";

import { SortSelector } from "@/components/sort-selector";
import { PromptsGrid, PromptsLoadingFallback } from "@/components/prompts-grid";
import { createClient } from "@/utils/supabase/client";
import { getPrompts, type Prompt } from "@/lib/prompts";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";
import { BsFire } from "react-icons/bs";
import { useTranslations } from "next-intl";

function HomePageContent() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "popular";

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setPrompts([]);
      setHasMore(true);

      const [
        promptsData,
        {
          data: { user },
        },
      ] = await Promise.all([
        getPrompts(sortBy, 100, 0),
        supabase.auth.getUser(),
      ]);

      setPrompts(promptsData);
      setUser(user);
      setLoading(false);

      setHasMore(promptsData.length === 100);
    };

    fetchInitialData();
  }, [sortBy, supabase]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const morePrompts = await getPrompts(sortBy, 100, prompts.length);

      if (morePrompts.length === 0) {
        setHasMore(false);
      } else {
        setPrompts((prev) => [...prev, ...morePrompts]);
        setHasMore(morePrompts.length === 100);
      }
    } catch (error) {
      console.error("Error loading more prompts:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <PromptsGrid
      prompts={prompts}
      userId={user?.id || null}
      loading={loading}
      loadingMore={loadingMore}
      hasMore={hasMore}
      onLoadMore={loadMore}
    />
  );
}

export default function HomePage() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "popular";
  const t = useTranslations("HomePage");

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center hidden md:block space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-[#f97316]">
          {t("title")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {t("subtitle")}
        </p>
      </section>

      {/* Mobile Hero Section */}
      <section className="text-center block md:hidden space-y-1">
        <h1 className="text-2xl font-bold text-[#f97316]">Artist Array</h1>
        <p className="text-md text-muted-foreground">{t("subtitle")}</p>
      </section>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg glass-effect">
        <div className="flex justify-between w-full gap-4">
          <div className="flex items-center gap-2 text-sm">
            {sortBy === "popular" ? (
              <>
                <BsFire className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{t("trending")}</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{t("latest")}</span>
              </>
            )}
          </div>
          <SortSelector currentSort={sortBy} />
        </div>
      </div>

      {/* Prompts Grid */}
      <Suspense fallback={<PromptsLoadingFallback />}>
        <HomePageContent />
      </Suspense>
    </div>
  );
}
