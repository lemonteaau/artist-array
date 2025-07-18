"use client";

import { Toaster } from "sonner";
import { useSignup } from "./hooks/use-signup";
import { SignupHeader } from "./components/signup-header";
import { SignupForm } from "./components/signup-form";

export default function SignUpPage() {
  const {
    // State
    email,
    password,
    confirmPassword,
    displayName,
    isLoading,

    // Setters
    setEmail,
    setPassword,
    setConfirmPassword,
    setDisplayName,

    // Actions
    handleSubmit,
  } = useSignup();

  return (
    <>
      <Toaster richColors />
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="w-full max-w-md space-y-8">
          <SignupHeader />

          <SignupForm
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            displayName={displayName}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onDisplayNameChange={setDisplayName}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </>
  );
}
