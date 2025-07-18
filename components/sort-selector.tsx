"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { TrendingUp, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface SortSelectorProps {
  currentSort: string;
}

//TODO: fix sorting (seems mixed up with newest and popular)
export function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Sort");

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value === "popular") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={t("sortBy")} />
      </SelectTrigger>
      <SelectContent className="glass-effect">
        <SelectItem value="newest">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{t("newest")}</span>
          </div>
        </SelectItem>
        <SelectItem value="popular">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>{t("popular")}</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
