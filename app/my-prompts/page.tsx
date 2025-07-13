"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import Image from "next/image";
import Link from "next/link";
import {
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Upload,
  Sparkles,
  Calendar,
} from "lucide-react";
import { PromptsLoadingFallback } from "@/components/prompts-grid";

interface Prompt {
  id: number;
  created_at: string;
  artist_string: string;
  image_url: string;
  prompt: string | null;
  negative_prompt: string | null;
  model: string | null;
  user_id: string | null;
  likes_count: number;
  comments_count: number;
}

export default function MyPromptsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchUserPrompts = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);

        // Fetch user's prompts with counts
        const { data: promptsData, error: promptsError } = await supabase
          .from("prompts")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (promptsError) throw promptsError;

        // Fetch likes and comments counts for each prompt
        if (promptsData && promptsData.length > 0) {
          const promptIds = promptsData.map((p) => p.id);

          const [likesResult, commentsResult] = await Promise.all([
            supabase
              .from("likes")
              .select("prompt_id")
              .in("prompt_id", promptIds),
            supabase
              .from("comments")
              .select("prompt_id")
              .in("prompt_id", promptIds),
          ]);

          // Count likes and comments per prompt
          const likesCount: Record<number, number> = {};
          const commentsCount: Record<number, number> = {};

          likesResult.data?.forEach((like) => {
            likesCount[like.prompt_id] = (likesCount[like.prompt_id] || 0) + 1;
          });

          commentsResult.data?.forEach((comment) => {
            commentsCount[comment.prompt_id] =
              (commentsCount[comment.prompt_id] || 0) + 1;
          });

          // Add counts to prompts
          const promptsWithCounts = promptsData.map((prompt) => ({
            ...prompt,
            likes_count: likesCount[prompt.id] || 0,
            comments_count: commentsCount[prompt.id] || 0,
          }));

          setPrompts(promptsWithCounts);
        } else {
          setPrompts([]);
        }
      } catch (error) {
        console.error("Error fetching prompts:", error);
        toast.error("Failed to load your prompts");
      } finally {
        setLoading(false);
      }
    };

    fetchUserPrompts();
  }, [router, supabase]);

  const handleDeletePrompt = async (promptId: number) => {
    setDeletingId(promptId);

    try {
      const response = await fetch(`/api/prompts/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompts(prompts.filter((p) => p.id !== promptId));
        toast.success("Prompt deleted successfully!");
      } else {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete prompt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">My Prompts</h1>
          <p className="text-muted-foreground">
            Manage your shared AI art prompts
          </p>
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
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">My Prompts</h1>
          <p className="text-muted-foreground">
            Manage and track your shared AI art prompts
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">{prompts.length}</p>
              <p className="text-sm text-muted-foreground">Total Prompts</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">
                {prompts.reduce((acc, p) => acc + p.likes_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </CardContent>
          </Card>
          <Card className="glass-effect border-border/50">
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold">
                {prompts.reduce((acc, p) => acc + p.comments_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Comments</p>
            </CardContent>
          </Card>
        </div>

        {/* Prompts List */}
        {prompts.length === 0 ? (
          <Card className="glass-effect border-border/50">
            <CardContent className="py-16 text-center">
              <div className="p-6 rounded-full bg-muted inline-block mb-4">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">No prompts yet</h2>
              <p className="text-muted-foreground mb-6">
                Start sharing your AI art creations with the community
              </p>
              <Button asChild className="hover-glow">
                <Link href="/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Share Your First Prompt
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="glass-effect border-border/50 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto relative">
                    <Image
                      src={prompt.image_url}
                      alt={prompt.artist_string}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg line-clamp-1">
                            {prompt.artist_string}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(prompt.created_at).toLocaleDateString()}
                            </span>
                            {prompt.model && (
                              <Badge variant="secondary" className="text-xs">
                                {prompt.model}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                            className="h-8 w-8"
                          >
                            <Link href={`/prompt/${prompt.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={deletingId === prompt.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Prompt
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this prompt?
                                  This action cannot be undone. All likes and
                                  comments will also be deleted.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePrompt(prompt.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter className="pt-0">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="font-medium">
                            {prompt.likes_count}
                          </span>
                          <span className="text-muted-foreground">likes</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {prompt.comments_count}
                          </span>
                          <span className="text-muted-foreground">
                            comments
                          </span>
                        </span>
                        {prompt.prompt && (
                          <Badge variant="outline" className="text-xs">
                            Has prompt
                          </Badge>
                        )}
                      </div>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add New Prompt Button */}
        {prompts.length > 0 && (
          <div className="text-center">
            <Button asChild size="lg" className="hover-glow">
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" />
                Share Another Prompt
              </Link>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
