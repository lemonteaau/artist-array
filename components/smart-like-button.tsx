import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2 } from "lucide-react";
import { useSmartLike } from "@/hooks/use-smart-like";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SmartLikeButtonProps {
  promptId: string;
  userId: string | null;
  variant?: "button" | "badge";
  size?: "sm" | "lg";
  className?: string;
}

export function SmartLikeButton({
  promptId,
  userId,
  variant = "badge",
  size = "sm",
  className = "",
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
  });

  if (variant === "button") {
    return (
      <Button
        variant={liked ? "default" : "outline"}
        size={size}
        onClick={toggleLike}
        className={`flex items-center gap-1 ${className} ${
          isLoading ? "opacity-80" : ""
        }`}
        disabled={!userId && !liked}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
        )}
        <span className="tabular-nums">{count}</span>
      </Button>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`cursor-pointer hover:bg-accent transition-all duration-200 ${className} ${
        isLoading ? "opacity-80" : ""
      } ${liked ? "border-red-200 bg-red-50" : ""}`}
      onClick={toggleLike}
    >
      <div className="flex items-center gap-1">
        {isLoading ? (
          <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
        ) : (
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? "text-red-500 fill-current" : "text-red-500"
            }`}
          />
        )}
        <span className="tabular-nums font-medium">{count}</span>
      </div>
    </Badge>
  );
}
