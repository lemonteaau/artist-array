import type { Prompt } from "@/lib/prompts";
import { useTranslations } from "next-intl";

interface FavoritesStatsProps {
  prompts: Prompt[];
}

export function FavoritesStats({ prompts }: FavoritesStatsProps) {
  const t = useTranslations("Favorites");
  if (prompts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 pt-8 border-t">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          {t("totalLikesGiven")}:{" "}
          <span className="font-semibold text-foreground">
            {prompts.length}
          </span>
        </p>
      </div>
    </div>
  );
}
