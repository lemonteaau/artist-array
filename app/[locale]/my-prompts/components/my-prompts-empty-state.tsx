import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

export function MyPromptsEmptyState() {
  const t = useTranslations("MyPrompts");

  return (
    <Card className="glass-effect border-border/50">
      <CardContent className="py-16 text-center">
        <div className="p-6 rounded-full bg-muted inline-block mb-4">
          <Upload className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">{t("noPromptsYet")}</h2>
        <p className="text-muted-foreground mb-6">{t("noPromptsMessage")}</p>
        <Button asChild className="hover-glow">
          <Link href="/upload">
            <Upload className="mr-2 h-4 w-4" />
            {t("shareFirst")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
