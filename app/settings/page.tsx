"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { User, Lock, Trash2, Loader2, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useAuthModalStore } from "@/lib/auth-modal-store";

const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Indonesia",
  "Singapore",
  "India",
  "Brazil",
  "Mexico",
  "Other"
];

interface SettingsFormProps {
  convexProfile: {
    name: string;
    username: string;
    bio?: string;
    country?: string;
  } | null;
  user: {
    name?: string;
    username?: string | null;
    email?: string;
  };
}

function SettingsForm({ convexProfile, user }: SettingsFormProps) {
  const router = useRouter();
  const updateProfile = useMutation(api.users.updateCurrentUserProfile);
  const deleteConvexAccountData = useMutation(api.users.deleteCurrentUserAccountData);

  // Tabs
  const [activeSection, setActiveSection] = useState<"profile" | "security" | "danger">("profile");

  // Profile fields state - initialized directly from props to avoid useEffect warnings
  const [name, setName] = useState(convexProfile?.name || user?.name || "");
  const [username, setUsername] = useState(convexProfile?.username || user?.username || "");
  const [bio, setBio] = useState(convexProfile?.bio || "");
  const [country, setCountry] = useState(convexProfile?.country || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Delete account fields state
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

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

    if (!confirm("Are you absolutely sure you want to delete your account? This action is permanent and cannot be undone.")) {
      return;
    }

    setDeletingAccount(true);

    try {
      // 1. Delete user from Better Auth
      const result = await authClient.deleteUser({
        password: deletePassword,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to delete account from authenticator");
      }

      // 2. Remove user data from Convex tables
      await deleteConvexAccountData({});

      toast.success("Your account has been deleted. Goodbye!");
      router.push("/");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Account deletion failed. Verify your password.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar Nav */}
      <div className="md:col-span-1 flex flex-col gap-2">
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
      </div>

      {/* Content Box */}
      <div className="md:col-span-3 bg-zinc-900/10 border border-zinc-900 rounded-3xl p-6 sm:p-8 backdrop-blur-md">
        {/* PROFILE SECTION */}
        {activeSection === "profile" && (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white mb-1">Profile Details</h2>
              <p className="text-xs text-zinc-500">Update your public credentials, region, and custom bio</p>
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
                  <Select value={country} onValueChange={(val) => setCountry(val || "")}>
                    <SelectTrigger className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 focus:bg-zinc-900 h-12">
                      <SelectValue placeholder="Select your region" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-xl">
                      <SelectGroup>
                        {COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c} className="hover:bg-zinc-800 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2">
                            {c}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
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
          <form onSubmit={handleDeleteAccount} className="space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-red-500 mb-1">Danger Zone</h2>
              <p className="text-xs text-zinc-500">Permanently delete your user profile and all recorded database actions (ratings, watchlist, and favorites).</p>
            </div>

            <div className="rounded-2xl border border-red-900/30 bg-red-950/10 p-4 text-sm text-red-400 space-y-2">
              <p className="font-semibold">Warning: This action is irreversible.</p>
              <p className="text-xs text-red-500/80">All watchlist selections, rating scores, favorites list entries, and social statistics associated with this user ID will be permanently removed.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                  Enter Your Password to Confirm Deletion
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
              className="w-full rounded-2xl bg-red-900 hover:bg-red-800 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] mt-6 cursor-pointer"
            >
              {deletingAccount ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Permanently Delete Account"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const loadingSession = session.isPending;
  const user = session.data?.user;

  const openAuth = useAuthModalStore((state) => state.open);

  // Fetch current user details from Convex
  const convexProfile = useQuery(api.users.getCurrentUser);

  if (loadingSession || (isLoggedIn && convexProfile === undefined)) {
    return (
      <div className="grow flex items-center justify-center min-h-[60vh] bg-zinc-950 text-white">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-[60vh] bg-zinc-950 text-white px-6 text-center">
        <User className="h-16 w-16 text-zinc-700 mb-4" />
        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Settings</h1>
        <p className="text-zinc-400 text-sm max-w-md mb-6">
          Sign in to manage and edit your profile settings.
        </p>
        <Button
          onClick={openAuth}
          className="rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-6 text-base cursor-pointer"
        >
          Sign In / Register
        </Button>
      </div>
    );
  }

  return (
    <div className="grow bg-zinc-950 text-white min-h-[85vh] py-24 px-6 sm:px-12 md:px-16 lg:px-20 max-w-5xl mx-auto w-full">
      <div className="border-b border-zinc-900 pb-6 mb-8">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Settings</h1>
        <p className="text-zinc-500 text-xs mt-0.5">Manage your profile, security options, and platform details</p>
      </div>

      <SettingsForm convexProfile={convexProfile!} user={user!} />
    </div>
  );
}
