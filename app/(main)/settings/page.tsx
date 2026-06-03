"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import AvatarCropModal from "@/components/avatar-crop-modal";
import ImportWizard from "@/components/import-wizard";
import DataExporter from "@/components/data-exporter";

// Import types and subcomponents
import { ConvexProfile, User, BlockedUser } from "@/components/settings/types";
import SidebarNav from "@/components/settings/sidebar-nav";
import AppearanceSection from "@/components/settings/appearance-section";
import ProfileSection from "@/components/settings/profile-section";
import PrivacySection from "@/components/settings/privacy-section";
import SecuritySection from "@/components/settings/security-section";
import DangerSection from "@/components/settings/danger-section";

interface SettingsFormProps {
  convexProfile: ConvexProfile | null;
  user: User;
}

type SettingsSection =
  | "profile"
  | "appearance"
  | "privacy"
  | "security"
  | "danger"
  | "import";

function SettingsForm({ convexProfile, user }: SettingsFormProps) {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateCurrentUserProfile);
  const deleteConvexAccountData = useMutation(
    api.users.deleteCurrentUserAccountData,
  );
  const closeConvexAccount = useMutation(api.users.closeCurrentUserAccount);

  // Convex image storage mutations
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfileImage = useMutation(api.users.updateProfileImage);
  const removeProfileImage = useMutation(api.users.removeProfileImage);

  const isLoggedIn = !!user?.email;

  // Tabs
  const [activeSection, setActiveSection] = useState<SettingsSection>(
    convexProfile ? "profile" : "appearance",
  );

  // Profile fields state - initialized directly from props to avoid useEffect warnings
  const [name, setName] = useState(convexProfile?.name || user?.name || "");
  const [username, setUsername] = useState(
    convexProfile?.username || user?.username || "",
  );
  const [bio, setBio] = useState(convexProfile?.bio || "");
  const [country, setCountry] = useState(convexProfile?.country || "");
  const [profileImage, setProfileImage] = useState(
    convexProfile?.image || user?.image || "",
  );
  const [savingProfile, setSavingProfile] = useState(false);

  // Privacy & Social fields state
  const [profilePrivacy, setProfilePrivacy] = useState(
    convexProfile?.profilePrivacy || "public",
  );
  const [allowFriendRequests, setAllowFriendRequests] = useState(
    convexProfile?.allowFriendRequests !== false,
  );
  const [hideWatchlist, setHideWatchlist] = useState(
    convexProfile?.hideWatchlist === true,
  );
  const [hideFavorites, setHideFavorites] = useState(
    convexProfile?.hideFavorites === true,
  );
  const [hideRatings, setHideRatings] = useState(
    convexProfile?.hideRatings === true,
  );
  const [messagePrivacy, setMessagePrivacy] = useState(
    convexProfile?.messagePrivacy || "friends",
  );
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Privacy mutations & queries
  const updatePrivacy = useMutation(api.social.updatePrivacySettings);
  const rawBlockedUsersList = useQuery(api.social.getBlockedUsers);

  const blockedUsersList = useMemo(() => {
    if (!rawBlockedUsersList) return undefined;
    return rawBlockedUsersList as BlockedUser[];
  }, [rawBlockedUsersList]);

  const unblockMutation = useMutation(api.social.unblockUser);

  const handleUpdatePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPrivacy(true);
    try {
      await updatePrivacy({
        profilePrivacy,
        allowFriendRequests,
        hideWatchlist,
        hideFavorites,
        hideRatings,
        messagePrivacy,
        readReceiptsEnabled: true,
      });
      toast.success("Privacy settings updated successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to update privacy settings");
    } finally {
      setSavingPrivacy(false);
    }
  };

  const handleUnblock = async (targetUserId: string) => {
    try {
      await unblockMutation({ targetUserId });
      toast.success("User unblocked successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to unblock user");
    }
  };

  // Image upload & crop states
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete account fields state
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [closePassword, setClosePassword] = useState("");
  const [closingAccount, setClosingAccount] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Supported formats
    const supportedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!supportedTypes.includes(file.type)) {
      toast.error(
        "Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.",
      );
      return;
    }

    // Size limit check (2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 2MB limit.");
      return;
    }

    setSelectedFile(file);
    setIsCropOpen(true);
  };

  const handleCropSave = async (croppedBlob: Blob) => {
    setUploadingImage(true);
    try {
      // 1. Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();

      // 2. Upload cropped blob to Convex Storage
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": "image/jpeg" },
        body: croppedBlob,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image blob to storage");
      }

      const { storageId } = await response.json();

      // 3. Save storage ID in Convex and retrieve public URL
      const imageUrl = await updateProfileImage({ storageId });

      // 4. Update image URL in Better Auth user object
      await authClient.updateUser({
        image: imageUrl,
      });

      // 5. Force update client session cache
      await authClient.getSession({ query: { disableCookieCache: true } });

      setProfileImage(imageUrl);
      toast.success("Profile picture updated successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to upload profile picture");
    } finally {
      setUploadingImage(false);
      setSelectedFile(null);
    }
  };

  const handleRemoveImage = async () => {
    if (!confirm("Are you sure you want to remove your profile picture?"))
      return;

    setUploadingImage(true);
    try {
      // 1. Call Convex mutation to remove profile image
      await removeProfileImage();

      // 2. Call Better Auth updateUser with empty string image
      await authClient.updateUser({
        image: "",
      });

      // 3. Force update client session cache
      await authClient.getSession({ query: { disableCookieCache: true } });

      setProfileImage("");
      toast.success("Profile picture removed");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to remove profile picture");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const cleanedUsername = username.trim().toLowerCase();

    // Validation checks
    if (!name.trim()) {
      toast.error("Display name cannot be empty");
      setSavingProfile(false);
      return;
    }
    if (name.length > 50) {
      toast.error("Display name cannot exceed 50 characters");
      setSavingProfile(false);
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,15}$/.test(cleanedUsername)) {
      toast.error(
        "Username must be between 3 and 15 alphanumeric characters or underscores",
      );
      setSavingProfile(false);
      return;
    }
    if (bio.length > 200) {
      toast.error("Bio cannot exceed 200 characters");
      setSavingProfile(false);
      return;
    }

    try {
      // 1. Update Better Auth username & name
      const baResult = await authClient.updateUser({
        name: name.trim(),
        username: cleanedUsername,
      });

      if (baResult.error) {
        throw new Error(
          baResult.error.message || "Failed to update Better Auth credentials",
        );
      }

      // 2. Sync / Update Convex profile
      await updateProfile({
        name: name.trim(),
        username: cleanedUsername,
        bio: bio.trim() || undefined,
        country: country || undefined,
      });

      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setUpdatingPassword(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to update password");
      }

      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to change password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!deletePassword) {
      toast.error("Please enter your current password to confirm deletion");
      return;
    }

    const email = user?.email;
    if (!email) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    if (
      !confirm(
        "Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingAccount(true);

    try {
      // 1. Verify password by calling signIn (will fail if password is wrong)
      const verifyResult = await authClient.signIn.email({
        email,
        password: deletePassword,
      });

      if (verifyResult.error) {
        throw new Error(
          "Incorrect password. Please verify your current password.",
        );
      }

      // 2. Remove user data from Convex tables (while still authenticated!)
      await deleteConvexAccountData({});

      // 3. Delete user from Better Auth
      const deleteResult = await authClient.deleteUser({
        password: deletePassword,
      });

      if (deleteResult.error) {
        throw new Error(
          deleteResult.error.message ||
            "Failed to delete account from authenticator",
        );
      }

      toast.success("Your account has been deleted. Goodbye!");
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Account deletion failed.");
    } finally {
      setDeletingAccount(false);
    }
  };

  const handleCloseAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!closePassword) {
      toast.error(
        "Please enter your current password to confirm closing your account",
      );
      return;
    }

    const email = user?.email;
    if (!email) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to close your account? You will be logged out, but you can reopen your account anytime simply by logging back in.",
      )
    ) {
      return;
    }

    setClosingAccount(true);

    try {
      // 1. Verify password by calling signIn (will fail if password is wrong)
      const verifyResult = await authClient.signIn.email({
        email,
        password: closePassword,
      });

      if (verifyResult.error) {
        throw new Error(
          "Incorrect password. Please verify your current password.",
        );
      }

      // 2. Mark user account as closed in Convex
      await closeConvexAccount({});

      // 3. Sign out the user
      await authClient.signOut();

      toast.success(
        "Your account has been closed. You can reopen it anytime by logging back in.",
      );
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to close account.");
    } finally {
      setClosingAccount(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
      <SidebarNav
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isLoggedIn={isLoggedIn}
      />

      {/* Content Box */}
      <div className="rounded-3xl border border-zinc-900 bg-zinc-900/10 p-6 backdrop-blur-md sm:p-8 md:col-span-3">
        {activeSection === "appearance" && <AppearanceSection />}

        {activeSection === "profile" && (
          <ProfileSection
            name={name}
            setName={setName}
            username={username}
            setUsername={setUsername}
            bio={bio}
            setBio={setBio}
            country={country}
            setCountry={setCountry}
            profileImage={profileImage}
            uploadingImage={uploadingImage}
            savingProfile={savingProfile}
            handleRemoveImage={handleRemoveImage}
            handleFileChange={handleFileChange}
            handleUpdateProfile={handleUpdateProfile}
            fileInputRef={fileInputRef}
          />
        )}

        {activeSection === "privacy" && (
          <PrivacySection
            profilePrivacy={profilePrivacy}
            setProfilePrivacy={setProfilePrivacy}
            messagePrivacy={messagePrivacy}
            setMessagePrivacy={setMessagePrivacy}
            allowFriendRequests={allowFriendRequests}
            setAllowFriendRequests={setAllowFriendRequests}
            hideWatchlist={hideWatchlist}
            setHideWatchlist={setHideWatchlist}
            hideFavorites={hideFavorites}
            setHideFavorites={setHideFavorites}
            hideRatings={hideRatings}
            setHideRatings={setHideRatings}
            savingPrivacy={savingPrivacy}
            handleUpdatePrivacy={handleUpdatePrivacy}
            blockedUsersList={blockedUsersList}
            handleUnblock={handleUnblock}
          />
        )}

        {activeSection === "security" && (
          <SecuritySection
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            updatingPassword={updatingPassword}
            handleUpdatePassword={handleUpdatePassword}
          />
        )}

        {activeSection === "danger" && (
          <DangerSection
            closePassword={closePassword}
            setClosePassword={setClosePassword}
            closingAccount={closingAccount}
            handleCloseAccount={handleCloseAccount}
            deletePassword={deletePassword}
            setDeletePassword={setDeletePassword}
            deletingAccount={deletingAccount}
            handleDeleteAccount={handleDeleteAccount}
          />
        )}

        {activeSection === "import" && (
          <div className="divide-y divide-zinc-900/80">
            <ImportWizard />
            <DataExporter />
          </div>
        )}
      </div>

      {/* Avatar Crop Modal Overlay */}
      {isCropOpen && (
        <AvatarCropModal
          isOpen={isCropOpen}
          onClose={() => {
            setIsCropOpen(false);
            setSelectedFile(null);
          }}
          imageFile={selectedFile}
          onCropSave={handleCropSave}
        />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const loadingSession = session.isPending;
  const user = session.data?.user;

  // Fetch current user details from Convex
  const rawConvexProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );
  const openAuth = useAuthModalStore((state) => state.open);

  const convexProfile = useMemo(() => {
    if (!rawConvexProfile) return undefined;
    return rawConvexProfile as unknown as ConvexProfile;
  }, [rawConvexProfile]);

  if (loadingSession || (isLoggedIn && convexProfile === undefined)) {
    return (
      <div className="flex min-h-[60vh] grow items-center justify-center bg-zinc-950 text-white">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="bg-background text-foreground flex min-h-[60vh] grow flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-xl font-bold text-white">Login Required</h1>
        <p className="max-w-sm text-sm text-zinc-400">
          You must be logged in to access and customize your account settings
          and theme preferences.
        </p>
        <Button
          onClick={() => openAuth()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-2xl px-6 py-5 text-sm font-semibold"
        >
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground mx-auto min-h-[85vh] w-full max-w-5xl grow px-6 py-24 transition-colors duration-300 sm:px-12 md:px-16 lg:px-20">
      <div className="mb-8 border-b border-zinc-900 pb-6">
        <h1 className="text-left text-2xl font-black tracking-tight text-white sm:text-3xl">
          Settings
        </h1>
        <p className="mt-0.5 text-left text-xs text-zinc-500">
          Manage your profile, security options, and platform appearance
        </p>
      </div>

      <SettingsForm convexProfile={convexProfile || null} user={user || {}} />
    </div>
  );
}
