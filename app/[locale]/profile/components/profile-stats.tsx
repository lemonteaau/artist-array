import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Image as ImageIcon, Heart, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { UserStats } from "../hooks/use-profile";

interface ProfileStatsProps {
  stats: UserStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const t = useTranslations("Profile");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="glass-effect border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            {t("promptsShared")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalPrompts}</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            {t("totalLikes")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalLikes}</p>
        </CardContent>
      </Card>

      <Card className="glass-effect border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            {t("comments")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.totalComments}</p>
        </CardContent>
      </Card>
    </div>
  );
}
