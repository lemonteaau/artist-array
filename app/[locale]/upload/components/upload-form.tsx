import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { UploadFormFields } from "./upload-form-fields";

interface UploadFormProps {
  artistString: string;
  setArtistString: (value: string) => void;
  prompt: string;
  setPrompt: (value: string) => void;
  negativePrompt: string;
  setNegativePrompt: (value: string) => void;
  model: string;
  setModel: (value: string) => void;
  availableModels: string[];
  imagePreview: string | null;
  isLoading: boolean;
  modelsLoading: boolean;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function UploadForm({
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
  handleImageChange,
  handleSubmit,
}: UploadFormProps) {
  const t = useTranslations("Upload");

  return (
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
            <CardTitle>{t("artworkDetails")}</CardTitle>
            <CardDescription>{t("artworkDetails")}</CardDescription>
          </CardHeader>
          <CardContent>
            <UploadFormFields
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
            />
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
                  {t("sharing")}
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {t("shareArtwork")}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
