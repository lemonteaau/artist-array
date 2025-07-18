import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PromptsLoadingFallback } from "@/components/prompts-grid";

export default function MyPromptsLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-14 w-14 rounded-full" />
        </div>
        <Skeleton className="h-9 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="glass-effect border-border/50">
            <CardContent className="p-6 text-center space-y-2">
              <Skeleton className="h-9 w-12 mx-auto" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Prompts grid skeleton */}
      <PromptsLoadingFallback />

      {/* Footer skeleton */}
      <div className="text-center">
        <Skeleton className="h-10 w-40 mx-auto" />
      </div>
    </div>
  );
}
