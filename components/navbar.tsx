"use client";

import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useScrollDirection } from "@/hooks/use-scroll-direction";
import { useIsMobile } from "@/hooks/use-mobile";

import { NavbarBrand } from "./navbar/brand";
import { NavbarUserMenu } from "./navbar/user-menu";
import { NavbarAuthButtons } from "./navbar/auth-buttons";
import { NavbarShareButton } from "./navbar/share-button";
import { NavbarSettings } from "./navbar/settings";

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();
  const tToast = useTranslations("Toast");
  const { scrollDirection, isAtTop } = useScrollDirection();
  const isMobile = useIsMobile();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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

  const shouldHideNavbar = isMobile && scrollDirection === "down" && !isAtTop;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        shouldHideNavbar ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavbarBrand />

          <nav className="flex items-center gap-2">
            <NavbarSettings />

            {user && <NavbarShareButton loading={loading} />}

            {loading ? (
              <div className="h-9 w-9 bg-muted animate-pulse rounded-full" />
            ) : user ? (
              <NavbarUserMenu user={user} onSignOut={handleSignOut} />
            ) : (
              <NavbarAuthButtons />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
