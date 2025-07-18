import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export function PromptPageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left side - Image skeleton */}
      <div>
        <Skeleton className="aspect-square w-full rounded-lg" />
      </div>

      {/* Right side - Content skeleton */}
      <div className="space-y-6">
        {/* Details Card skeleton */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-8 w-12" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Artist String */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-16 w-full rounded-md" />
            </div>

            <Separator />

            {/* Model */}
            <div>
              <Skeleton className="h-6 w-16 mb-2" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <Separator />

            {/* Prompt */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-32 w-full rounded-md" />
            </div>

            <Separator />

            {/* Negative Prompt */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Comments Card skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Comment form */}
            <div className="space-y-4 mb-6">
              <Skeleton className="h-20 w-full rounded-md" />
              <div className="flex justify-end">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            {/* Comments list */}
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2 p-3 rounded-md border">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PromptLoading() {
  return <PromptPageSkeleton />;
}
