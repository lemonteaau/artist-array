import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      {/* Hero Section skeleton - hidden on mobile like actual component */}
      <section className="text-center hidden md:block py-6 space-y-4">
        <div className="flex justify-center mb-4">
          <Skeleton className="h-20 w-20 rounded-2xl" />
        </div>
        <Skeleton className="h-12 w-96 mx-auto" />
        <Skeleton className="h-6 w-80 mx-auto" />
      </section>

      {/* Sort Controls skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 rounded-lg glass-effect">
        <div className="flex justify-between w-full gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Prompts Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border-border/50">
            <CardContent className="p-0">
              <Skeleton className="aspect-square w-full" />
            </CardContent>
            <CardFooter className="p-4">
              <div className="w-full space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
