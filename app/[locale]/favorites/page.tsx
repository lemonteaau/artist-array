"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Toaster } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PromptsGrid } from "@/components/prompts-grid";
import { useFavorites } from "./hooks/use-favorites";
import { FavoritesHeader } from "./components/favorites-header";
import { FavoritesEmptyState } from "./components/favorites-empty-state";
import { FavoritesStats } from "./components/favorites-stats";
import { useTranslations } from "next-intl";

export default function FavoritesPage() {
  const { user, prompts } = useFavorites();
  const t = useTranslations("Favorites");

  if (!user) {
    return null;
  }

  return (
    <>
      <Toaster richColors />
      <div className="space-y-8">
        <FavoritesHeader prompts={prompts} />

        {/* Back Button */}
        <div className="flex justify-start">
          <Button variant="ghost" asChild className="gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              {t("backToGallery")}
            </Link>
          </Button>
        </div>

        {/* Prompts Grid or Empty State */}
        {prompts.length === 0 ? (
          <FavoritesEmptyState />
        ) : (
          <PromptsGrid prompts={prompts} userId={user.id} loading={false} />
        )}

        <FavoritesStats prompts={prompts} />
      </div>
    </>
  );
}
