"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full text-center glass-effect border-border/50">
        <CardHeader>
          <div className="mx-auto p-3 rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-6xl font-bold">{t("title")}</CardTitle>
          <CardDescription className="text-xl">{t("message")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">{t("description")}</p>
          <Button asChild className="hover-glow">
            <Link href="/">{t("returnHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
