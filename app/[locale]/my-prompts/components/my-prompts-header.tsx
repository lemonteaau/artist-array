import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

export function MyPromptsHeader() {
  const t = useTranslations("MyPrompts");

  return (
    <div className="text-center space-y-4">
      <div className="inline-flex p-3 rounded-full bg-primary/10 mb-2">
        <Sparkles className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold gradient-text">{t("title")}</h1>
      <p className="text-muted-foreground">{t("manageYourPrompts")}</p>
    </div>
  );
}
