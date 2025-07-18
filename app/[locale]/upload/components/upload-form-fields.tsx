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
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";

interface UploadFormFieldsProps {
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
}

export function UploadFormFields({
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
}: UploadFormFieldsProps) {
  const t = useTranslations("Upload");

  return (
    <div className="space-y-6">
      {/* Artist String */}
      <div className="space-y-2">
        <Label htmlFor="artist-string">
          {t("artistString")} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="artist-string"
          placeholder={t("artistStringPlaceholder")}
          required
          value={artistString}
          onChange={(e) => setArtistString(e.target.value)}
          disabled={isLoading}
          className="glass-effect"
        />
        <p className="text-xs text-muted-foreground">
          {t("artistStringDescription")}
        </p>
      </div>

      {/* Model Selection */}
      <div className="space-y-2">
        <Label htmlFor="model">
          {t("selectModel")} <span className="text-destructive">*</span>
        </Label>
        <Select
          value={model}
          onValueChange={setModel}
          disabled={isLoading || modelsLoading}
        >
          <SelectTrigger className="glass-effect">
            <SelectValue
              placeholder={
                modelsLoading ? t("loadingModels") : t("selectModelPlaceholder")
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
          {t("uploadImage")} <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="image"
            type="file"
            accept="image/*"
            required
            onChange={handleImageChange}
            disabled={isLoading}
            className="glass-effect file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary file:items-center file:cursor-pointer hover:file:bg-primary/20"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Maximum file size: 10MB. Supported formats: JPG, PNG, WebP, etc.
          </p>
          {imagePreview && (
            <div className="mt-4 relative flex h-96 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted/20">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-full max-w-full object-contain"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <Badge className="absolute bottom-2 right-2">
                <ImageIcon className="h-3 w-3 mr-1" />
                {t("preview")}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Prompt */}
      <div className="space-y-2">
        <Label htmlFor="prompt">
          {t("prompt")}{" "}
          <Badge variant="outline" className="ml-2">
            {t("optional")}
          </Badge>
        </Label>
        <Textarea
          id="prompt"
          placeholder={t("promptPlaceholder")}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
          className="glass-effect min-h-[100px]"
        />
      </div>

      {/* Negative Prompt */}
      <div className="space-y-2">
        <Label htmlFor="negative-prompt">
          {t("negativePrompt")}{" "}
          <Badge variant="outline" className="ml-2">
            {t("optional")}
          </Badge>
        </Label>
        <Textarea
          id="negative-prompt"
          placeholder={t("negativePromptPlaceholder")}
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          disabled={isLoading}
          className="glass-effect min-h-[80px]"
        />
      </div>
    </div>
  );
}
