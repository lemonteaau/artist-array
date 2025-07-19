import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function NavbarAuthButtons() {
  const t = useTranslations("Navbar");

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          {t("login")}
        </Link>
      </Button>
      <Button size="sm" asChild className="hover-glow">
        <Link href="/signup">
          <UserPlus className="mr-2 h-4 w-4" />
          {t("signUp")}
        </Link>
      </Button>
    </div>
  );
}
