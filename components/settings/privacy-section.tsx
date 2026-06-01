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
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">
          Privacy & Social Settings
        </h2>
        <p className="text-xs text-zinc-500">
          Configure profile visibility, requests, and manage blocklist
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Privacy Dropdown */}
        <div className="relative">
          <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
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
                  <SelectItem
                    value="public"
                    className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2"
                  >
                    Public Profile (Anyone can view lists)
                  </SelectItem>
                  <SelectItem
                    value="friends"
                    className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2"
                  >
                    Friends Only (Approved friends can view lists)
                  </SelectItem>
                  <SelectItem
                    value="private"
                    className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2"
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
          <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
            Direct Messages Privacy
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
              <Shield className="h-4 w-4" />
            </span>
            <Select value={messagePrivacy} onValueChange={(val) => setMessagePrivacy(val || "friends")}>
              <SelectTrigger className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white focus:border-blue-500/50 focus:bg-zinc-900 h-12">
                <SelectValue placeholder="Select Message Privacy" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-xl">
                <SelectGroup>
                  <SelectItem
                    value="friends"
                    className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2"
                  >
                    Friends Only (Only approved friends can DM)
                  </SelectItem>
                  <SelectItem
                    value="disabled"
                    className="hover:bg-zinc-850 rounded-xl cursor-pointer text-zinc-300 hover:text-white px-3 py-2"
                  >
                    Disable Messages (Do not allow DMs)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-4 pt-4 border-t border-zinc-900">
          <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2 text-left">
            Social & Discoverability
          </h3>

          {/* Allow Friend Requests */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">Allow Friend Requests</span>
              <span className="text-[10px] text-zinc-500">
                Enable others to send you friend requests
              </span>
            </div>
            <Checkbox
              checked={allowFriendRequests}
              onCheckedChange={(checked) => setAllowFriendRequests(checked === true)}
              className="h-5 w-5 cursor-pointer animate-in duration-200"
            />
          </div>

          {/* Hide Watchlist */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">Hide Watchlist</span>
              <span className="text-[10px] text-zinc-500">
                Conceal your Watchlist tab from other users
              </span>
            </div>
            <Checkbox
              checked={hideWatchlist}
              onCheckedChange={(checked) => setHideWatchlist(checked === true)}
              className="h-5 w-5 cursor-pointer animate-in duration-200"
            />
          </div>

          {/* Hide Favorites */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">Hide Favorites</span>
              <span className="text-[10px] text-zinc-500">
                Conceal your Favorites tab from other users
              </span>
            </div>
            <Checkbox
              checked={hideFavorites}
              onCheckedChange={(checked) => setHideFavorites(checked === true)}
              className="h-5 w-5 cursor-pointer animate-in duration-200"
            />
          </div>

          {/* Hide Ratings */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">Hide Ratings</span>
              <span className="text-[10px] text-zinc-500">
                Conceal your Ratings tab from other users
              </span>
            </div>
            <Checkbox
              checked={hideRatings}
              onCheckedChange={(checked) => setHideRatings(checked === true)}
              className="h-5 w-5 cursor-pointer animate-in duration-200"
            />
          </div>

          {/* Read Receipts toggles */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/80">
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-xs font-bold text-white">Show Read Receipts</span>
              <span className="text-[10px] text-zinc-500">
                Allow others to see when you have read their messages
              </span>
            </div>
            <Checkbox
              checked={readReceiptsEnabled}
              onCheckedChange={(checked) => setReadReceiptsEnabled(checked === true)}
              className="h-5 w-5 cursor-pointer animate-in duration-200"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={savingPrivacy}
        className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-4 cursor-pointer"
      >
        {savingPrivacy ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Privacy Changes"}
      </Button>

      {/* Blocklist Section */}
      <div className="pt-6 border-t border-zinc-900 space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 text-left">
          Blocked Users
        </h3>
        {!blockedUsersList ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          </div>
        ) : blockedUsersList.length === 0 ? (
          <p className="text-xs text-zinc-500 italic text-left">No users blocked.</p>
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
                      <AvatarImage
                        src={blockedUser.image}
                        alt={blockedUser.name}
                        className="object-cover"
                      />
                    )}
                    <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs font-bold">
                      {blockedUser.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white">{blockedUser.name}</p>
                    <p className="text-[10px] text-zinc-550">@{blockedUser.username}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleUnblock(blockedUser.userId)}
                  className="rounded-lg h-7 px-3 text-[10px] font-bold cursor-pointer bg-red-950 border border-red-900/30 text-red-400 hover:bg-red-900 hover:text-white"
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
  );
}
