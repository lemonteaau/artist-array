import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Settings,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface ProfileSettingsProps {
  user: User;
  displayName: string;
  updating: boolean;
  onDisplayNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileSettings({
  user,
  displayName,
  updating,
  onDisplayNameChange,
  onSubmit,
}: ProfileSettingsProps) {
  const t = useTranslations("Profile");

  return (
    <Card className="glass-effect border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          {t("myProfile")}
        </CardTitle>
        <CardDescription>{t("updateYourProfile")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={user.email || ""}
              disabled
              className="glass-effect"
            />
            <p className="text-xs text-muted-foreground">
              {t("emailCannotBeChanged")}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              {t("displayName")}
            </Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder={t("displayName")}
              disabled={updating}
              className="glass-effect"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {t("memberSince")}
            </Label>
            <p className="text-sm text-muted-foreground">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <Button type="submit" disabled={updating} className="hover-glow">
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("updating")}
              </>
            ) : (
              t("updateProfile")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
