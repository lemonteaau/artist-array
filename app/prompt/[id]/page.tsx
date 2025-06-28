import { CopyButton } from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Toaster } from "sonner";

interface Comment {
  id: number;
  created_at: string;
  content: string;
  user_id: string;
}

interface Prompt {
  id: number;
  created_at: string;
  artist_string: string;
  image_url: string;
  prompt: string | null;
  negative_prompt: string | null;
  user_id: string | null;
  likes_count: number;
  comments: Comment[];
}

async function getPrompt(id: string): Promise<Prompt> {
  const url =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/api/prompts/${id}`
      : `https://${process.env.VERCEL_URL}/api/prompts/${id}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const { data } = await res.json();
  return data;
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

export default async function PromptDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const prompt = await getPrompt(id);

  if (!prompt) {
    return <div>Prompt not found</div>;
  }

  return (
    <>
      <Toaster richColors />
      <div className="container mx-auto px-4 py-8">
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
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Heart className="w-4 h-4" />
                      {prompt.likes_count}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {prompt.comments.length}
                    </Badge>
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
            {prompt.comments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comments ({prompt.comments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prompt.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-muted p-3 rounded-md space-y-2"
                      >
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>User: {comment.user_id.slice(0, 8)}...</span>
                          <span>{formatDate(comment.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Link href="/" className="text-sm text-blue-500 hover:underline">
              &larr; Back to gallery
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
