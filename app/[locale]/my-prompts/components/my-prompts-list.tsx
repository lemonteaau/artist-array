import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "@/i18n/navigation";
import { Trash2, Eye, Heart, MessageCircle, Calendar } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Prompt } from "../hooks/use-my-prompts";
import { useDateFormat } from "@/lib/date-utils";

interface MyPromptsListProps {
  prompts: Prompt[];
  deletingId: number | null;
  onDeletePrompt: (promptId: number) => void;
}

export function MyPromptsList({
  prompts,
  deletingId,
  onDeletePrompt,
}: MyPromptsListProps) {
  const t = useTranslations("MyPrompts");
  const { formatDateSimple } = useDateFormat();

  return (
    <div className="space-y-4">
      {prompts.map((prompt) => (
        <Card
          key={prompt.id}
          className="glass-effect border-border/50 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-48 h-48 md:h-auto relative">
              <Image
                src={prompt.image_url}
                alt={prompt.artist_string}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg line-clamp-1">
                      {prompt.artist_string}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDateSimple(prompt.created_at)}
                      </span>
                      {prompt.model && (
                        <Badge variant="secondary" className="text-xs">
                          {prompt.model}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8"
                    >
                      <Link href={`/prompt/${prompt.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          disabled={deletingId === prompt.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deletePrompt")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deletePromptDescription")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeletePrompt(prompt.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            {t("delete")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardFooter className="pt-0">
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="font-medium">{prompt.likes_count}</span>
                    <span className="text-muted-foreground">{t("likes")}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">{prompt.comments_count}</span>
                    <span className="text-muted-foreground">
                      {t("comments")}
                    </span>
                  </span>
                  {prompt.prompt && (
                    <Badge variant="outline" className="text-xs">
                      {t("hasPrompt")}
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
