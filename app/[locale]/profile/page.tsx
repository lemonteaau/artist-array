"use client";

import { Toaster } from "sonner";
import { PageLoading } from "@/components/ui/page-loading";
import { useProfile } from "./hooks/use-profile";
import { ProfileHeader } from "./components/profile-header";
import { ProfileStats } from "./components/profile-stats";
import { ProfileSettings } from "./components/profile-settings";
import { ProfileActions } from "./components/profile-actions";

export default function ProfilePage() {
  const {
    // State
    user,
    stats,
    loading,
    updating,
    displayName,

    // Setters
    setDisplayName,

    // Actions
    handleUpdateProfile,
    handleSignOut,
    getUserInitials,
  } = useProfile();

  if (loading) {
    return <PageLoading />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Toaster richColors />
      <div className="max-w-4xl mx-auto space-y-8">
        <ProfileHeader
          user={user}
          displayName={displayName}
          getUserInitials={getUserInitials}
        />

        <ProfileStats stats={stats} />

        <ProfileSettings
          user={user}
          displayName={displayName}
          updating={updating}
          onDisplayNameChange={setDisplayName}
          onSubmit={handleUpdateProfile}
        />

        <ProfileActions onSignOut={handleSignOut} />
      </div>
    </>
  );
}
