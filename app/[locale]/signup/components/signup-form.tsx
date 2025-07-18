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
import { UserPlus, Mail, Lock, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { SignupFooter } from "./signup-footer";

interface SignupFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onDisplayNameChange: (displayName: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function SignupForm({
  email,
  password,
  confirmPassword,
  displayName,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onDisplayNameChange,
  onSubmit,
}: SignupFormProps) {
  const t = useTranslations("Auth");

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center">{t("signUp")}</CardTitle>
        <CardDescription className="text-center">
          {t("signInDescription")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
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
            <Label htmlFor="displayName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              {t("displayName")}
            </Label>
            <Input
              id="displayName"
              type="text"
              placeholder={t("displayNamePlaceholder")}
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
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
              placeholder={t("passwordPlaceholder")}
              required
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isLoading}
              className="glass-effect"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4 text-muted-foreground" />
              {t("confirmPassword")}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              required
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              disabled={isLoading}
              className="glass-effect"
            />
          </div>
          <Button
            type="submit"
            className="w-full hover-glow"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <UserPlus className="mr-2 h-4 w-4 animate-pulse" />
                {t("signingUp")}
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {t("signUp")}
              </>
            )}
          </Button>
        </form>

        <SignupFooter />
      </CardContent>
    </Card>
  );
}
