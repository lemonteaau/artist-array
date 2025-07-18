"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const tToast = useTranslations("Toast");

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success(tToast("copiedToClipboard"));
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}
