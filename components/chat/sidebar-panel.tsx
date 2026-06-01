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
        "w-full sm:w-[320px] shrink-0 border-r border-zinc-900 bg-zinc-950 flex flex-col justify-between absolute sm:relative inset-y-0 left-0 transition-transform duration-300 z-30",
        !isSidebarOpen && "-translate-x-full sm:translate-x-0"
      )}
    >
      <div className="flex flex-col grow overflow-hidden">
        {/* Header Controls */}
        <div className="p-4 border-b border-zinc-900 flex items-center justify-between">
          <h1 className="text-base font-black tracking-tight text-white flex items-center gap-2 select-none">
            <Users className="h-5 w-5 text-blue-500" />
            Friends Chat
          </h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
              className="h-8 w-8 rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white cursor-pointer"
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
              className="h-8 w-8 rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white cursor-pointer"
              title="Create Group Chat"
            >
              <Users className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsNewChatOpen(true)}
              className="h-8 w-8 rounded-xl border-zinc-800 bg-zinc-900/30 text-zinc-300 hover:text-white cursor-pointer"
              title="New Chat Session"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Conversations */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
          {!chats ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Syncing chats...
              </span>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Users className="h-10 w-10 text-zinc-800 mx-auto" />
              <p className="text-zinc-500 text-xs font-semibold">
                No active conversations found
              </p>
              <p className="text-[10px] text-zinc-650">
                Click &quot;+&quot; or the chat icon to start talking to friends!
              </p>
            </div>
          ) : (
            chats.map((c) => {
              const isActive = c.chatId === selectedChatId;
              const isGroup = c.type === "group";
              const displayTitle = isGroup ? c.name : c.friend?.name;
              const displaySubtitle = isGroup ? "Group Chat" : `@${c.friend?.username}`;
              const hasUnread = c.unreadCount > 0;

              return (
                <div
                  key={c.chatId}
                  onClick={() => {
                    setSelectedChatId(c.chatId);
                    setIsSidebarOpen(false); // Close sidebar on mobile
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border border-transparent select-none",
                    isActive
                      ? "bg-blue-600/10 border-blue-500/20 text-white"
                      : "hover:bg-zinc-900/40 text-zinc-300 hover:text-white"
                  )}
                >
                  {/* Avatar Group */}
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10 border border-zinc-800">
                      {isGroup ? (
                        c.image ? (
                          <AvatarImage src={c.image} alt={c.name} className="object-cover" />
                        ) : null
                      ) : c.friend?.image ? (
                        <AvatarImage
                          src={c.friend.image}
                          alt={c.friend.name}
                          className="object-cover"
                        />
                      ) : null}
                      <AvatarFallback className="bg-zinc-900 text-white font-bold text-xs">
                        {isGroup ? (
                          <Users className="h-4 w-4 text-zinc-400" />
                        ) : (
                          c.friend?.name.charAt(0).toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Chat Item Titles */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-bold truncate block",
                          hasUnread && "font-black text-white"
                        )}
                      >
                        {displayTitle}
                      </span>
                      {c.lastMessage && (
                        <span className="text-[9px] text-zinc-550 shrink-0">
                          {moment(c.lastMessage.createdAt).format("h:mm A")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      {c.isTyping ? (
                        <span className="text-[10px] text-blue-400 font-bold animate-pulse truncate block max-w-[150px]">
                          {c.type === "group" ? `${c.typingName} is typing...` : "typing..."}
                        </span>
                      ) : (
                        <span className="text-[10px] text-zinc-500 truncate block max-w-[150px]">
                          {c.lastMessage ? c.lastMessage.content : displaySubtitle}
                        </span>
                      )}
                      {hasUnread && (
                        <span className="h-4 min-w-4 px-1 rounded-full bg-blue-600 text-[8px] font-black text-white flex items-center justify-center shrink-0">
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
