"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

interface SortSelectorProps {
  currentSort: string;
}

export function SortSelector({ currentSort }: SortSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isChanging, setIsChanging] = useState(false);

  const debouncedSortChange = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    const url = params.toString() ? `/?${params.toString()}` : "/";
    router.push(url);
    setIsChanging(false);
  }, 300);

  const handleSortChange = (value: string) => {
    setIsChanging(true);
    debouncedSortChange(value);
  };

  return (
    <Select
      value={currentSort}
      onValueChange={handleSortChange}
      disabled={isChanging}
    >
      <SelectTrigger
        className={`w-[180px] ${isChanging ? "opacity-60 cursor-wait" : ""}`}
      >
        <SelectValue
          placeholder={isChanging ? "Changing..." : "Select sort order"}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="popular">Most Popular</SelectItem>
      </SelectContent>
    </Select>
  );
}
