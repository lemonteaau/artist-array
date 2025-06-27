"use client";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard!");
  };

  return (
    <Button variant="ghost" size="icon" onClick={handleCopy}>
      <Copy className="h-4 w-4" />
    </Button>
  );
}
