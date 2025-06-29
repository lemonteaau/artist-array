"use client";

import { SortSelector } from "@/components/sort-selector";
import { PromptsGrid, PromptsLoadingFallback } from "@/components/prompts-grid";
import { createClient } from "@/utils/supabase/client";
import { getPrompts, type Prompt } from "@/lib/prompts";
import { User } from "@supabase/supabase-js";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

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
