import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface Prompt {
  id: number;
  created_at: string;
  artist_string: string;
  image_url: string;
  prompt: string | null;
  negative_prompt: string | null;
  user_id: string | null;
}

async function getPrompts(): Promise<Prompt[]> {
  // In a real app, you'd fetch from an API.
  // We'll use our own API route.
  // The URL needs to be absolute when fetching on the server.
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/prompts"
      : `https://${process.env.VERCEL_URL}/api/prompts`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const { data } = await res.json();
  return data;
}

export default async function HomePage() {
  const prompts = await getPrompts();

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Artist Array</h1>
        <Button asChild>
          <Link href="/upload">Share a Prompt</Link>
        </Button>
      </header>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prompts.map((prompt) => (
            <Link href={`/prompt/${prompt.id}`} key={prompt.id}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Image
                    src={prompt.image_url}
                    alt={prompt.artist_string}
                    width={500}
                    height={500}
                    className="object-cover aspect-square"
                  />
                </CardContent>
                <CardFooter className="p-4">
                  <p className="text-sm truncate">{prompt.artist_string}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-semibold">No prompts yet!</h2>
          <p className="text-muted-foreground">Be the first to share one.</p>
        </div>
      )}
    </div>
  );
}
