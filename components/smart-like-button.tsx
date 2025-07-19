import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2 } from "lucide-react";
import { useSmartLike } from "@/hooks/use-smart-like";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SmartLikeButtonProps {
  promptId: string;
  userId: string | null;
  variant?: "button" | "badge";
  size?: "sm" | "lg";
  className?: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export function SmartLikeButton({
  promptId,
  userId,
  variant = "badge",
  size = "sm",
  className = "",
  initialLiked,
  initialCount,
}: SmartLikeButtonProps) {
  const router = useRouter();

  const handleAuthRequired = () => {
    toast.error("Please log in to like posts");
    router.push("/login");
  };

  const { liked, count, isLoading, toggleLike } = useSmartLike({
    promptId,
    userId,
    onAuthRequired: handleAuthRequired,
    initialLiked,
    initialCount,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  };

  if (variant === "button") {
    return (
      <Button
        variant={liked ? "default" : "outline"}
        size={size}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 transition-all",
          liked && "bg-red-500 hover:bg-red-600 text-white border-red-500",
          isLoading && "opacity-80",
          className
        )}
        disabled={!userId && !liked}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart
            className={cn(
              "w-4 h-4 transition-all",
              liked && "fill-current animate-in zoom-in-50 duration-200"
            )}
          />
        )}
        <span className="tabular-nums font-medium">{count}</span>
      </Button>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "cursor-pointer transition-all duration-200 select-none",
        "hover:bg-accent hover:border-red-200",
        isLoading && "opacity-80 cursor-wait",
        liked &&
          "border-red-300 bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800",
        className
      )}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1.5">
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Heart
            className={cn(
              "w-3.5 h-3.5 transition-all",
              liked
                ? "text-red-500 fill-current animate-in zoom-in-50 duration-200"
                : "text-muted-foreground"
            )}
          />
        )}
        <span className="tabular-nums font-medium text-xs">{count}</span>
      </div>
    </Badge>
  );
}
