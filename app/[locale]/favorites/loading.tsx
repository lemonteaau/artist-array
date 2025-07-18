import { PromptsLoadingFallback } from "@/components/prompts-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesLoading() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>

      {/* Back Button skeleton */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Prompts Grid skeleton */}
      <PromptsLoadingFallback />

      {/* Stats skeleton */}
      <div className="text-center space-y-2">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>
    </div>
  );
}
