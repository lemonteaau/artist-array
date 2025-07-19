import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface NavbarShareButtonProps {
  loading?: boolean;
}

export function NavbarShareButton({ loading }: NavbarShareButtonProps) {
  const t = useTranslations("Navbar");

  return (
    <Button asChild className="hover-glow" size={loading ? "default" : "sm"}>
      <Link href="/upload">
        <Upload className="mr-2 h-4 w-4" />
        {t("sharePrompt")}
      </Link>
    </Button>
  );
}
