import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";

interface ProfileHeaderProps {
  user: User;
  displayName: string;
  getUserInitials: (email: string) => string;
}

export function ProfileHeader({
  user,
  displayName,
  getUserInitials,
}: ProfileHeaderProps) {
  const t = useTranslations("Profile");

  return (
    <div className="text-center space-y-4">
      <Avatar className="h-24 w-24 mx-auto ring-4 ring-primary/20">
        <AvatarImage
          src={user.user_metadata?.avatar_url}
          alt={user.email || ""}
        />
        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
          {user.email ? getUserInitials(user.email) : "U"}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-3xl font-bold gradient-text">
          {displayName || t("anonymousUser")}
        </h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );
}
