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
import { AI_MODELS } from "@/lib/models";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

export default function UploadPage() {
  const [artistString, setArtistString] = useState("");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!artistString || !imageFile || !model) {
      toast.error("Artist String, Example Image, and Model are required.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to upload.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    toast.loading("Submitting your post...");

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
        throw new Error("Failed to get presigned URL.");
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
        throw new Error("Failed to upload image.");
      }

      // 3. Submit prompt to our database
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
        throw new Error(errorData.error || "Failed to submit prompt.");
      }

      toast.dismiss();
      toast.success("Submission successful!");
      // Reset form
      setArtistString("");
      setPrompt("");
      setNegativePrompt("");
      setModel("");
      setImageFile(null);
      // a bit of a hack to reset the file input
      const fileInput = document.getElementById("image") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error(
        error instanceof Error ? error.message : "An error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Authentication Required
          </h2>
          <p className="text-muted-foreground">
            Please log in to upload content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Share an Artist String</CardTitle>
            <CardDescription>
              Contribute to the community by sharing a new artist string.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-6" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="artist-string">Artist String *</Label>
                <Input
                  id="artist-string"
                  placeholder="e.g. by artist1, by artist2, style of artist3"
                  required
                  value={artistString}
                  onChange={(e) => setArtistString(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="model">Model *</Label>
                <Select
                  value={model}
                  onValueChange={setModel}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select the AI model used" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((modelName) => (
                      <SelectItem key={modelName} value={modelName}>
                        {modelName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image">Example Image *</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter the full prompt used to generate the image"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="negative-prompt">Negative Prompt</Label>
                <Textarea
                  id="negative-prompt"
                  placeholder="Enter the negative prompt if any"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    </>
  );
}
