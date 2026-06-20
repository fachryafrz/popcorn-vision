import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SecuritySectionProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  updatingPassword: boolean;
  handleUpdatePassword: (e: React.FormEvent) => void;
}
interface LinkedAccount {
  id: string;
  providerId: string;
  userId: string;
}

export default function SecuritySection({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  updatingPassword,
  handleUpdatePassword,
}: SecuritySectionProps) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [linking, setLinking] = useState(false);
  const [unlinking, setUnlinking] = useState(false);

  const fetchAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const { data, error } = await authClient.listAccounts();
      if (data) {
        setAccounts(data as LinkedAccount[]);
      }
    } catch (err) {
      console.error("Failed to fetch linked accounts:", err);
    } finally {
      setLoadingAccounts(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAccounts();
  }, []);

  const isGoogleLinked = accounts.some(
    (acc: LinkedAccount) => acc.providerId === "google",
  );

  const handleLinkGoogle = async () => {
    setLinking(true);
    try {
      const res = await authClient.linkSocial({
        provider: "google",
        callbackURL: window.location.origin + "/settings",
      });
      if (res?.error) {
        toast.error(res.error.message || "Failed to link Google account");
      }
    } catch (err) {
      toast.error("Failed to link Google account");
    } finally {
      setLinking(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    setUnlinking(true);
    try {
      const res = await authClient.unlinkAccount({
        providerId: "google",
      });
      if (res?.error) {
        toast.error(res.error.message || "Failed to unlink Google account");
      } else {
        toast.success("Google account disconnected successfully");
        fetchAccounts();
      }
    } catch (err) {
      toast.error("Failed to unlink Google account");
    } finally {
      setUnlinking(false);
    }
  };

  const hasPassword = accounts.some(
    (acc: LinkedAccount) => acc.providerId === "credential",
  );

  const isPasswordDisabled = !loadingAccounts && !hasPassword;

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpdatePassword} className="space-y-6">
        <div>
          <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
            Account Security
          </h2>
          <p className="text-xs text-zinc-500">
            Change your password. Upon updating, you will be logged out of other
            devices.
          </p>
          {isPasswordDisabled && (
            <Alert className="mt-4 border-amber-500/20 bg-amber-500/10 text-amber-500 [&>svg]:text-amber-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="font-semibold text-white">Password Change Disabled</AlertTitle>
              <AlertDescription className="text-xs text-zinc-400">
                You are logged in via a social provider. Changing password is only supported for email & password accounts.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Current Password
            </Label>
            <Input
              type="password"
              required={!isPasswordDisabled}
              disabled={isPasswordDisabled}
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="placeholder-zinc-650 focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              New Password
            </Label>
            <Input
              type="password"
              required={!isPasswordDisabled}
              disabled={isPasswordDisabled}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="placeholder-zinc-655 focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Confirm New Password
            </Label>
            <Input
              type="password"
              required={!isPasswordDisabled}
              disabled={isPasswordDisabled}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="placeholder-zinc-655 focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-6 text-left text-sm text-white outline-hidden transition-all focus:bg-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={updatingPassword || isPasswordDisabled}
          className="to-primary hover:to-primary hover:from-primary from-primary mt-6 w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updatingPassword ? (
            <Loader2 className="mx-auto h-5 w-5 animate-spin" />
          ) : (
            "Change Password"
          )}
        </Button>
      </form>

      <div className="mt-8 border-t border-zinc-900 pt-8">
        <div>
          <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
            Linked Accounts
          </h2>
          <p className="text-xs text-zinc-500">
            Connect your social accounts to sign in with them.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.35 11.1H12V13.8H17.38C17.14 15.08 16.42 16.17 15.34 16.9V19.47H18.64C20.57 17.69 21.68 15.07 21.68 12C21.68 11.39 21.62 10.8 21.51 10.21L21.35 11.1Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 20.58C14.43 20.58 16.47 19.78 17.96 18.4L14.66 15.83C13.76 16.43 12.59 16.8 11.36 16.8C8.99 16.8 6.98 15.2 6.26 13.04H2.86V15.7C4.34 18.64 7.4 20.58 10.9 20.58H12Z"
                    fill="#34A853"
                  />
                  <path
                    d="M6.9 13.1C6.72 12.56 6.62 11.99 6.62 11.4C6.62 10.81 6.72 10.24 6.9 9.7V7.04H2.86C2.26 8.24 1.92 9.58 1.92 11.4C1.92 13.22 2.26 14.56 2.86 15.76L6.9 13.1Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.22C13.32 5.22 14.5 5.67 15.44 6.57L18.02 3.99C16.47 2.5 14.43 1.7 12 1.7C8.5 1.7 5.44 3.64 3.96 6.58L8 9.74C8.72 7.58 10.73 5.98 13.1 5.98L12 5.22Z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">Google</p>
                <p className="text-xs text-zinc-500">
                  {loadingAccounts
                    ? "Checking status..."
                    : isGoogleLinked
                      ? "Connected to Google"
                      : "Not connected"}
                </p>
              </div>
            </div>

            {loadingAccounts ? (
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            ) : isGoogleLinked ? (
              <Button
                type="button"
                variant="outline"
                disabled={unlinking}
                onClick={handleUnlinkGoogle}
                className="cursor-pointer rounded-xl border-red-500/20 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300"
              >
                {unlinking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Disconnect"
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled={linking}
                onClick={handleLinkGoogle}
                className="cursor-pointer rounded-xl border-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-900"
              >
                {linking ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Connect"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
