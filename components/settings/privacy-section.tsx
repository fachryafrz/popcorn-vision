import React from "react";
import { Shield, Loader2, UserX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlockedUser } from "./types";

interface PrivacySectionProps {
  profilePrivacy: string;
  setProfilePrivacy: (privacy: string) => void;
  messagePrivacy: string;
  setMessagePrivacy: (privacy: string) => void;
  allowFriendRequests: boolean;
  setAllowFriendRequests: (val: boolean) => void;
  hideWatchlist: boolean;
  setHideWatchlist: (val: boolean) => void;
  hideFavorites: boolean;
  setHideFavorites: (val: boolean) => void;
  hideRatings: boolean;
  setHideRatings: (val: boolean) => void;
  readReceiptsEnabled: boolean;
  setReadReceiptsEnabled: (val: boolean) => void;
  savingPrivacy: boolean;
  handleUpdatePrivacy: (e: React.FormEvent) => void;
  blockedUsersList: BlockedUser[] | undefined;
  handleUnblock: (targetUserId: string) => void;
}

export default function PrivacySection({
  profilePrivacy,
  setProfilePrivacy,
  messagePrivacy,
  setMessagePrivacy,
  allowFriendRequests,
  setAllowFriendRequests,
  hideWatchlist,
  setHideWatchlist,
  hideFavorites,
  setHideFavorites,
  hideRatings,
  setHideRatings,
  readReceiptsEnabled,
  setReadReceiptsEnabled,
  savingPrivacy,
  handleUpdatePrivacy,
  blockedUsersList,
  handleUnblock,
}: PrivacySectionProps) {
  return (
    <form onSubmit={handleUpdatePrivacy} className="space-y-6">
      <div>
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
          Privacy & Social Settings
        </h2>
        <p className="text-xs text-zinc-500">
          Configure profile visibility, requests, and manage blocklist
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Privacy Dropdown */}
        <div className="relative">
          <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Profile Privacy
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
              <Shield className="h-4 w-4" />
            </span>
            <Select
              value={profilePrivacy}
              onValueChange={(val) => setProfilePrivacy(val || "public")}
            >
              <SelectTrigger className="focus:border-primary/50 h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pr-4 pl-12 text-sm text-white focus:bg-zinc-900">
                <SelectValue placeholder="Select Privacy" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-zinc-800 bg-zinc-900 text-white shadow-xl">
                <SelectGroup>
                  <SelectItem
                    value="public"
                    className="hover:bg-zinc-850 cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:text-white"
                  >
                    Public Profile (Anyone can view lists)
                  </SelectItem>
                  <SelectItem
                    value="friends"
                    className="hover:bg-zinc-850 cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:text-white"
                  >
                    Friends Only (Approved friends can view lists)
                  </SelectItem>
                  <SelectItem
                    value="private"
                    className="hover:bg-zinc-850 cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:text-white"
                  >
                    Private Profile (Only you can view lists)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Direct Messages Privacy Select */}
        <div className="relative">
          <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Direct Messages Privacy
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
              <Shield className="h-4 w-4" />
            </span>
            <Select
              value={messagePrivacy}
              onValueChange={(val) => setMessagePrivacy(val || "friends")}
            >
              <SelectTrigger className="focus:border-primary/50 h-12 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pr-4 pl-12 text-sm text-white focus:bg-zinc-900">
                <SelectValue placeholder="Select Message Privacy" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-zinc-800 bg-zinc-900 text-white shadow-xl">
                <SelectGroup>
                  <SelectItem
                    value="friends"
                    className="hover:bg-zinc-850 cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:text-white"
                  >
                    Friends Only (Only approved friends can DM)
                  </SelectItem>
                  <SelectItem
                    value="disabled"
                    className="hover:bg-zinc-850 cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:text-white"
                  >
                    Disable Messages (Do not allow DMs)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 border-t border-zinc-900 pt-4">
          <h3 className="mb-2 text-left text-xs font-black tracking-wider text-zinc-400 uppercase">
            Social & Discoverability
          </h3>

          {/* Allow Friend Requests */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">
                Allow Friend Requests
              </span>
              <span className="text-[10px] text-zinc-500">
                Enable others to send you friend requests
              </span>
            </div>
            <Checkbox
              checked={allowFriendRequests}
              onCheckedChange={(checked) =>
                setAllowFriendRequests(checked === true)
              }
              className="animate-in h-5 w-5 cursor-pointer duration-200"
            />
          </div>

          {/* Hide Watchlist */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">
                Hide Watchlist
              </span>
              <span className="text-[10px] text-zinc-500">
                Conceal your Watchlist tab from other users
              </span>
            </div>
            <Checkbox
              checked={hideWatchlist}
              onCheckedChange={(checked) => setHideWatchlist(checked === true)}
              className="animate-in h-5 w-5 cursor-pointer duration-200"
            />
          </div>

          {/* Hide Favorites */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">
                Hide Favorites
              </span>
              <span className="text-[10px] text-zinc-500">
                Conceal your Favorites tab from other users
              </span>
            </div>
            <Checkbox
              checked={hideFavorites}
              onCheckedChange={(checked) => setHideFavorites(checked === true)}
              className="animate-in h-5 w-5 cursor-pointer duration-200"
            />
          </div>

          {/* Hide Ratings */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">Hide Ratings</span>
              <span className="text-[10px] text-zinc-500">
                Conceal your Ratings tab from other users
              </span>
            </div>
            <Checkbox
              checked={hideRatings}
              onCheckedChange={(checked) => setHideRatings(checked === true)}
              className="animate-in h-5 w-5 cursor-pointer duration-200"
            />
          </div>

          {/* Read Receipts toggles */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">
                Show Read Receipts
              </span>
              <span className="text-[10px] text-zinc-500">
                Allow others to see when you have read their messages
              </span>
            </div>
            <Checkbox
              checked={readReceiptsEnabled}
              onCheckedChange={(checked) =>
                setReadReceiptsEnabled(checked === true)
              }
              className="animate-in h-5 w-5 cursor-pointer duration-200"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={savingPrivacy}
        className="to-primary hover:to-primary hover:from-primary from-primary mt-4 w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]"
      >
        {savingPrivacy ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : (
          "Save Privacy Changes"
        )}
      </Button>

      {/* Blocklist Section */}
      <div className="space-y-4 border-t border-zinc-900 pt-6">
        <h3 className="text-left text-xs font-black tracking-wider text-zinc-400 uppercase">
          Blocked Users
        </h3>
        {!blockedUsersList ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="text-primary h-4 w-4 animate-spin" />
          </div>
        ) : blockedUsersList.length === 0 ? (
          <p className="text-left text-xs text-zinc-500 italic">
            No users blocked.
          </p>
        ) : (
          <div className="space-y-2">
            {blockedUsersList.map((blockedUser) => (
              <div
                key={blockedUser.userId}
                className="flex items-center justify-between rounded-2xl border border-zinc-900/60 bg-zinc-900/20 p-3.5"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border border-zinc-800">
                    {blockedUser.image && (
                      <AvatarImage
                        src={blockedUser.image}
                        alt={blockedUser.name}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
                      {blockedUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">
                      {blockedUser.name}
                    </p>
                    <p className="text-zinc-550 text-[10px]">
                      @{blockedUser.username}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleUnblock(blockedUser.userId)}
                  className="h-7 cursor-pointer rounded-lg border border-red-900/30 bg-red-950 px-3 text-[10px] font-bold text-red-400 hover:bg-red-900 hover:text-white"
                >
                  <UserX className="mr-1 h-3 w-3" />
                  Unblock
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
