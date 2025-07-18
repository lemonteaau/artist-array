import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function SignupFooter() {
  const t = useTranslations("Auth");

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            {t("alreadyHaveAccount")}
          </span>
        </div>
      </div>

      <div className="text-center">
        <Link href="/login">
          <Button variant="outline" className="w-full" size="lg">
            {t("signInHere")}
          </Button>
        </Link>
      </div>
    </>
  );
}
