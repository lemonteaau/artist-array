"use client";

import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useUpload() {
  const [artistString, setArtistString] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();
  const tToast = useTranslations("Toast");

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (!user) {
          router.push("/login");
          return;
        }
      } catch (error) {
        console.error("Error getting user:", error);
        router.push("/login");
      } finally {
        setUserLoading(false);
      }
    };

    getUser();
  }, [router, supabase]);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models");
        if (response.ok) {
          const { data } = await response.json();
          setAvailableModels(data);
        } else {
          console.error("Failed to fetch models");
          setAvailableModels([
            "NAI Diffusion V4 Curated",
            "NAI Diffusion V4 Full",
            "NAI Diffusion V4.5 Curated",
            "NAI Diffusion V4.5 Full",
            "Other",
          ]);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        setAvailableModels(["Other"]);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (10MB limit)
      const maxSizeInBytes = 10 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error(tToast("fileSizeTooLarge"));
        e.target.value = "";
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error(tToast("invalidImageFile"));
        e.target.value = "";
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setArtistString("");
    setPrompt("");
    setNegativePrompt("");
    setModel("");
    setImageFile(null);
    setImagePreview(null);

    // Reset file input
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!artistString || !imageFile || !model) {
      toast.error(tToast("fillRequiredFields"));
      return;
    }

    if (!user) {
      toast.error(tToast("mustBeLoggedIn"));
      router.push("/login");
      return;
    }

    setIsLoading(true);
    toast.loading("Uploading your artwork...");

    try {
      // 1. Get presigned URL
      const presignedResponse = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: imageFile.name,
          contentType: imageFile.type,
          fileSize: imageFile.size,
        }),
      });

      if (!presignedResponse.ok) {
        const errorData = await presignedResponse.json();
        throw new Error(errorData.error || tToast("failedToGetUploadUrl"));
      }

      const { url: presignedUrl, publicUrl } = await presignedResponse.json();

      // 2. Upload image to R2
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: imageFile,
        headers: {
          "Content-Type": imageFile.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
      }

      // 3. Submit prompt to database
      const submitResponse = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          artist_string: artistString,
          image_url: publicUrl,
          prompt,
          negative_prompt: negativePrompt,
          model,
        }),
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json();
        throw new Error(errorData.error || "Failed to save prompt");
      }

      toast.dismiss();
      toast.success(tToast("artworkSharedSuccess"));

      // Reset form
      resetForm();

      // Redirect to home
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    imageFile,
    imagePreview,
    isLoading,
    modelsLoading,
    user,
    userLoading,

    // Handlers
    handleImageChange,
    handleSubmit,
    resetForm,
  };
}
