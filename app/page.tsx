import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SortSelector } from "@/components/sort-selector";
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
  model: string | null;
  likes_count?: number;
}

async function getPrompts(sortBy = "newest"): Promise<Prompt[]> {
  // In a real app, you'd fetch from an API.
  // We'll use our own API route.
  // The URL needs to be absolute when fetching on the server.
  const url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api/prompts"
      : `https://${process.env.VERCEL_URL}/api/prompts`;

  const res = await fetch(`${url}?sort=${sortBy}`, { cache: "no-store" });
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const { data } = await res.json();
  return data;
}

interface HomePageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const sortBy = resolvedSearchParams.sort || "newest";
  const prompts = await getPrompts(sortBy);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="text-lg font-medium">Sort by:</span>
          <SortSelector currentSort={sortBy} />
        </div>
      </div>

      {prompts && prompts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {prompts.map((prompt) => (
            <Link href={`/prompt/${prompt.id}`} key={prompt.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Image
                    src={prompt.image_url}
                    alt={prompt.artist_string}
                    width={500}
                    height={500}
                    className="object-cover aspect-square"
                    priority={prompt.id === prompts[0]?.id}
                  />
                </CardContent>
                <CardFooter className="p-4">
                  <div className="w-full">
                    <p className="text-sm truncate font-medium">
                      {prompt.artist_string}
                    </p>
                    {prompt.model && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Model: {prompt.model}
                      </p>
                    )}
                    {typeof prompt.likes_count !== "undefined" && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ❤️ {prompt.likes_count}
                      </p>
                    )}
                  </div>
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
