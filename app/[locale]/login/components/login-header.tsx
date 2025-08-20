import { Link } from "@/i18n/navigation";
import { Palette } from "lucide-react";
import { useTranslations } from "next-intl";

export function LoginHeader() {
  const t = useTranslations("Auth");

  return (
    <div className="text-center">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
        <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
          <Palette className="h-8 w-8 text-primary" />
        </div>
      </Link>
      <h1 className="text-3xl font-bold text-primary mb-2">
        {t("welcomeBack")}
      </h1>
      <p className="text-muted-foreground">{t("signInSubtitle")}</p>
    </div>
  );
}
