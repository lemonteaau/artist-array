"use client";

import { Link } from "@/i18n/navigation";
import { Toaster } from "sonner";
import { useTranslations } from "next-intl";
import { notFound } from "next/navigation";
import { usePromptDetail } from "./hooks/use-prompt-detail";
import { PromptImage } from "./components/prompt-image";
import { PromptDetails } from "./components/prompt-details";
import { CommentsSection } from "./components/comments-section";
import { PromptPageSkeleton } from "./loading";

export default function PromptDetailPage() {
  const {
    // State
    prompt,
    loading,
    user,
    newComment,
    setNewComment,
    isDeleting,
    deletingComments,
    isOwner,

    // Like functionality
    liked,
    likesCount,
    likesLoading,
    toggleLike,

    // Comment functionality
    submittingComment,
    handleComment,
    handleDeleteComment,

    // Prompt actions
    handleDeletePrompt,
  } = usePromptDetail();

  const t = useTranslations("PromptDetails");

  if (loading) {
    return <PromptPageSkeleton />;
  }

  if (!prompt) {
    notFound();
    return;
  }

  return (
    <>
      <Toaster richColors />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PromptImage
          imageUrl={prompt.image_url}
          artistString={prompt.artist_string}
        />
        <div className="space-y-6">
          <PromptDetails
            prompt={prompt}
            liked={liked}
            likesCount={likesCount}
            likesLoading={likesLoading}
            toggleLike={toggleLike}
            isOwner={isOwner}
            isDeleting={isDeleting}
            onDeletePrompt={handleDeletePrompt}
          />

          <CommentsSection
            comments={prompt.comments}
            user={user}
            newComment={newComment}
            setNewComment={setNewComment}
            submittingComment={submittingComment}
            handleComment={handleComment}
            handleDeleteComment={handleDeleteComment}
            deletingComments={deletingComments}
          />

          <Link
            href="/"
            className="text-sm text-primary hover:underline inline-block"
          >
            &larr; {t("backToGallery")}
          </Link>
        </div>
      </div>
    </>
  );
}
