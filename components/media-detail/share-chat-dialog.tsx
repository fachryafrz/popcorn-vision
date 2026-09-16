"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Users, ChevronRight } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

export interface ChatListItem {
  chatId: Id<"chats">;
  type: "private" | "group";
  name?: string;
  image?: string;
  friend?: {
    name: string;
    username: string;
    image?: string;
  } | null;
}

interface ShareChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chatsList: ChatListItem[] | undefined;
  onShareToChat: (chatId: Id<"chats">, chatTitle: string) => void;
}

export default function ShareChatDialog({
  isOpen,
  onOpenChange,
  chatsList,
  onShareToChat,
}: ShareChatDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
            Share with Friends
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-left">
          <h3 className="text-zinc-550 text-xs font-black tracking-wider uppercase">
            Select Chat
          </h3>
          <div className="max-h-60 scrollbar-thin space-y-1.5 overflow-y-auto pr-1">
            {!chatsList ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="text-primary h-5 w-5 animate-spin" />
              </div>
            ) : chatsList.length === 0 ? (
              <p className="py-4 text-center text-xs text-zinc-500 italic">
                No active chats found. Open the chat tab to start conversations
                with friends!
              </p>
            ) : (
              chatsList.map((c) => {
                const isGroup = c.type === "group";
                const chatTitle = isGroup
                  ? (c.name ?? "Group")
                  : (c.friend?.name ?? "Friend");
                return (
                  <div
                    key={c.chatId}
                    onClick={() => onShareToChat(c.chatId, chatTitle)}
                    className="hover:border-zinc-850 flex cursor-pointer items-center justify-between rounded-2xl border border-transparent p-3 text-xs transition-all hover:bg-zinc-900/60"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-zinc-800">
                        {isGroup ? (
                          c.image ? (
                            <AvatarImage
                              src={c.image}
                              alt={c.name ?? "Group"}
                              className="object-cover"
                            />
                          ) : null
                        ) : c.friend?.image ? (
                          <AvatarImage
                            src={c.friend.image}
                            alt={c.friend.name}
                            className="object-cover"
                          />
                        ) : null}
                        <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-300">
                          {isGroup ? (
                            <Users className="h-4 w-4 text-zinc-400" />
                          ) : (
                            chatTitle.charAt(0).toUpperCase()
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="block font-bold text-white">
                          {chatTitle}
                        </span>
                        <span className="mt-0.5 block text-[10px] text-zinc-500">
                          {isGroup ? "Group Chat" : `@${c.friend?.username}`}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-500" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
