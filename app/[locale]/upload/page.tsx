"use client";

import { Toaster } from "sonner";
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
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
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
