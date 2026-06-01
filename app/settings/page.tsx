"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { User, Lock, Trash2, Loader2, Globe, FileText, Camera, Palette, Shield, UserX } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePersonalization, type ThemeType } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import AvatarCropModal from "@/components/avatar-crop-modal";
import ImportWizard from "@/components/import-wizard";
import DataExporter from "@/components/data-exporter";
import RegionSelect from "@/components/region-select";

interface SettingsFormProps {
  convexProfile: {
    name: string;
    username: string;
    bio?: string;
    country?: string;
    image?: string;
    profilePrivacy?: string;
    allowFriendRequests?: boolean;
    hideWatchlist?: boolean;
    hideFavorites?: boolean;
    hideRatings?: boolean;
  } | null;
  user: {
    name?: string;
    username?: string | null;
    email?: string;
    image?: string | null;
  };
}

function SettingsForm({ convexProfile, user }: SettingsFormProps) {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateCurrentUserProfile);
  const deleteConvexAccountData = useMutation(api.users.deleteCurrentUserAccountData);
  const closeConvexAccount = useMutation(api.users.closeCurrentUserAccount);

  // Convex image storage mutations
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const updateProfileImage = useMutation(api.users.updateProfileImage);
  const removeProfileImage = useMutation(api.users.removeProfileImage);

  const isLoggedIn = !!user?.email;
  const {
    theme,
    setTheme,
  } = usePersonalization();

  // Tabs
  const [activeSection, setActiveSection] = useState<"profile" | "appearance" | "privacy" | "security" | "danger" | "import">(
    convexProfile ? "profile" : "appearance"
  );

  // Profile fields state - initialized directly from props to avoid useEffect warnings
  const [name, setName] = useState(convexProfile?.name || user?.name || "");
  const [username, setUsername] = useState(convexProfile?.username || user?.username || "");
  const [bio, setBio] = useState(convexProfile?.bio || "");
  const [country, setCountry] = useState(convexProfile?.country || "");
  const [profileImage, setProfileImage] = useState(convexProfile?.image || user?.image || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Privacy & Social fields state
  const [profilePrivacy, setProfilePrivacy] = useState(convexProfile?.profilePrivacy || "public");
  const [allowFriendRequests, setAllowFriendRequests] = useState(
    convexProfile?.allowFriendRequests !== false
  );
  const [hideWatchlist, setHideWatchlist] = useState(
    convexProfile?.hideWatchlist === true
  );
  const [hideFavorites, setHideFavorites] = useState(
    convexProfile?.hideFavorites === true
  );
  const [hideRatings, setHideRatings] = useState(
    convexProfile?.hideRatings === true
  );
  const [savingPrivacy, setSavingPrivacy] = useState(false);

  // Privacy mutations & queries
  const updatePrivacy = useMutation(api.social.updatePrivacySettings);
  const blockedUsersList = useQuery(api.social.getBlockedUsers);
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
    const supportedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!supportedTypes.includes(file.type)) {
      toast.error("Unsupported file format. Please upload JPG, JPEG, PNG, or WEBP.");
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
    if (!confirm("Are you sure you want to remove your profile picture?")) return;

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
      toast.error("Username must be between 3 and 15 alphanumeric characters or underscores");
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
        throw new Error(baResult.error.message || "Failed to update Better Auth credentials");
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

    if (!confirm("Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.")) {
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
        throw new Error("Incorrect password. Please verify your current password.");
      }

      // 2. Remove user data from Convex tables (while still authenticated!)
      await deleteConvexAccountData({});

      // 3. Delete user from Better Auth
      const deleteResult = await authClient.deleteUser({
        password: deletePassword,
      });

      if (deleteResult.error) {
        throw new Error(deleteResult.error.message || "Failed to delete account from authenticator");
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
      toast.error("Please enter your current password to confirm closing your account");
      return;
    }

    const email = user?.email;
    if (!email) {
      toast.error("User email not found. Please log in again.");
      return;
    }

    if (!confirm("Are you sure you want to close your account? You will be logged out, but you can reopen your account anytime simply by logging back in.")) {
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
        throw new Error("Incorrect password. Please verify your current password.");
      }

      // 2. Mark user account as closed in Convex
      await closeConvexAccount({});

      // 3. Sign out the user
      await authClient.signOut();

      toast.success("Your account has been closed. You can reopen it anytime by logging back in.");
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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Nav */}
      <div className="md:col-span-1 flex flex-col gap-2">
        {isLoggedIn && (
          <button
            type="button"
            onClick={() => setActiveSection("profile")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
              activeSection === "profile"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
            }`}
          >
            <User className="h-4 w-4" />
            Edit Profile
          </button>
        )}
        <button
          type="button"
          onClick={() => setActiveSection("appearance")}
          className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
            activeSection === "appearance"
              ? "bg-zinc-900 text-white border border-zinc-800"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
          }`}
        >
          <Palette className="h-4 w-4" />
          Appearance & Styling
        </button>
         {isLoggedIn && (
          <>
            <button
              type="button"
              onClick={() => setActiveSection("privacy")}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeSection === "privacy"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
              }`}
            >
              <Shield className="h-4 w-4" />
              Privacy & Social
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("security")}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeSection === "security"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
              }`}
            >
              <Lock className="h-4 w-4" />
              Security
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("import")}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeSection === "import"
                  ? "bg-zinc-900 text-white border border-zinc-800"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
              }`}
            >
              <FileText className="h-4 w-4" />
              Import & Export
            </button>
            <button
              type="button"
              onClick={() => setActiveSection("danger")}
              className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
                activeSection === "danger"
                  ? "bg-red-950/30 text-red-400 border border-red-900/40"
                  : "text-zinc-400 hover:text-red-400 hover:bg-red-950/10 border border-transparent"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Danger Zone
            </button>
          </>
        )}
      </div>

      {/* Content Box */}
      <div className="md:col-span-3 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        
        {/* APPEARANCE SECTION */}
        {activeSection === "appearance" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Appearance & Styling</h2>
              <p className="text-xs text-zinc-500">Personalize your platform appearance by choosing from a selection of premium dark themes</p>
            </div>

            {/* Core Theme Picker */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Select Theme</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {([
                  { id: "dark", name: "Dark Mode (Default)", bg: "bg-zinc-950 text-white border-zinc-800" },
                  { id: "netflix", name: "Netflix Red", bg: "bg-zinc-900 text-white border-red-600/30" },
                  { id: "hbo", name: "HBO Purple", bg: "bg-indigo-950/60 text-white border-purple-800/30" },
                  { id: "disney", name: "Disney Blue", bg: "bg-blue-950/60 text-white border-blue-600/30" },
                  { id: "prime", name: "Prime Video Blue", bg: "bg-slate-900 text-white border-sky-600/30" },
                  { id: "letterboxd", name: "Letterboxd Orange", bg: "bg-zinc-900 text-white border-orange-500/30" },
                  { id: "cinema", name: "Cinema Gold", bg: "bg-stone-900 text-white border-yellow-600/30" },
                  { id: "sakura", name: "Sakura Pink", bg: "bg-zinc-900 text-white border-pink-500/30" },
                ] as { id: ThemeType; name: string; bg: string }[]).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 hover:scale-[1.02] cursor-pointer min-h-16",
                      t.bg,
                      theme === t.id ? "ring-2 ring-blue-500 scale-102 font-bold" : "opacity-80 hover:opacity-100"
                    )}
                  >
                    <span className="text-xs">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Profile Details</h2>
              <p className="text-xs text-zinc-500">Update your public credentials, region, and custom bio</p>
            </div>

            {/* Profile Picture Uploader Area */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-900">
              <div className="relative group/avatar cursor-pointer select-none">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border border-zinc-800 shadow-xl overflow-hidden relative">
                  {profileImage ? (
                    <AvatarImage src={profileImage} alt={name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-blue-600 text-white font-black text-3xl flex items-center justify-center w-full h-full">
                    {name.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>

                  {/* Loading overlay spinner */}
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                      <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                    </div>
                  )}

                  {/* Hover Edit Overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 md:opacity-0 md:group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 z-10"
                  >
                    <Camera className="h-5 w-5 text-white mb-1" />
                    <span className="text-[10px] uppercase font-bold tracking-wider text-white">Change</span>
                  </div>
                </Avatar>
              </div>

              <div className="flex flex-col gap-2 text-center sm:text-left">
                <h3 className="text-sm font-bold text-white">Profile Picture</h3>
                <p className="text-xs text-zinc-500 max-w-xs">
                  Supported formats: JPG, JPEG, PNG, or WEBP. Max file size: 2MB.
                </p>
                <div className="flex justify-center sm:justify-start gap-3 mt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-xl border border-zinc-800 text-xs font-semibold px-4 cursor-pointer hover:bg-zinc-800 hover:text-white"
                  >
                    Upload Photo
                  </Button>
                  {profileImage && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRemoveImage}
                      className="rounded-xl border border-red-950/40 text-red-400 text-xs font-semibold px-4 cursor-pointer hover:bg-red-950/20 hover:text-red-300"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Display Name
                  </Label>
                  <span className="text-[10px] text-zinc-600 font-bold">{name.length}/50</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                    <User className="h-4 w-4" />
                  </span>
                  <Input
                    type="text"
                    required
                    placeholder="Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 50))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Username
                  </Label>
                  <span className="text-[10px] text-zinc-600 font-bold">{username.length}/15</span>
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                    <span className="text-sm font-semibold select-none">@</span>
                  </span>
                  <Input
                    type="text"
                    required
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 15))}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 pl-1">Lowercase letters, numbers, and underscores only</p>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                    Bio
                  </Label>
                  <span className="text-[10px] text-zinc-600 font-bold">{bio.length}/200</span>
                </div>
                <div className="relative">
                  <span className="absolute top-3 left-4 text-zinc-500 z-10">
                    <FileText className="h-4 w-4" />
                  </span>
                  <Textarea
                    placeholder="Write something about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value.slice(0, 200))}
                    rows={3}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 pt-3 pb-3 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900 resize-none min-h-[90px]"
                  />
                </div>
              </div>

              <div className="relative">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Country / Region
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                    <Globe className="h-4 w-4" />
                  </span>
                  <RegionSelect
                    value={country}
                    onValueChange={(val) => setCountry(val || "")}
                    mode="name"
                    placeholder="Select your region"
                    className="pl-12 text-sm font-semibold text-zinc-300 hover:text-white"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={savingProfile}
              className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-6 cursor-pointer"
            >
              {savingProfile ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Profile Changes"
              )}
            </Button>
          </form>
        )}

        {/* PRIVACY & SOCIAL SECTION */}
        {activeSection === "privacy" && (
          <form onSubmit={handleUpdatePrivacy} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Privacy & Social Settings</h2>
              <p className="text-xs text-zinc-500">Configure profile visibility, requests, and manage blocklist</p>
            </div>

            <div className="space-y-6">
              {/* Profile Privacy Dropdown */}
              <div className="relative">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Profile Privacy
                </Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
                    <Shield className="h-4 w-4" />
                  </span>
                  <Select value={profilePrivacy} onValueChange={(val) => setProfilePrivacy(val || "public")}>
                    <SelectTrigger className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 focus:bg-zinc-900 h-12">
                      <SelectValue placeholder="Select Privacy" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-xl">
                      <SelectGroup>
                        <SelectItem value="public" className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2">
                          Public Profile (Anyone can view lists)
                        </SelectItem>
                        <SelectItem value="friends" className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2">
                          Friends Only (Approved friends can view lists)
                        </SelectItem>
                        <SelectItem value="private" className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2">
                          Private Profile (Only you can view lists)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-4 border-t border-zinc-900">
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">Social & Discoverability</h3>
                
                {/* Allow Friend Requests */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white">Allow Friend Requests</span>
                    <span className="text-[10px] text-zinc-500">Enable others to send you friend requests</span>
                  </div>
                  <Checkbox
                    checked={allowFriendRequests}
                    onCheckedChange={(checked) => setAllowFriendRequests(checked === true)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>

                {/* Hide Watchlist */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white">Hide Watchlist</span>
                    <span className="text-[10px] text-zinc-500">Conceal your Watchlist tab from other users</span>
                  </div>
                  <Checkbox
                    checked={hideWatchlist}
                    onCheckedChange={(checked) => setHideWatchlist(checked === true)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>

                {/* Hide Favorites */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white">Hide Favorites</span>
                    <span className="text-[10px] text-zinc-500">Conceal your Favorites tab from other users</span>
                  </div>
                  <Checkbox
                    checked={hideFavorites}
                    onCheckedChange={(checked) => setHideFavorites(checked === true)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>

                {/* Hide Ratings */}
                <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold text-white">Hide Ratings</span>
                    <span className="text-[10px] text-zinc-500">Conceal your Ratings tab from other users</span>
                  </div>
                  <Checkbox
                    checked={hideRatings}
                    onCheckedChange={(checked) => setHideRatings(checked === true)}
                    className="h-5 w-5 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={savingPrivacy}
              className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-4 cursor-pointer"
            >
              {savingPrivacy ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Save Privacy Changes"
              )}
            </Button>

            {/* Blocklist Section */}
            <div className="pt-6 border-t border-zinc-900 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Blocked Users</h3>
              {!blockedUsersList ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              ) : blockedUsersList.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">No users blocked.</p>
              ) : (
                <div className="space-y-2">
                  {blockedUsersList.map((blockedUser) => (
                    <div
                      key={blockedUser.userId}
                      className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/20 border border-zinc-900/60"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-zinc-800">
                          {blockedUser.image && (
                            <AvatarImage src={blockedUser.image} alt={blockedUser.name} className="object-cover" />
                          )}
                          <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs font-bold">
                            {blockedUser.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-bold text-white">{blockedUser.name}</p>
                          <p className="text-[10px] text-zinc-500">@{blockedUser.username}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="xs"
                        variant="destructive"
                        onClick={() => handleUnblock(blockedUser.userId)}
                        className="rounded-lg h-7 px-3 text-[10px] font-bold cursor-pointer"
                      >
                        <UserX className="h-3 w-3 mr-1" />
                        Unblock
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        )}

        {/* SECURITY SECTION */}
        {activeSection === "security" && (
          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Account Security</h2>
              <p className="text-xs text-zinc-500">Change your password. Upon updating, you will be logged out of other devices.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Current Password
                </Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  New Password
                </Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Confirm New Password
                </Label>
                <Input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/50 focus:bg-zinc-900"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={updatingPassword}
              className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-6 cursor-pointer"
            >
              {updatingPassword ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        )}

        {/* DANGER ZONE SECTION */}
        {activeSection === "danger" && (
          <div className="divide-y divide-zinc-900/80">
            {/* CLOSE ACCOUNT SECTION */}
            <form onSubmit={handleCloseAccount} className="space-y-6 pb-10">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-1">Close Account</h2>
                <p className="text-xs text-zinc-500">Temporarily close your account. This logs you out and hides your profile page. All your logged lists, diary entries, ratings, and reviews will be safely preserved. You can reopen your account anytime simply by logging back in.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Enter Password to Confirm Closing Account
                  </Label>
                  <Input
                    type="password"
                    required
                    placeholder="Current Password"
                    value={closePassword}
                    onChange={(e) => setClosePassword(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-zinc-500/30 focus:bg-zinc-900"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={closingAccount}
                className="w-full rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] mt-6 cursor-pointer h-12"
              >
                {closingAccount ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Close My Account"
                )}
              </Button>
            </form>

            {/* DANGER ZONE DELETION */}
            <form onSubmit={handleDeleteAccount} className="space-y-6 pt-10">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-red-500 mb-1">Danger Zone</h2>
                <p className="text-xs text-zinc-500">Delete your profile. This clears your profile information and anonymizes your historical contributions.</p>
              </div>

              <div className="rounded-2xl border border-red-950 bg-red-950/10 p-4 text-sm text-red-400 space-y-2">
                <p className="font-semibold text-xs uppercase tracking-wider text-red-500">Warning: Deletion is permanent</p>
                <p className="text-xs text-red-400/80 leading-relaxed">
                  Your profile details (email, bio, profile image) will be permanently cleared and your username will be randomized to free it up for other film enthusiasts. Your comment authors will appear as <strong className="text-white">[deleted]</strong>. Your ratings, watchlist, and diary records will be safely preserved in the database for continuity but fully anonymized.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    Enter Password to Confirm Deletion
                  </Label>
                  <Input
                    type="password"
                    required
                    placeholder="Current Password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 px-4 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-red-500/30 focus:bg-zinc-900"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={deletingAccount}
                className="w-full rounded-2xl bg-red-950 border border-red-900/50 hover:bg-red-900 text-sm font-semibold text-red-200 transition-all duration-200 active:scale-[0.98] mt-6 cursor-pointer h-12"
              >
                {deletingAccount ? (
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                ) : (
                  "Delete Account"
                )}
              </Button>
            </form>
          </div>
        )}

        {/* IMPORT & EXPORT SECTION */}
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
  const convexProfile = useQuery(api.users.getCurrentUser, isLoggedIn ? {} : "skip");
  const openAuth = useAuthModalStore((state) => state.open);

  if (loadingSession || (isLoggedIn && convexProfile === undefined)) {
    return (
      <div className="grow flex items-center justify-center min-h-[60vh] bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-[60vh] bg-background text-foreground gap-4 text-center px-4">
        <h1 className="text-xl font-bold text-white">Login Required</h1>
        <p className="text-sm text-zinc-400 max-w-sm">You must be logged in to access and customize your account settings and theme preferences.</p>
        <Button onClick={() => openAuth()} className="rounded-2xl px-6 py-5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="grow bg-background text-foreground min-h-[85vh] py-24 px-6 sm:px-12 md:px-16 lg:px-20 max-w-5xl mx-auto w-full transition-colors duration-300">
      <div className="border-b border-zinc-900 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Settings</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Manage your profile, security options, and platform appearance</p>
      </div>

      <SettingsForm convexProfile={convexProfile || null} user={user || {}} />
    </div>
  );
}
