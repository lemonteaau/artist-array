"use client";

import { SortSelector } from "@/components/sort-selector";
import { PromptsGrid, PromptsLoadingFallback } from "@/components/prompts-grid";
import { createClient } from "@/utils/supabase/client";
import { getPrompts, type Prompt } from "@/lib/prompts";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Sparkles, TrendingUp, Clock } from "lucide-react";

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

  return (
    <PromptsGrid
      prompts={prompts}
      userId={user?.id || null}
      loading={loading}
    />
  );
}

function HomePageWrapper() {
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sort") || "newest";

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center hidden md:block py-6 space-y-4">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-2xl bg-primary/10 animate-pulse-scale">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold gradient-text">
          Discover AI Art Inspiration
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share and explore artist strings, prompts, and techniques from the AI
          art community
        </p>
      </section>

      {/* Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg glass-effect">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            {sortBy === "popular" ? (
              <>
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium">Trending</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">Latest</span>
              </>
            )}
          </div>
          <SortSelector currentSort={sortBy} />
        </div>
        <p className="text-sm text-muted-foreground">
          {sortBy === "popular" ? "Most liked prompts" : "Recently shared"}
        </p>
      </div>

      {/* Prompts Grid */}
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
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      }
    >
      <HomePageWrapper />
    </Suspense>
  );
}
