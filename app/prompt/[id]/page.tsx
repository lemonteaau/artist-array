"use client";

import { CopyButton } from "@/components/copy-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface Comment {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
  users?: {
    email: string;
  };
}

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
  comments: Comment[];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function PromptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, [supabase]);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        // Fetch prompt data directly from Supabase
        const { data: promptData, error: promptError } = await supabase
          .from("prompts")
          .select("*")
          .eq("id", id)
          .single();

        if (promptError) {
          throw promptError;
        }

        // Get likes count
        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact" })
          .eq("prompt_id", id);

        // Get comments
        const { data: comments, error: commentsError } = await supabase
          .from("comments")
          .select("id, created_at, content, user_id")
          .eq("prompt_id", id)
          .order("created_at", { ascending: true });

        if (commentsError) {
          throw commentsError;
        }

        const transformedData = {
          ...promptData,
          likes_count: likesCount || 0,
          comments: comments || [],
        };

        setPrompt(transformedData);
        setLikesCount(transformedData.likes_count);
        setLoading(false);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load prompt");
        setLoading(false);
      }
    };

    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/likes?prompt_id=${id}`);
        if (response.ok) {
          const { liked, count } = await response.json();
          setLiked(liked);
          setLikesCount(count);
        }
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };

    fetchPrompt();
    fetchLikeStatus();
  }, [id, supabase]);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please log in to like posts");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt_id: parseInt(id) }),
      });

      if (response.ok) {
        const { liked: newLikedStatus } = await response.json();
        setLiked(newLikedStatus);
        setLikesCount((prev) => (newLikedStatus ? prev + 1 : prev - 1));
        toast.success(newLikedStatus ? "Liked!" : "Unliked!");
      } else {
        throw new Error("Failed to update like");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update like");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to comment");
      router.push("/login");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setSubmittingComment(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt_id: parseInt(id),
          content: newComment.trim(),
        }),
      });

      if (response.ok) {
        const { data } = await response.json();
        setPrompt((prev) =>
          prev
            ? {
                ...prev,
                comments: [...prev.comments, data],
              }
            : null
        );
        setNewComment("");
        toast.success("Comment added!");
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompt((prev) =>
          prev
            ? {
                ...prev,
                comments: prev.comments.filter((c) => c.id !== commentId),
              }
            : null
        );
        toast.success("Comment deleted!");
      } else {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete comment");
    }
  };

  const handleDeletePrompt = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Prompt deleted successfully!");
        router.push("/");
      } else {
        const { error } = await response.json();
        throw new Error(error || "Failed to delete prompt");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete prompt");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Prompt not found</div>
      </div>
    );
  }

  const isOwner = user && prompt.user_id === user.id;

  return (
    <>
      <Toaster richColors />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Image
            src={prompt.image_url}
            alt={prompt.artist_string}
            width={1024}
            height={1024}
            className="rounded-lg object-contain"
          />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Details</span>
                <div className="flex gap-2">
                  <Button
                    variant={liked ? "default" : "outline"}
                    size="sm"
                    onClick={handleLike}
                    className="flex items-center gap-1"
                  >
                    <Heart
                      className={`w-4 h-4 ${liked ? "fill-current" : ""}`}
                    />
                    {likesCount}
                  </Button>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {prompt.comments.length}
                  </Badge>
                  {isOwner && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Prompt</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this prompt? This
                            action cannot be undone. All likes and comments will
                            also be deleted.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeletePrompt}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
                  <span>Artist String</span>
                  <CopyButton textToCopy={prompt.artist_string} />
                </h3>
                <p className="text-muted-foreground bg-muted p-3 rounded-md">
                  {prompt.artist_string}
                </p>
              </div>

              {prompt.model && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Model</h3>
                    <Badge variant="outline">{prompt.model}</Badge>
                  </div>
                </>
              )}

              {prompt.prompt && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
                      <span>Prompt</span>
                      <CopyButton textToCopy={prompt.prompt} />
                    </h3>
                    <p className="text-muted-foreground bg-muted p-3 rounded-md max-h-48 overflow-y-auto">
                      {prompt.prompt}
                    </p>
                  </div>
                </>
              )}

              {prompt.negative_prompt && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
                      <span>Negative Prompt</span>
                      <CopyButton textToCopy={prompt.negative_prompt} />
                    </h3>
                    <p className="text-muted-foreground bg-muted p-3 rounded-md max-h-48 overflow-y-auto">
                      {prompt.negative_prompt}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({prompt.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Comment Form */}
              {user ? (
                <form onSubmit={handleComment} className="space-y-4 mb-6">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={submittingComment}
                  />
                  <Button
                    type="submit"
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? "Adding..." : "Add Comment"}
                  </Button>
                </form>
              ) : (
                <div className="mb-6 p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">
                    <Link
                      href="/login"
                      className="text-blue-500 hover:underline"
                    >
                      Log in
                    </Link>{" "}
                    to add a comment
                  </p>
                </div>
              )}

              {/* Comments List */}
              {prompt.comments.length > 0 ? (
                <div className="space-y-4">
                  {prompt.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-muted p-3 rounded-md space-y-2"
                    >
                      <p className="text-sm">{comment.content}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          {comment.users?.email
                            ? comment.users.email.split("@")[0]
                            : `User ${comment.user_id.slice(0, 8)}...`}
                        </span>
                        <div className="flex items-center gap-2">
                          <span>{formatDate(comment.created_at)}</span>
                          {user && comment.user_id === user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="h-auto p-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </CardContent>
          </Card>

          <Link
            href="/"
            className="text-sm text-blue-500 hover:underline inline-block"
          >
            &larr; Back to gallery
          </Link>
        </div>
      </div>
    </>
  );
}
