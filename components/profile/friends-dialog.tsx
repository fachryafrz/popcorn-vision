"use client";

import React from "react";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ProfileFriend } from "./types";

interface FriendsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  friendCount: number;
  friends: ProfileFriend[] | undefined;
}

export function FriendsDialog({
  isOpen,
  onOpenChange,
  friendCount,
  friends,
}: FriendsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-left">
            <Users className="h-5 w-5 text-primary" />
            Friends ({friendCount})
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto -mx-6 px-6 flex-1">
          {friends && friends.length > 0 ? (
            <div className="space-y-1">
              {friends.map((friend) => (
                <Link
                  key={friend.userId}
                  href={`/user/${friend.username}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900/50 transition-colors group/friend"
                >
                  <Avatar className="h-10 w-10 border-2 border-zinc-800 group-hover/friend:border-primary/50 transition-colors shrink-0">
                    {friend.image && (
                      <AvatarImage src={friend.image} alt={friend.name} className="object-cover" />
                    )}
                    <AvatarFallback className="bg-zinc-900 text-zinc-400 text-sm font-bold">
                      {friend.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-sm font-bold text-white truncate group-hover/friend:text-primary transition-colors">
                      {friend.name}
                    </p>
                    <p className="text-xs text-zinc-550 truncate">@{friend.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-10 w-10 text-zinc-700 mb-3" />
              <p className="text-sm text-zinc-500 font-medium">No friends yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
