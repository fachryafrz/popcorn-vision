import React from "react";
import { useRouter } from "next/navigation";
import {
  Send,
  Search,
  Smile,
  X,
  Check,
  CheckCheck,
  Loader2,
  Users,
  Info,
  Film,
  Bookmark,
  ChevronRight,
  Grid,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import moment from "moment";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { ChatItem, ChatMessage, ChatMember } from "./types";
import { Id } from "@/convex/_generated/dataModel";

interface ChatWorkspaceProps {
  selectedChatId: Id<"chats"> | null;
  activeChat: ChatItem | null;
  currentUserId: string;
  activeChatMessages: ChatMessage[] | undefined;
  activeChatMembers: ChatMember[] | undefined;
  activeChatTyping: string[] | undefined;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMessages: ChatMessage[];
  messageText: string;
  setMessageText: React.Dispatch<React.SetStateAction<string>>;
  handleSendMessage: (e: React.FormEvent) => void;
  handleTyping: () => void;
  setIsGIFPickerOpen: (open: boolean) => void;
  showRightPanel: boolean;
  setShowRightPanel: (show: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  editingMessageId: Id<"messages"> | null;
  setEditingMessageId: (id: Id<"messages"> | null) => void;
  editingText: string;
  setEditingText: (text: string) => void;
  handleUpdateMessage: (id: Id<"messages">) => void;
  messageEndRef: React.RefObject<HTMLDivElement | null>;
  activeContextMenuMessageId: string | null;
  setActiveContextMenuMessageId: (id: string | null) => void;
}

export default function ChatWorkspace({
  selectedChatId,
  activeChat,
  currentUserId,
  activeChatMessages,
  activeChatMembers,
  activeChatTyping,
  searchQuery,
  setSearchQuery,
  filteredMessages,
  messageText,
  setMessageText,
  handleSendMessage,
  handleTyping,
  setIsGIFPickerOpen,
  showRightPanel,
  setShowRightPanel,
  setIsSidebarOpen,
  editingMessageId,
  setEditingMessageId,
  editingText,
  setEditingText,
  handleUpdateMessage,
  messageEndRef,
  activeContextMenuMessageId,
  setActiveContextMenuMessageId,
}: ChatWorkspaceProps) {
  const router = useRouter();

  if (!selectedChatId || !activeChat) {
    return (
      <div className="grow flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-650 select-none shadow-xl">
          <Users className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-lg font-black text-white">POVI Chat</h2>
          <p className="text-zinc-550 text-xs max-w-sm mt-1">
            Chat in real-time with movie friends! Share lists, DMs, react with GIFs, and verify active streaming providers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-between overflow-hidden bg-zinc-950/20">
      {/* Header controls of active room */}
      <div className="p-4 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
            className="sm:hidden h-8 w-8 text-zinc-400 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          <div className="relative">
            <Avatar className="h-9 w-9 border border-zinc-800 shrink-0">
              {activeChat.type === "group" ? (
                activeChat.image ? (
                  <AvatarImage src={activeChat.image} alt={activeChat.name} className="object-cover" />
                ) : null
              ) : activeChat.friend?.image ? (
                <AvatarImage src={activeChat.friend.image} alt={activeChat.friend.name} className="object-cover" />
              ) : null}
              <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-xs">
                {activeChat.type === "group" ? (
                  <Users className="h-4 w-4" />
                ) : (
                  activeChat.friend?.name.charAt(0).toUpperCase()
                )}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="text-left">
            <h2 className="text-xs font-black text-white leading-none">
              {activeChat.type === "group" ? activeChat.name : activeChat.friend?.name}
            </h2>
            {activeChatTyping && activeChatTyping.length > 0 ? (
              <span className="text-[9px] text-blue-400 font-bold block mt-1 animate-pulse italic">
                {activeChat.type === "group"
                  ? `${activeChatTyping.join(", ")} is typing...`
                  : "typing..."}
              </span>
            ) : (
              <span className="text-[9px] text-zinc-500 font-bold block mt-1 uppercase tracking-wider">
                {activeChat.type === "group" ? "Group Chat" : `@${activeChat.friend?.username}`}
              </span>
            )}
          </div>
        </div>

        {/* Sidebar toggle buttons */}
        <div className="flex items-center gap-1.5">
          <div className="relative max-w-44 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-650" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-900 bg-zinc-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="h-8 w-8 text-zinc-400 hover:text-white cursor-pointer"
            title="Toggle details"
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable messages history viewport */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin flex flex-col">
        {!activeChatMessages ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">
              Loading message log...
            </span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-20 px-6 space-y-2">
            <Smile className="h-10 w-10 text-zinc-800 mx-auto" />
            <p className="text-zinc-550 text-xs font-semibold">
              {searchQuery ? "No messages match search query" : "No messages shared yet"}
            </p>
            <p className="text-[10px] text-zinc-650">
              {searchQuery ? "Try clearing search" : "Type below to spark a conversation!"}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg, index) => {
            const isMe = msg.senderId === currentUserId;
            const isPrevSame =
              index > 0 && filteredMessages[index - 1].senderId === msg.senderId;
            const isNextSame =
              index < filteredMessages.length - 1 &&
              filteredMessages[index + 1].senderId === msg.senderId;
            const showAvatar = !isPrevSame;

            return (
              <ContextMenu
                key={msg._id}
                onOpenChange={(open) => {
                  setActiveContextMenuMessageId(open ? msg._id : null);
                }}
              >
                <ContextMenuTrigger
                  className={cn(
                    "block w-full px-3 transition-all duration-300 rounded-2xl",
                    isPrevSame ? "mt-0.5 py-0.5" : "mt-3 py-1",
                    activeContextMenuMessageId === msg._id && "bg-white/10 shadow-lg scale-[1.01]"
                  )}
                >
                  <div
                    className={cn(
                      "group/msg flex gap-3 max-w-[85%] sm:max-w-[70%] relative",
                      isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {/* Message Avatar */}
                    <div className={cn("w-8 shrink-0", isMe && "hidden")}>
                      {showAvatar && !isMe && (
                        <Avatar className="h-8 w-8 border border-zinc-800">
                          {msg.senderImage && (
                            <AvatarImage
                              src={msg.senderImage}
                              alt={msg.senderName}
                              className="object-cover"
                            />
                          )}
                          <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-[10px]">
                            {msg.senderName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>

                    {/* Message Balloon */}
                    <div className="flex flex-col gap-1 max-w-full">
                      {showAvatar && !isMe && (
                        <span className="text-[9px] font-bold text-zinc-500 pl-1 text-left">
                          {msg.senderName}
                        </span>
                      )}

                      <div className={cn("flex items-center gap-2 max-w-full", isMe && "justify-end")}>
                        <div
                          className={cn(
                            "p-3.5 text-xs relative shrink-0 max-w-full transition-all duration-300 text-left",
                            isMe
                              ? cn(
                                  "bg-blue-600 text-white",
                                  !isPrevSame && !isNextSame && "rounded-2xl rounded-br-[4px]",
                                  !isPrevSame && isNextSame && "rounded-2xl rounded-br-[4px]",
                                  isPrevSame && isNextSame && "rounded-l-2xl rounded-r-[4px]",
                                  isPrevSame && !isNextSame && "rounded-2xl rounded-tr-[4px] rounded-br-[4px]"
                                )
                              : cn(
                                  "bg-zinc-900 border border-zinc-850/60 text-zinc-200",
                                  !isPrevSame && !isNextSame && "rounded-2xl rounded-bl-[4px]",
                                  !isPrevSame && isNextSame && "rounded-2xl rounded-bl-[4px]",
                                  isPrevSame && isNextSame && "rounded-r-2xl rounded-l-[4px]",
                                  isPrevSame && !isNextSame && "rounded-2xl rounded-tl-[4px] rounded-bl-[4px]"
                                )
                          )}
                        >
                          {/* Main Text Content */}
                          {editingMessageId === msg._id ? (
                            <div className="flex flex-col gap-2 min-w-[180px] max-w-full">
                              <textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white outline-hidden focus:border-blue-500/50 resize-none"
                                rows={2}
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingMessageId(null)}
                                  className="px-2 py-1 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateMessage(msg._id)}
                                  className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-[10px] font-bold text-white transition-colors cursor-pointer"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              {msg.content && (
                                <p className="leading-relaxed wrap-break-word whitespace-pre-wrap">
                                  {msg.content}
                                  {msg.editedAt && (
                                    <span className="text-[8px] text-zinc-500 font-bold ml-1.5 select-none lowercase italic">
                                      (edited)
                                    </span>
                                  )}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* GIF Image displays */}
                      {msg.attachmentType === "gif" && msg.attachmentUrl && (
                        <div className="mt-2 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative max-w-64 max-h-48 shadow-lg">
                          <img
                            src={msg.attachmentUrl}
                            alt="Reaction GIF"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      {/* Movie/Show Share cards */}
                      {msg.attachmentType === "media" && msg.sharedMediaId && (
                        <div className="mt-3 bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden max-w-64 shadow-2xl flex flex-col items-stretch">
                          <div className="flex gap-3 p-2.5">
                            <div className="aspect-2/3 w-16 bg-zinc-900 border border-zinc-850 rounded-lg overflow-hidden shrink-0">
                              {msg.sharedMediaPoster ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w185${msg.sharedMediaPoster}`}
                                  alt={msg.sharedMediaTitle}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                  <Film className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                              <h4 className="text-xs font-black text-white truncate leading-tight">
                                {msg.sharedMediaTitle}
                              </h4>
                              <span className="text-[9px] font-bold text-zinc-500 mt-1 uppercase">
                                {msg.sharedMediaType === "tv" ? "TV Series" : "Movie"}
                                {msg.sharedMediaYear ? ` • ${msg.sharedMediaYear}` : ""}
                              </span>
                              {msg.sharedMediaRating !== undefined && msg.sharedMediaRating > 0 && (
                                <div className="flex items-center gap-1 mt-1 text-[9px] font-black text-yellow-400">
                                  <Bookmark className="h-3 w-3 fill-current" />
                                  <span>{msg.sharedMediaRating.toFixed(1)}/10</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 border-t border-zinc-900 bg-zinc-900/30 text-[9px] font-bold uppercase tracking-wider">
                            <button
                              onClick={() =>
                                router.push(`/${msg.sharedMediaType}/${msg.sharedMediaId}`)
                              }
                              className="py-2.5 border-r border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer text-center text-zinc-400"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                toast.success(
                                  `${msg.sharedMediaTitle} opened! Click View Details to manage.`
                                );
                              }}
                              className="py-2.5 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer text-center text-zinc-400"
                            >
                              View
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Timestamp Details */}
                      <div
                        className={cn(
                          "flex items-center gap-1.5 mt-1 text-[9px] text-zinc-500 select-none",
                          isMe ? "justify-end pr-1" : "justify-start pl-1"
                        )}
                      >
                        <span>{moment(msg.createdAt).format("h:mm A")}</span>
                        {isMe && (
                          <span>
                            {activeChatMembers &&
                            activeChatMembers.every(
                              (m) =>
                                m.userId === currentUserId ||
                                (m.lastReadAt && m.lastReadAt >= msg.createdAt)
                            ) ? (
                              <CheckCheck className="h-3.5 w-3.5 text-blue-400 stroke-3" />
                            ) : (
                              <Check className="h-3.5 w-3.5 text-zinc-650" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ContextMenuTrigger>

                <ContextMenuContent className="bg-zinc-950 border border-zinc-800 text-white rounded-2xl shadow-2xl p-1.5 min-w-40 z-50 animate-in fade-in-50 zoom-in-95 duration-200">
                  {isMe && !msg.sharedMediaId && msg.attachmentType !== "gif" && (
                    <ContextMenuItem
                      onClick={() => {
                        setEditingMessageId(msg._id);
                        setEditingText(msg.content);
                      }}
                      className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer hover:bg-zinc-900"
                    >
                      <Pencil className="h-3.5 w-3.5 text-zinc-400" />
                      Edit Message
                    </ContextMenuItem>
                  )}
                  <ContextMenuItem
                    onClick={() => {
                      if (msg.content) {
                        navigator.clipboard
                          .writeText(msg.content)
                          .then(() => {
                            toast.success("Message copied to clipboard!");
                          })
                          .catch(() => {
                            toast.error("Failed to copy message");
                          });
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer hover:bg-zinc-900"
                  >
                    <Bookmark className="h-3.5 w-3.5 text-zinc-400" />
                    Copy Content
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            );
          })
        )}

        {/* Real-time Typing Indicators */}
        {activeChatTyping && activeChatTyping.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] text-zinc-550 pl-11 py-1 italic font-semibold select-none animate-pulse">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce delay-150" />
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce delay-300" />
            </div>
            <span>
              {activeChatTyping.join(", ")}{" "}
              {activeChatTyping.length === 1 ? "is typing..." : "are typing..."}
            </span>
          </div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Input Message Area */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 border-t border-zinc-905 bg-zinc-950 flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setIsGIFPickerOpen(true)}
            className="h-9 w-9 rounded-xl border border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:text-white cursor-pointer"
            title="Send reaction GIF"
          >
            <Grid className="h-4.5 w-4.5" />
          </Button>
          <div className="relative grow">
            <Input
              type="text"
              required
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                handleTyping();
              }}
              className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 pl-4 pr-10 py-5 text-xs text-white placeholder-zinc-550 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-left"
            />
            <button
              type="button"
              onClick={() => setMessageText((prev) => prev + " 🍿")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-sm cursor-pointer"
            >
              🍿
            </button>
          </div>
          <Button
            type="submit"
            disabled={!messageText.trim()}
            className="h-9 w-9 rounded-xl bg-blue-600 text-white hover:bg-blue-500 active:scale-95 transition-all flex items-center justify-center shrink-0 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
