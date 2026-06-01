import { useRouter } from "next/navigation";
import { Users, Home, Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import { ChatItem } from "./types";
import { Id } from "@/convex/_generated/dataModel";

interface SidebarPanelProps {
  chats: ChatItem[] | undefined;
  selectedChatId: Id<"chats"> | null;
  setSelectedChatId: (id: Id<"chats"> | null) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  setIsCreateGroupOpen: (open: boolean) => void;
  setIsNewChatOpen: (open: boolean) => void;
  setSelectedInvitedUsers: (users: Set<string>) => void;
}

export default function SidebarPanel({
  chats,
  selectedChatId,
  setSelectedChatId,
  isSidebarOpen,
  setIsSidebarOpen,
  setIsCreateGroupOpen,
  setIsNewChatOpen,
  setSelectedInvitedUsers,
}: SidebarPanelProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "absolute inset-y-0 left-0 z-30 flex w-full shrink-0 flex-col justify-between border-r border-zinc-900 bg-zinc-950 transition-transform duration-300 sm:relative sm:w-[320px]",
        !isSidebarOpen && "-translate-x-full sm:translate-x-0",
      )}
    >
      <div className="flex grow flex-col overflow-hidden">
        {/* Header Controls */}
        <div className="flex items-center justify-between border-b border-zinc-900 p-4">
          <h1 className="flex items-center gap-2 text-base font-black tracking-tight text-white select-none">
            <Users className="h-5 w-5 text-blue-500" />
            Friends Chat
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
              className="h-8 w-8 cursor-pointer rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white"
              title="Back to Home"
            >
              <Home className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSelectedInvitedUsers(new Set());
                setIsCreateGroupOpen(true);
              }}
              className="h-8 w-8 cursor-pointer rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white"
              title="Create Group Chat"
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsNewChatOpen(true)}
              className="h-8 w-8 cursor-pointer rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white"
              title="New Chat Session"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Conversations */}
        <div className="flex-1 scrollbar-thin space-y-1 overflow-y-auto p-2">
          {!chats ? (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
                Syncing chats...
              </span>
            </div>
          ) : chats.length === 0 ? (
            <div className="space-y-2 px-4 py-12 text-center">
              <Users className="mx-auto h-10 w-10 text-zinc-800" />
              <p className="text-xs font-semibold text-zinc-500">
                No active conversations found
              </p>
              <p className="text-zinc-650 text-[10px]">
                Click &quot;+&quot; or the chat icon to start talking to
                friends!
              </p>
            </div>
          ) : (
            chats.map((c) => {
              const isActive = c.chatId === selectedChatId;
              const isGroup = c.type === "group";
              const displayTitle = isGroup ? c.name : c.friend?.name;
              const displaySubtitle = isGroup
                ? "Group Chat"
                : `@${c.friend?.username}`;
              const hasUnread = c.unreadCount > 0;

              return (
                <div
                  key={c.chatId}
                  onClick={() => {
                    setSelectedChatId(c.chatId);
                    setIsSidebarOpen(false); // Close sidebar on mobile
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-3 transition-all select-none",
                    isActive
                      ? "border-blue-500/20 bg-blue-600/10 text-white"
                      : "text-zinc-300 hover:bg-zinc-900/40 hover:text-white",
                  )}
                >
                  {/* Avatar Group */}
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 border border-zinc-800">
                      {isGroup ? (
                        c.image ? (
                          <AvatarImage
                            src={c.image}
                            alt={c.name}
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
                      <AvatarFallback className="bg-zinc-900 text-xs font-bold text-white">
                        {isGroup ? (
                          <Users className="h-4 w-4 text-zinc-400" />
                        ) : (
                          c.friend?.name.charAt(0).toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Chat Item Titles */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "block truncate text-xs font-bold",
                          hasUnread && "font-black text-white",
                        )}
                      >
                        {displayTitle}
                      </span>
                      {c.lastMessage && (
                        <span className="text-zinc-550 shrink-0 text-[9px]">
                          {moment(c.lastMessage.createdAt).format("h:mm A")}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center justify-between">
                      {c.isTyping ? (
                        <span className="block max-w-[150px] animate-pulse truncate text-[10px] font-bold text-blue-400">
                          {c.type === "group"
                            ? `${c.typingName} is typing...`
                            : "typing..."}
                        </span>
                      ) : (
                        <span className="block max-w-[150px] truncate text-[10px] text-zinc-500">
                          {c.lastMessage
                            ? c.lastMessage.content
                            : displaySubtitle}
                        </span>
                      )}
                      {hasUnread && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-blue-600 px-1 text-[8px] font-black text-white">
                          {c.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
