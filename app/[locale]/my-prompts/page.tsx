"use client";

import { Toaster } from "sonner";
import { PromptsLoadingFallback } from "@/components/prompts-grid";
import { useTranslations } from "next-intl";
import { useMyPrompts } from "./hooks/use-my-prompts";
import { MyPromptsHeader } from "./components/my-prompts-header";
import { MyPromptsStats } from "./components/my-prompts-stats";
import { MyPromptsEmptyState } from "./components/my-prompts-empty-state";
import { MyPromptsList } from "./components/my-prompts-list";
import { MyPromptsFooter } from "./components/my-prompts-footer";

export default function MyPromptsPage() {
  const t = useTranslations("MyPrompts");
  const {
    // State
    user,
    prompts,
    loading,
    deletingId,

    // Actions
    handleDeletePrompt,
  } = useMyPrompts();

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("manageYourPrompts")}</p>
        </div>
        <PromptsLoadingFallback />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Toaster richColors />
      <div className="space-y-8">
        <MyPromptsHeader />

        <MyPromptsStats prompts={prompts} />

        {prompts.length === 0 ? (
          <MyPromptsEmptyState />
        ) : (
          <MyPromptsList
            prompts={prompts}
            deletingId={deletingId}
            onDeletePrompt={handleDeletePrompt}
          />
        )}

        <MyPromptsFooter hasPrompts={prompts.length > 0} />
      </div>
    </>
  );
}
