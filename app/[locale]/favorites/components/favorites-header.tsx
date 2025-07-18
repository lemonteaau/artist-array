import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Prompt } from "@/lib/prompts";

interface FavoritesHeaderProps {
  prompts: Prompt[];
  loading: boolean;
}

export function FavoritesHeader({ prompts, loading }: FavoritesHeaderProps) {
  const t = useTranslations("Favorites");

  const getSubtitle = () => {
    if (loading) {
      return t("subtitle");
    }

    if (prompts.length === 0) {
      return t("noPromptsLikedYet");
    }

    // 先测试基本的翻译功能
    const baseText =
      prompts.length === 1
        ? t("promptsLikedSingular")
        : t("promptsLikedPlural");

    // 如果翻译有效，再进行字符串替换
    if (baseText && !baseText.includes("promptsLiked")) {
      return baseText.replace("{count}", prompts.length.toString());
    }

    // 如果翻译失败，回退到简单的英文显示
    return `${prompts.length} prompt${
      prompts.length === 1 ? "" : "s"
    } you've liked`;
  };

  return (
    <div className="text-center space-y-4">
      <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
        <Heart className="h-8 w-8 text-primary fill-current" />
      </div>
      <h1 className="text-3xl font-bold gradient-text">{t("title")}</h1>
      <p className="text-muted-foreground">{getSubtitle()}</p>
    </div>
  );
}
