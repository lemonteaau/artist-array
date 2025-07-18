import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function LoginFooter() {
  const t = useTranslations("Auth");

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("newToArtistArray")}
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link href="/signup">
          <Button variant="outline" className="w-full" size="lg">
            {t("createAccount")}
          </Button>
        </Link>
      </div>
    </>
  );
}
