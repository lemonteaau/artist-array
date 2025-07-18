"use client";

import { Toaster } from "sonner";
import { useMyPrompts } from "./hooks/use-my-prompts";
import { MyPromptsHeader } from "./components/my-prompts-header";
import { MyPromptsStats } from "./components/my-prompts-stats";
import { MyPromptsEmptyState } from "./components/my-prompts-empty-state";
import { MyPromptsList } from "./components/my-prompts-list";
import { MyPromptsFooter } from "./components/my-prompts-footer";

export default function MyPromptsPage() {
  const {
    // State
    user,
    prompts,
    deletingId,

    // Actions
    handleDeletePrompt,
  } = useMyPrompts();

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
