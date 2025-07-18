import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { LogIn, Mail, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { LoginFooter } from "./login-footer";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function LoginForm({
  email,
  password,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  const t = useTranslations("Auth");

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center">{t("signIn")}</CardTitle>
        <CardDescription className="text-center">
          {t("signInDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-8" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {t("email")}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              disabled={isLoading}
              className="glass-effect"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              {t("password")}
            </Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isLoading}
              className="glass-effect"
            />
          </div>
          <div className="flex items-center justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full hover-glow"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <LogIn className="mr-2 h-4 w-4 animate-pulse" />
                {t("signingIn")}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {t("signIn")}
              </>
            )}
          </Button>
        </form>

        <LoginFooter />
      </CardContent>
    </Card>
  );
}
