import { CopyButton } from "@/components/copy-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Prompt } from "../hooks/use-prompt-detail";
import { PromptActions } from "./prompt-actions";

interface PromptDetailsProps {
  prompt: Prompt;
  liked: boolean;
  likesCount: number;
  likesLoading: boolean;
  toggleLike: () => void;
  isOwner: boolean;
  isDeleting: boolean;
  onDeletePrompt: () => void;
}

export function PromptDetails({
  prompt,
  liked,
  likesCount,
  likesLoading,
  toggleLike,
  isOwner,
  isDeleting,
  onDeletePrompt,
}: PromptDetailsProps) {
  const t = useTranslations("PromptDetails");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{t("details")}</span>
          <PromptActions
            liked={liked}
            likesCount={likesCount}
            likesLoading={likesLoading}
            toggleLike={toggleLike}
            commentsCount={prompt.comments.length}
            isOwner={isOwner}
            isDeleting={isDeleting}
            onDeletePrompt={onDeletePrompt}
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
            <span>{t("artistString")}</span>
            <CopyButton text={prompt.artist_string} />
          </h3>
          <p className="text-muted-foreground bg-muted p-3 rounded-md">
            {prompt.artist_string}
          </p>
        </div>

        {prompt.model && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2">{t("model")}</h3>
              <Badge variant="outline">{prompt.model}</Badge>
            </div>
          </>
        )}

        {prompt.prompt && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
                <span>{t("prompt")}</span>
                <CopyButton text={prompt.prompt} />
              </h3>
              <p className="text-muted-foreground bg-muted p-3 rounded-md max-h-48 overflow-y-auto">
                {prompt.prompt}
              </p>
            </div>
          </>
        )}

        {prompt.negative_prompt && (
          <>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg mb-2 flex justify-between items-center">
                <span>{t("negativePrompt")}</span>
                <CopyButton text={prompt.negative_prompt} />
              </h3>
              <p className="text-muted-foreground bg-muted p-3 rounded-md max-h-48 overflow-y-auto">
                {prompt.negative_prompt}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
