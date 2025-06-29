"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Heart, Sparkles, ArrowLeft } from "lucide-react";
import { PromptsGrid, PromptsLoadingFallback } from "@/components/prompts-grid";
import Link from "next/link";
import type { Prompt } from "@/lib/prompts";

export default function FavoritesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchFavoritePrompts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Fetch all prompts that the user has liked
        const { data: likes, error: likesError } = await supabase
          .from("likes")
          .select(
            `
            prompt_id,
            prompts (
              id,
              created_at,
              artist_string,
              image_url,
              prompt,
              negative_prompt,
              model,
              user_id
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (likesError) throw likesError;

        if (likes && likes.length > 0) {
          // Extract prompts from the likes data
          const likedPrompts = likes
            .map((like: any) => like.prompts)
            .filter(Boolean) as Prompt[];

          // Get prompt IDs for fetching counts
          const promptIds = likedPrompts.map((p) => p.id);

          // Fetch likes counts for all prompts
          const { data: allLikes } = await supabase
            .from("likes")
            .select("prompt_id")
            .in("prompt_id", promptIds);

          // Count likes per prompt
          const likesCountMap: Record<number, number> = {};
          allLikes?.forEach((like) => {
            likesCountMap[like.prompt_id] =
              (likesCountMap[like.prompt_id] || 0) + 1;
          });

          // Format prompts with likes count
          const formattedPrompts = likedPrompts.map((prompt) => ({
            ...prompt,
            likes_count: likesCountMap[prompt.id] || 0,
          }));

          setPrompts(formattedPrompts);
        } else {
          setPrompts([]);
        }
      } catch (error) {
        console.error("Error fetching favorite prompts:", error);
        toast.error("Failed to load favorite prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePrompts();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Favorite Prompts</h1>
          <p className="text-muted-foreground">Prompts you liked</p>
        </div>
        <PromptsLoadingFallback />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Toaster richColors />
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
            <Heart className="h-8 w-8 text-primary fill-current" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">Favorite Prompts</h1>
          <p className="text-muted-foreground">
            {prompts.length === 0
              ? "You haven't liked any prompts yet"
              : `${prompts.length} prompt${
                  prompts.length === 1 ? "" : "s"
                } you&apos;ve liked`}
          </p>
        </div>

        {/* Back Button */}
        <div className="flex justify-start">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Gallery
            </Link>
          </Button>
        </div>

        {/* Prompts Grid or Empty State */}
        {prompts.length === 0 ? (
          <Card className="glass-effect border-border/50">
            <div className="py-16 text-center">
              <div className="p-6 rounded-full bg-muted inline-block mb-4">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start exploring and like prompts that inspire you. They&apos;ll
                appear here for easy access.
              </p>
              <Button asChild className="hover-glow">
                <Link href="/">Explore Prompts</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <PromptsGrid prompts={prompts} userId={user.id} loading={false} />
        )}

        {/* Stats Summary */}
        {prompts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Total likes given:{" "}
                <span className="font-semibold text-foreground">
                  {prompts.length}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
