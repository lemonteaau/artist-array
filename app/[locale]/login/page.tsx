"use client";

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
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { LogIn, Mail, Lock, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const t = useTranslations("Auth");
  const tToast = useTranslations("Toast");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success(tToast("welcomeBack"));
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Title */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 group"
            >
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </Link>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {t("welcomeBack")}
            </h1>
            <p className="text-muted-foreground">{t("signInSubtitle")}</p>
          </div>

          <Card className="glass-effect border-border/50">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl text-center">
                {t("signIn")}
              </CardTitle>
              <CardDescription className="text-center">
                {t("signInDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-8" onSubmit={handleSubmit}>
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
                    onChange={(e) => setEmail(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
