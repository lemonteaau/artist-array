"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface UserStats {
  totalPrompts: number;
  totalLikes: number;
  totalComments: number;
}

export function useProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalPrompts: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  const [updating, setUpdating] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const tToast = useTranslations("Toast");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        setUser(user);
        setDisplayName(user.user_metadata?.display_name || "");

        // Fetch user statistics
        const [promptsResult, likesResult, commentsResult] = await Promise.all([
          supabase
            .from("prompts")
            .select("id", { count: "exact" })
            .eq("user_id", user.id),
          supabase
            .from("prompts")
            .select("id, likes(id)")
            .eq("user_id", user.id),
          supabase
            .from("comments")
            .select("id", { count: "exact" })
            .eq("user_id", user.id),
        ]);

        const totalLikes =
          likesResult.data?.reduce(
            (acc, prompt) => acc + (prompt.likes?.length || 0),
            0
          ) || 0;

        setStats({
          totalPrompts: promptsResult.count || 0,
          totalLikes,
          totalComments: commentsResult.count || 0,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchUserData();
  }, [router, supabase]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName },
      });

      if (error) throw error;

      toast.success(tToast("profileUpdatedSuccess"));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(tToast("profileUpdateFailed"));
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(tToast("signedOutSuccess"));
      router.push("/");
      router.refresh();
    }
  };

  const getUserInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  return {
    // State
    user,
    stats,
    updating,
    displayName,

    // Setters
    setDisplayName,

    // Actions
    handleUpdateProfile,
    handleSignOut,
    getUserInitials,
  };
}

export type { UserStats };
