import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Prompt } from "@/lib/prompts";

interface FavoritesHeaderProps {
  prompts: Prompt[];
}

export function FavoritesHeader({ prompts }: FavoritesHeaderProps) {
  const t = useTranslations("Favorites");

  const getSubtitle = () => {
    if (prompts.length === 0) {
      return t("noPromptsLikedYet");
    }

    return t("promptsLiked", { count: prompts.length });
  };

  return (
    <div className="text-center space-y-4">
      <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
        <Heart className="h-8 w-8 text-primary fill-current" />
      </div>
      <h1 className="text-3xl font-bold text-primary">{t("title")}</h1>
      <p className="text-muted-foreground">{getSubtitle()}</p>
    </div>
  );
}
