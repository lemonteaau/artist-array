"use client";

import { Toaster } from "sonner";
import { useLogin } from "./hooks/use-login";
import { LoginHeader } from "./components/login-header";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
  const {
    // State
    email,
    password,
    isLoading,

    // Setters
    setEmail,
    setPassword,

    // Actions
    handleSubmit,
  } = useLogin();

  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md space-y-8">
          <LoginHeader />

          <LoginForm
            email={email}
            password={password}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
