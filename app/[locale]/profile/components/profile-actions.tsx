import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Image as ImageIcon, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileActionsProps {
  onSignOut: () => void;
}

export function ProfileActions({ onSignOut }: ProfileActionsProps) {
  const t = useTranslations("Profile");

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle>{t("quickActions")}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between gap-4">
        <Link href="/my-prompts">
          <Button variant="outline" className="w-full justify-start">
            <ImageIcon className="mr-2 h-4 w-4" />
            {t("viewMyPrompts")}
          </Button>
        </Link>

        <Button
          variant="outline"
          className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t("signOut")}
        </Button>
      </CardContent>
    </Card>
  );
}
