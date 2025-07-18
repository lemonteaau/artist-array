import { cn } from "@/lib/utils";

interface PageLoadingProps {
  className?: string;
  message?: string;
}

export function PageLoading({ className, message }: PageLoadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center min-h-[60vh]",
        className
      )}
    >
      <div className="loading-dots mb-4">
        <span></span>
        <span></span>
        <span></span>
      </div>
      {message && <p className="text-muted-foreground text-sm">{message}</p>}
    </div>
  );
}
