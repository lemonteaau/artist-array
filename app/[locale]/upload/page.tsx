"use client";

import { Toaster } from "sonner";
import { PageLoading } from "@/components/ui/page-loading";
import { useUpload } from "./hooks/use-upload";
import { UploadAuthGuard } from "./components/upload-auth-guard";
import { UploadForm } from "./components/upload-form";

export default function UploadPage() {
  const {
    // State
    artistString,
    setArtistString,
    prompt,
    setPrompt,
    negativePrompt,
    setNegativePrompt,
    model,
    setModel,
    availableModels,
    imagePreview,
    isLoading,
    modelsLoading,
    user,
    userLoading,

    // Handlers
    handleImageChange,
    handleSubmit,
  } = useUpload();

  if (userLoading) {
    return (
      <>
        <Toaster richColors />
        <PageLoading message="Loading..." />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Toaster richColors />
        <UploadAuthGuard />
      </>
    );
  }

  return (
    <>
      <Toaster richColors />
      <UploadForm
        artistString={artistString}
        setArtistString={setArtistString}
        prompt={prompt}
        setPrompt={setPrompt}
        negativePrompt={negativePrompt}
        setNegativePrompt={setNegativePrompt}
        model={model}
        setModel={setModel}
        availableModels={availableModels}
        imagePreview={imagePreview}
        isLoading={isLoading}
        modelsLoading={modelsLoading}
        handleImageChange={handleImageChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}
