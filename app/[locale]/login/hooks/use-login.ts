"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const tToast = useTranslations("Toast");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success(tToast("welcomeBack"));
    router.push("/");
    router.refresh();
  };

  return {
    // State
    email,
    password,
    isLoading,

    // Setters
    setEmail,
    setPassword,

    // Actions
    handleSubmit,
  };
}
