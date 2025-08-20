import { useTranslations } from "next-intl";

export function MyPromptsHeader() {
  const t = useTranslations("MyPrompts");

  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold text-primary">{t("title")}</h1>
      <p className="text-muted-foreground">{t("manageYourPrompts")}</p>
    </div>
  );
}
