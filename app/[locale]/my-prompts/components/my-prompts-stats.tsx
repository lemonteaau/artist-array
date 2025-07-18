import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import type { Prompt } from "../hooks/use-my-prompts";

interface MyPromptsStatsProps {
  prompts: Prompt[];
}

export function MyPromptsStats({ prompts }: MyPromptsStatsProps) {
  const t = useTranslations("MyPrompts");

  const totalLikes = prompts.reduce((acc, p) => acc + p.likes_count, 0);
  const totalComments = prompts.reduce((acc, p) => acc + p.comments_count, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="glass-effect border-border/50">
        <CardContent className="p-6 text-center">
          <p className="text-3xl font-bold">{prompts.length}</p>
          <p className="text-sm text-muted-foreground">{t("totalPrompts")}</p>
        </CardContent>
      </Card>
      <Card className="glass-effect border-border/50">
        <CardContent className="p-6 text-center">
          <p className="text-3xl font-bold">{totalLikes}</p>
          <p className="text-sm text-muted-foreground">{t("totalLikes")}</p>
        </CardContent>
      </Card>
      <Card className="glass-effect border-border/50">
        <CardContent className="p-6 text-center">
          <p className="text-3xl font-bold">{totalComments}</p>
          <p className="text-sm text-muted-foreground">{t("totalComments")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
