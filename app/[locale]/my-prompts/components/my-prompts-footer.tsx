import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";

interface MyPromptsFooterProps {
  hasPrompts: boolean;
}

export function MyPromptsFooter({ hasPrompts }: MyPromptsFooterProps) {
  const t = useTranslations("MyPrompts");

  if (!hasPrompts) {
    return null;
  }

  return (
    <div className="text-center">
      <Button asChild size="lg" className="hover-glow">
        <Link href="/upload">
          <Upload className="mr-2 h-4 w-4" />
          {t("shareAnotherPrompt")}
        </Link>
      </Button>
    </div>
  );
}
