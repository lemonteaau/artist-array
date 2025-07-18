import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export function UploadAuthGuard() {
  const t = useTranslations("Upload");

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto p-3 rounded-full bg-muted mb-2">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle>{t("authRequired")}</CardTitle>
          <CardDescription>{t("authRequiredMessage")}</CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button asChild>
            <Link href="/login">{t("goToLogin")}</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
