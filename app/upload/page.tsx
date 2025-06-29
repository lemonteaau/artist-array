"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UploadPage() {
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
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
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
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!artistString || !imageFile || !model) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to upload");
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
        }),
      });

      if (!presignedResponse.ok) {
        throw new Error("Failed to get upload URL");
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
      toast.success("Artwork shared successfully!");

      // Reset form
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

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto p-3 rounded-full bg-muted mb-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to share your AI artwork
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Share Your Creation
          </h1>
          <p className="text-muted-foreground">
            Help others discover amazing AI art styles
          </p>
        </div>

        <Card className="glass-effect border-border/50">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Artwork Details</CardTitle>
              <CardDescription>
                Fill in the details about your AI-generated artwork
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Artist String */}
              <div className="space-y-2">
                <Label htmlFor="artist-string">
                  Artist String <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="artist-string"
                  placeholder="e.g., by artist1, by artist2, style of artist3"
                  required
                  value={artistString}
                  onChange={(e) => setArtistString(e.target.value)}
                  disabled={isLoading}
                  className="glass-effect"
                />
                <p className="text-xs text-muted-foreground">
                  The artist combination that created this style
                </p>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <Label htmlFor="model">
                  AI Model <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={model}
                  onValueChange={setModel}
                  disabled={isLoading || modelsLoading}
                >
                  <SelectTrigger className="glass-effect">
                    <SelectValue
                      placeholder={
                        modelsLoading
                          ? "Loading models..."
                          : "Select the AI model used"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="glass-effect">
                    {availableModels.map((modelName) => (
                      <SelectItem key={modelName} value={modelName}>
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4" />
                          {modelName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">
                  Example Image <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    required
                    onChange={handleImageChange}
                    disabled={isLoading}
                    className="glass-effect file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                  {imagePreview && (
                    <div className="mt-4 relative rounded-lg overflow-hidden border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <Badge className="absolute bottom-2 right-2">
                        <ImageIcon className="h-3 w-3 mr-1" />
                        Preview
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <Label htmlFor="prompt">
                  Prompt{" "}
                  <Badge variant="outline" className="ml-2">
                    Optional
                  </Badge>
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="The full prompt used to generate this image..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                  className="glass-effect min-h-[100px]"
                />
              </div>

              {/* Negative Prompt */}
              <div className="space-y-2">
                <Label htmlFor="negative-prompt">
                  Negative Prompt{" "}
                  <Badge variant="outline" className="ml-2">
                    Optional
                  </Badge>
                </Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="Words or phrases to avoid..."
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  disabled={isLoading}
                  className="glass-effect min-h-[80px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading || modelsLoading || !model}
                className="w-full hover-glow"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Share Artwork
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
