"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UserPlus, UserCheck, UserX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";
import { SearchUserResult } from "./types";

interface UserCardProps {
  user: SearchUserResult;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

export function UserCard({ user, onAuthRequired, isLoggedIn }: UserCardProps) {
  const [friendLoading, setFriendLoading] = useState(false);

  const sendFriendRequest = useMutation(api.social.sendFriendRequest);
  const cancelFriendRequest = useMutation(api.social.cancelFriendRequest);
  const acceptFriendRequest = useMutation(api.social.acceptFriendRequest);
  const removeFriend = useMutation(api.social.removeFriend);

  const handleFriendAction = async () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    setFriendLoading(true);
    try {
      if (user.friendshipStatus === "none") {
        await sendFriendRequest({ targetUserId: user.userId });
        toast.success("Friend request sent!");
      } else if (user.friendshipStatus === "request_sent") {
        await cancelFriendRequest({ targetUserId: user.userId });
        toast.success("Friend request cancelled.");
      } else if (user.friendshipStatus === "request_received") {
        await acceptFriendRequest({ targetUserId: user.userId });
        toast.success("Friend request accepted!");
      } else if (user.friendshipStatus === "friends") {
        if (confirm(`Are you sure you want to remove ${user.name} from friends?`)) {
          await removeFriend({ targetUserId: user.userId });
          toast.success("Friend removed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Friend action failed.");
    } finally {
      setFriendLoading(false);
    }
  };

  // Determine Friend Button style & content
  let friendLabel = "Add Friend";
  let FriendIcon = UserPlus;
  let friendVariant: "default" | "secondary" | "outline" | "destructive" = "outline";

  if (user.friendshipStatus === "request_sent") {
    friendLabel = "Cancel Request";
    FriendIcon = UserX;
    friendVariant = "secondary";
  } else if (user.friendshipStatus === "request_received") {
    friendLabel = "Accept Request";
    FriendIcon = UserCheck;
    friendVariant = "default";
  } else if (user.friendshipStatus === "friends") {
    friendLabel = "Friends";
    FriendIcon = UserCheck;
    friendVariant = "outline";
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg hover:shadow-xl">
      <div>
        {/* User Info */}
        <div className="flex items-start gap-4 mb-4">
          <Link href={`/@/${user.username}`} prefetch={false} className="cursor-pointer">
            <Avatar className="h-14 w-14 border border-zinc-800 ring-2 ring-transparent group-hover:ring-zinc-700/50 transition-all duration-300">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name} className="object-cover" />
              )}
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-lg font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/@/${user.username}`} prefetch={false} className="group-hover:text-white transition-colors cursor-pointer block">
              <h3 className="font-bold text-white text-base truncate leading-snug">{user.name}</h3>
            </Link>
            <p className="text-zinc-550 text-xs truncate block">@{user.username}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-400 font-semibold">
              <span className="flex items-center gap-1">
                <span className="text-zinc-200">{user.friendCount}</span> friends
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio ? (
          <p className="text-zinc-400 text-xs line-clamp-2 mb-5 min-h-10 leading-relaxed text-left">
            {user.bio}
          </p>
        ) : (
          <p className="text-zinc-600 text-xs italic mb-5 min-h-10 leading-relaxed text-left">
            No bio yet.
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Button
          size="sm"
          variant={friendVariant}
          disabled={friendLoading}
          onClick={handleFriendAction}
          className="rounded-xl h-9 w-full text-xs font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          {friendLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <FriendIcon className="h-3.5 w-3.5 mr-1" />
              {friendLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
