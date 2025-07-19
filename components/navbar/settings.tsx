"use client";

import { Settings, Sun, Moon, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { locales } from "@/i18n.config";
import { FlagIcon } from "../flag-icon";
import { BsToggles } from "react-icons/bs";

export function NavbarSettings() {
  const { setTheme } = useTheme();
  const tTheme = useTranslations("Theme");
  const tLang = useTranslations("LocaleSwitcher");
  const tSettings = useTranslations("Settings");
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onSelectLanguage(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Settings className="h-5 w-5" />
          <span className="sr-only">{tSettings("settings")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 glass-effect">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          {tSettings("themeSettings")}
        </DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>{tTheme("light")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>{tTheme("dark")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <BsToggles className="mr-2 h-4 w-4" />
          <span>{tTheme("system")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="flex items-center gap-2">
          <Languages className="h-4 w-4" />
          {tSettings("languageSettings")}
        </DropdownMenuLabel>
        {locales.map((cur) => (
          <DropdownMenuItem
            key={cur}
            disabled={locale === cur}
            onSelect={() => onSelectLanguage(cur)}
          >
            <div className="flex items-center gap-2">
              <FlagIcon locale={cur} className="w-4 h-auto" />
              <span>{tLang(cur)}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
