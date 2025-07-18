import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function FavoritesEmptyState() {
  const t = useTranslations("Favorites");

  return (
    <Card className="glass-effect border-border/50">
      <div className="py-16 text-center">
        <div className="p-6 rounded-full bg-muted inline-block mb-4">
          <Sparkles className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">{t("noFavoritesYet")}</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {t("noFavoritesMessage")}
        </p>
        <Button asChild className="hover-glow">
          <Link href="/">{t("explorePrompts")}</Link>
        </Button>
      </div>
    </Card>
  );
}
