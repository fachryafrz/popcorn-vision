"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import {
  Send,
  Search,
  Smile,
  Plus,
  X,
  LogOut,
  Check,
  CheckCheck,
  Loader2,
  Users,
  Info,
  Film,
  Bookmark,
  Grid,
  ChevronRight,
  TrendingUp,
  Home,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import moment from "moment";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";

// ----------------------------------------------------
// CURATED REACTION GIFS (No API key required)
// ----------------------------------------------------
const REACTION_GIFS = [
  { name: "Excited Popcorn", url: "https://media.giphy.com/media/t3dL1FZZ0PDqM/giphy.gif" },
  { name: "Excited Minions", url: "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif" },
  { name: "Movie Laughing", url: "https://media.giphy.com/media/10yXFkB5RKaraU/giphy.gif" },
  { name: "Leonardo Cheers", url: "https://media.giphy.com/media/8Iv5lqKwKsZ2g/giphy.gif" },
  { name: "Movie Crying", url: "https://media.giphy.com/media/2WxWfiavndgc0/giphy.gif" },
  { name: "Shocked Popcorn", url: "https://media.giphy.com/media/3xkQex55IUP7y/giphy.gif" },
  { name: "Watching Closely", url: "https://media.giphy.com/media/13n7XeyIXEIrbG/giphy.gif" },
  { name: "Clapping Movie", url: "https://media.giphy.com/media/3o7qDEq2bMbcbPRVP2/giphy.gif" },
  { name: "Mind Blown", url: "https://media.giphy.com/media/xT0xeJpnrWC4XWblUk/giphy.gif" },
  { name: "Thumbs Up", url: "https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif" },
];

export default function ChatPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;

  // ----------------------------------------------------
  // CONVEX STATE QUERIES & MUTATIONS
  // ----------------------------------------------------
  const currentUserProfile = useQuery(api.users.getCurrentUser, isLoggedIn ? {} : "skip");
  const chats = useQuery(api.chats.getChatsList, isLoggedIn ? {} : "skip");

  // Get active friends list to start new chat
  const profileData = useQuery(
    api.social.getUserSocialProfile,
    currentUserProfile?.username ? { username: currentUserProfile.username } : "skip"
  );
  // Strictly cast friends profiles
  const friends = useMemo(() => {
    if (!profileData || !("friends" in profileData) || !profileData.friends) {
      return [];
    }
    return profileData.friends as {
      userId: string;
      username: string;
      name: string;
      image?: string;
    }[];
  }, [profileData]);

  // Mutations
  const createOrGetPrivateChat = useMutation(api.chats.createOrGetPrivateChat);
  const createGroupChat = useMutation(api.chats.createGroupChat);
  const inviteToGroupChat = useMutation(api.chats.inviteToGroupChat);
  const leaveGroupChat = useMutation(api.chats.leaveGroupChat);
  const sendMessage = useMutation(api.chats.sendMessage);
  const editChatMessage = useMutation(api.chats.editMessage);
  const setReadReceipt = useMutation(api.chats.setReadReceipt);
  const setTypingStatus = useMutation(api.chats.setTypingStatus);
  const toggleMuteChat = useMutation(api.chats.toggleMuteChat);
  const reportUser = useMutation(api.chats.reportUser);
  const unfriendOrBlock = useMutation(api.social.blockUser);



  // ----------------------------------------------------
  // LOCAL COMPONENT STATE
  // ----------------------------------------------------
  const [selectedChatId, setSelectedChatId] = useState<Id<"chats"> | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<Id<"messages"> | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activeContextMenuMessageId, setActiveContextMenuMessageId] = useState<string | null>(null);

  // Modals
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isInviteFriendsOpen, setIsInviteFriendsOpen] = useState(false);
  const [isGIFPickerOpen, setIsGIFPickerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Forms
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedInvitedUsers, setSelectedInvitedUsers] = useState<Set<string>>(new Set());
  const [reportReason, setReportReason] = useState("");
  const [reportedUserId, setReportedUserId] = useState<string | null>(null);

  // DOM Refs
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch details of active chat session
  const activeChat = useMemo(() => {
    if (!chats || !selectedChatId) return null;
    return chats.find((c) => c.chatId === selectedChatId) || null;
  }, [chats, selectedChatId]);

  const activeChatMessages = useQuery(
    api.chats.getChatMessages,
    selectedChatId ? { chatId: selectedChatId } : "skip"
  );

  const activeChatMembers = useQuery(
    api.chats.getChatMembers,
    selectedChatId ? { chatId: selectedChatId } : "skip"
  );

  const activeChatTyping = useQuery(
    api.chats.getTypingUsers,
    selectedChatId ? { chatId: selectedChatId } : "skip"
  );

  // Mark chat as read when opening or receiving messages
  useEffect(() => {
    if (selectedChatId) {
      setReadReceipt({ chatId: selectedChatId }).catch(console.error);
    }
  }, [selectedChatId, activeChatMessages?.length, setReadReceipt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeChatMessages?.length]);



  // Handle typing triggers
  const handleTyping = () => {
    if (!selectedChatId) return;
    setTypingStatus({ chatId: selectedChatId, isTyping: true }).catch(console.error);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTypingStatus({ chatId: selectedChatId, isTyping: false }).catch(console.error);
    }, 3000);
  };

  // Send pure text direct message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatId || !messageText.trim()) return;

    try {
      const textToSend = messageText.trim();
      setMessageText("");
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      setTypingStatus({ chatId: selectedChatId, isTyping: false }).catch(console.error);

      await sendMessage({
        chatId: selectedChatId,
        content: textToSend,
      });
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to send message");
    }
  };

  // Edit existing message
  const handleUpdateMessage = async (messageId: Id<"messages">) => {
    if (!editingText.trim()) {
      toast.error("Message content cannot be empty");
      return;
    }
    try {
      await editChatMessage({
        messageId,
        newContent: editingText.trim(),
      });
      setEditingMessageId(null);
      setEditingText("");
      toast.success("Message updated!");
    } catch {
      toast.error("Failed to edit message");
    }
  };

  // Send a high-fidelity GIF
  const handleSendGIF = async (gifUrl: string) => {
    if (!selectedChatId) return;
    try {
      setIsGIFPickerOpen(false);
      await sendMessage({
        chatId: selectedChatId,
        content: "Shared a GIF reaction",
        attachmentUrl: gifUrl,
        attachmentType: "gif",
      });
    } catch {
      toast.error("Failed to send GIF");
    }
  };

  // Group chat creators
  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }
    try {
      const invitedIds = Array.from(selectedInvitedUsers);
      const newChatId = await createGroupChat({
        name: groupName,
        description: groupDescription,
        invitedUserIds: invitedIds,
      });
      setSelectedChatId(newChatId);
      setIsCreateGroupOpen(false);
      setGroupName("");
      setGroupDescription("");
      setSelectedInvitedUsers(new Set());
      toast.success("Group chat created successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to create group");
    }
  };

  // Invite friends to group chat
  const handleInviteToGroup = async () => {
    if (!selectedChatId) return;
    try {
      const selectedIds = Array.from(selectedInvitedUsers);
      await inviteToGroupChat({
        chatId: selectedChatId,
        userIds: selectedIds,
      });
      setIsInviteFriendsOpen(false);
      setSelectedInvitedUsers(new Set());
      toast.success("Friends invited successfully!");
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to invite friends");
    }
  };

  // Leave active group chat
  const handleLeaveGroup = async () => {
    if (!selectedChatId) return;
    if (!confirm("Are you sure you want to leave this group chat?")) return;

    try {
      await leaveGroupChat({ chatId: selectedChatId });
      setSelectedChatId(null);
      toast.success("Left group successfully!");
    } catch {
      toast.error("Failed to leave group");
    }
  };

  // Toggle group/direct message muting status
  const handleToggleMute = async () => {
    if (!selectedChatId) return;
    try {
      const status = await toggleMuteChat({ chatId: selectedChatId });
      toast.success(status ? "Chat muted" : "Chat unmuted");
    } catch {
      toast.error("Failed to toggle mute state");
    }
  };

  // Safety Submit Report
  const handleSubmitReport = async () => {
    if (!reportedUserId || !reportReason.trim()) return;
    try {
      await reportUser({
        reportedUserId,
        reason: reportReason.trim(),
      });
      setIsReportOpen(false);
      setReportReason("");
      setReportedUserId(null);
      toast.success("User reported successfully. Popcorn Vision safety admins will review this chat session.");
    } catch {
      toast.error("Failed to submit report");
    }
  };

  // Safety block partner
  const handleBlockPartner = async (partnerId: string) => {
    if (!confirm("Are you sure you want to block this user? You will no longer receive any messages or be visible online to each other.")) return;
    try {
      await unfriendOrBlock({ targetUserId: partnerId });
      setSelectedChatId(null);
      toast.success("User blocked successfully");
    } catch {
      toast.error("Failed to block user");
    }
  };

  // Start direct message
  const handleStartDM = async (friendId: string) => {
    try {
      const newChatId = await createOrGetPrivateChat({ friendUserId: friendId });
      setSelectedChatId(newChatId);
      setIsNewChatOpen(false);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      toast.error(errorObj.message || "Failed to start direct message session");
    }
  };

  // Filter messages dynamically by query
  const filteredMessages = useMemo(() => {
    if (!activeChatMessages) return [];
    if (!searchQuery.trim()) return activeChatMessages;
    const q = searchQuery.toLowerCase();
    return activeChatMessages.filter((m) => m.content.toLowerCase().includes(q));
  }, [activeChatMessages, searchQuery]);

  // Extract shared media list
  const sharedMediaList = useMemo(() => {
    if (!activeChatMessages) return [];
    return activeChatMessages.filter((m) => m.attachmentType === "media" && m.sharedMediaId);
  }, [activeChatMessages]);

  // Enforce logged-in status
  if (!isLoggedIn) {
    return (
      <div className="grow flex flex-col items-center justify-center min-h-[60vh] bg-zinc-950 text-white p-6 text-center">
        <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
        <h1 className="text-xl font-bold">Loading chats...</h1>
        <p className="text-zinc-500 text-xs mt-1">Please log in to participate in direct and group chats.</p>
        <Button onClick={() => router.push("/")} className="mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="grow bg-zinc-950 text-white min-h-svh max-h-svh flex flex-row overflow-hidden relative border-t border-zinc-900">
      
      {/* ---------------------------------------------------- */}
      {/* LEFT SIDEBAR PANEL: Conversation Lists               */}
      {/* ---------------------------------------------------- */}
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
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Syncing chats...</span>
              </div>
            ) : chats.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <Users className="h-10 w-10 text-zinc-800 mx-auto" />
                <p className="text-zinc-500 text-xs font-semibold">No active conversations found</p>
                <p className="text-[10px] text-zinc-650">Click &quot;+&quot; or the chat icon to start talking to friends!</p>
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
                          <AvatarImage src={c.friend.image} alt={c.friend.name} className="object-cover" />
                        ) : null}
                        <AvatarFallback className="bg-zinc-900 text-white font-bold text-xs">
                          {isGroup ? <Users className="h-4 w-4 text-zinc-400" /> : c.friend?.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>


                    </div>

                    {/* Chat Item Titles */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs font-bold truncate block", hasUnread && "font-black text-white")}>
                          {displayTitle}
                        </span>
                        {c.lastMessage && (
                          <span className="text-[9px] text-zinc-550 shrink-0">
                            {moment(c.lastMessage.createdAt).format("h:mm A")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="text-[10px] text-zinc-500 truncate block max-w-[150px]">
                          {c.lastMessage ? c.lastMessage.content : displaySubtitle}
                        </span>
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

      {/* ---------------------------------------------------- */}
      {/* CENTER WORKSPACE: Active Conversation Message Log     */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col justify-between overflow-hidden bg-zinc-950/20">
        {selectedChatId && activeChat ? (
          <>
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
                <div>
                  <h2 className="text-xs font-black text-white leading-none">
                    {activeChat.type === "group" ? activeChat.name : activeChat.friend?.name}
                  </h2>
                  <span className="text-[9px] text-zinc-500 font-bold block mt-1 uppercase tracking-wider">
                    {activeChat.type === "group" ? "Group Chat" : `@${activeChat.friend?.username}`}
                  </span>
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
                    <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500">
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
                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider">Loading message log...</span>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-20 px-6 space-y-2">
                  <Smile className="h-10 w-10 text-zinc-800 mx-auto" />
                  <p className="text-zinc-500 text-xs font-semibold">
                    {searchQuery ? "No messages match search query" : "No messages shared yet"}
                  </p>
                  <p className="text-[10px] text-zinc-650">
                    {searchQuery ? "Try clearing search" : "Type below to spark a conversation!"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg, index) => {
                  const isMe = msg.senderId === currentUserId;
                  const isPrevSame = index > 0 && filteredMessages[index - 1].senderId === msg.senderId;
                  const isNextSame = index < filteredMessages.length - 1 && filteredMessages[index + 1].senderId === msg.senderId;
                  const showAvatar = !isPrevSame;

                  return (
                    <ContextMenu key={msg._id} onOpenChange={(open) => {
                      setActiveContextMenuMessageId(open ? msg._id : null);
                    }}>
                      <ContextMenuTrigger className={cn(
                        "block w-full px-3 transition-all duration-300 rounded-2xl",
                        isPrevSame ? "mt-0.5 py-0.5" : "mt-3 py-1",
                        activeContextMenuMessageId === msg._id && "bg-white/10 shadow-lg scale-[1.01]"
                      )}>
                        <div
                          className={cn("group/msg flex gap-3 max-w-[85%] sm:max-w-[70%] relative", isMe ? "ml-auto flex-row-reverse" : "mr-auto")}
                        >
                      {/* Message Avatar */}
                      <div className="w-8 shrink-0">
                        {showAvatar && !isMe && (
                          <Avatar className="h-8 w-8 border border-zinc-800">
                            {msg.senderImage && (
                              <AvatarImage src={msg.senderImage} alt={msg.senderName} className="object-cover" />
                            )}
                            <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-[10px]">
                              {msg.senderName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>

                      {/* Message Balloon */}
                      <div className="flex flex-col gap-1">
                        {showAvatar && !isMe && (
                          <span className="text-[9px] font-bold text-zinc-500 pl-1">
                            {msg.senderName}
                          </span>
                        )}

                        <div className="flex items-center gap-2 max-w-full">
                          <div
                            className={cn(
                              "p-3.5 text-xs relative shrink-0 max-w-full transition-all duration-300",
                              isMe
                                ? cn(
                                    "bg-blue-600 text-white",
                                    (!isPrevSame && !isNextSame) && "rounded-2xl rounded-br-[4px]",
                                    (!isPrevSame && isNextSame) && "rounded-2xl rounded-br-[4px]",
                                    (isPrevSame && isNextSame) && "rounded-l-2xl rounded-r-[4px]",
                                    (isPrevSame && !isNextSame) && "rounded-2xl rounded-tr-[4px] rounded-br-[4px]"
                                  )
                                : cn(
                                    "bg-zinc-900 border border-zinc-850/60 text-zinc-200",
                                    (!isPrevSame && !isNextSame) && "rounded-2xl rounded-bl-[4px]",
                                    (!isPrevSame && isNextSame) && "rounded-2xl rounded-bl-[4px]",
                                    (isPrevSame && isNextSame) && "rounded-r-2xl rounded-l-[4px]",
                                    (isPrevSame && !isNextSame) && "rounded-2xl rounded-tl-[4px] rounded-bl-[4px]"
                                  )
                            )}
                          >
                            {/* Main Text Content */}
                            {editingMessageId === msg._id ? (
                              <div className="flex flex-col gap-2 min-w-[180px] max-w-full">
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-xs text-white outline-none focus:border-blue-500/50 resize-none"
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
                                      <span className="text-[8px] text-zinc-500 font-bold ml-1.5 select-none lowercase italic">(edited)</span>
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
                              <img src={msg.attachmentUrl} alt="Reaction GIF" className="object-cover w-full h-full" />
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
                                  onClick={() => router.push(`/${msg.sharedMediaType}/${msg.sharedMediaId}`)}
                                  className="py-2.5 border-r border-zinc-900 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer text-center text-zinc-400"
                                >
                                  Details
                                </button>
                                <button
                                  onClick={() => {
                                    // Custom mutation placeholders in lists
                                    toast.success(`${msg.sharedMediaTitle} opened! Click View Details to manage.`);
                                  }}
                                  className="py-2.5 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer text-center text-zinc-400"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          )}

                        {/* Timestamp Details */}
                        <div className={cn("flex items-center gap-1.5 mt-1 text-[9px] text-zinc-500 select-none", isMe ? "justify-end pr-1" : "justify-start pl-1")}>
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
                                <Check className="h-3.5 w-3.5 text-zinc-600" />
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
                              navigator.clipboard.writeText(msg.content).then(() => {
                                toast.success("Message copied to clipboard!");
                              }).catch(() => {
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
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 pl-11 py-1 italic font-semibold select-none animate-pulse">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-650 animate-bounce delay-300" />
                  </div>
                  <span>
                    {activeChatTyping.join(", ")} {activeChatTyping.length === 1 ? "is typing..." : "are typing..."}
                  </span>
                </div>
              )}

              <div ref={messageEndRef} />
            </div>

            {/* Input Message Area */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-900 bg-zinc-950 flex flex-col gap-3">
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
                    className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 pl-4 pr-10 py-5 text-xs text-white placeholder-zinc-550 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900"
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
          </>
        ) : (
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
            <Button onClick={() => setIsNewChatOpen(true)} className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-6">
              Start chatting
            </Button>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* RIGHT SIDEBAR PANEL: Detail Information & Safety    */}
      {/* ---------------------------------------------------- */}
      {selectedChatId && activeChat && (
        <div
          className={cn(
            "w-full sm:w-[280px] shrink-0 border-l border-zinc-900 bg-zinc-950 flex flex-col overflow-y-auto p-5 space-y-6 scrollbar-thin select-none fixed sm:relative inset-y-0 right-0 transition-transform duration-300 z-30 shadow-2xl sm:shadow-none",
            showRightPanel ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none sm:hidden"
          )}
        >
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400">Details</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowRightPanel(false)}
              className="h-6 w-6 text-zinc-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Group details or direct friend profile */}
          {activeChat.type === "group" ? (
            <div className="space-y-5">
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto border border-zinc-800">
                  {activeChat.image ? (
                    <AvatarImage src={activeChat.image} alt={activeChat.name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-lg">
                    <Users className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-xs font-black text-white mt-3 truncate">{activeChat.name}</h4>
                {activeChat.description && (
                  <p className="text-[10px] text-zinc-500 mt-1 max-w-xs mx-auto italic">
                    &ldquo;{activeChat.description}&rdquo;
                  </p>
                )}
              </div>

              {/* Group members list */}
              <div className="space-y-2.5">
                <h5 className="text-[9px] font-black uppercase tracking-wider text-zinc-550 flex items-center justify-between">
                  <span>Group Members ({activeChatMembers?.length || 0})</span>
                  <button
                    onClick={() => {
                      setSelectedInvitedUsers(new Set());
                      setIsInviteFriendsOpen(true);
                    }}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    + Add
                  </button>
                </h5>
                <div className="space-y-2 max-h-48 overflow-y-auto p-0.5 scrollbar-thin">
                  {activeChatMembers?.map((m) => {
                    const isAdmin = activeChat.adminIds?.includes(m.userId);
                    return (
                      <div key={m.userId} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-zinc-900 shrink-0">
                            {m.image && <AvatarImage src={m.image} alt={m.name} className="object-cover" />}
                            <AvatarFallback className="bg-zinc-900 text-zinc-400 text-[8px]">
                              {m.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="truncate text-left max-w-[120px]">
                            <span className="font-bold text-zinc-300 block truncate leading-none">{m.name}</span>
                            <span className="text-[8px] text-zinc-550 block truncate mt-0.5">@{m.username}</span>
                          </div>
                        </div>
                        {isAdmin && (
                          <span className="text-[8px] font-bold text-blue-400 bg-blue-950/20 border border-blue-900/30 px-1.5 py-0.5 rounded-full uppercase scale-90 shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Group actions */}
              <div className="pt-4 border-t border-zinc-900 space-y-2">
                <Button
                  onClick={handleLeaveGroup}
                  variant="ghost"
                  className="w-full justify-start rounded-xl text-xs font-bold text-red-400 hover:bg-red-950/20 hover:text-red-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave Group Chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Private Chat details */}
              <div className="text-center">
                <Avatar className="h-16 w-16 mx-auto border border-zinc-800">
                  {activeChat.friend?.image ? (
                    <AvatarImage src={activeChat.friend.image} alt={activeChat.friend.name} className="object-cover" />
                  ) : null}
                  <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-lg">
                    {activeChat.friend?.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-xs font-black text-white mt-3 truncate">{activeChat.friend?.name}</h4>
                <span className="text-[10px] text-zinc-550 block mt-0.5 font-bold uppercase tracking-wider">
                  @{activeChat.friend?.username}
                </span>
              </div>


            </div>
          )}

          {/* Shared Media History display */}
          <div className="pt-5 border-t border-zinc-900 space-y-3">
            <h5 className="text-[9px] font-black uppercase tracking-wider text-zinc-550 flex items-center justify-between">
              <span>Shared Titles ({sharedMediaList.length})</span>
            </h5>
            {sharedMediaList.length === 0 ? (
              <p className="text-[10px] text-zinc-650 italic">No movies or TV shows shared yet.</p>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-0.5 scrollbar-thin">
                {sharedMediaList.map((msg) => {
                  const posterUrl = msg.sharedMediaPoster
                    ? `https://image.tmdb.org/t/p/w92${msg.sharedMediaPoster}`
                    : "/logo/popcorn.png";
                  return (
                    <div
                      key={msg._id}
                      onClick={() => router.push(`/${msg.sharedMediaType}/${msg.sharedMediaId}`)}
                      className="aspect-2/3 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-850 cursor-pointer hover:border-zinc-600 transition-colors shadow-inner"
                      title={msg.sharedMediaTitle}
                    >
                      <img src={posterUrl} alt={msg.sharedMediaTitle} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: Select Friend to start DM                     */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">Start New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550">Choose a Movie Friend</h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {friends.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-4">No active friends found. Search for users to add them as friends first!</p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.userId}
                    onClick={() => handleStartDM(friend.userId)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900/60 cursor-pointer border border-transparent hover:border-zinc-850 transition-all text-xs"
                  >
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {friend.image && <AvatarImage src={friend.image} alt={friend.name} className="object-cover" />}
                      <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-xs">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <span className="font-bold text-white block">{friend.name}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">@{friend.username}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Create Group Chat                             */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">Create Group Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Group Name</label>
              <Input
                type="text"
                placeholder="Movie Club, Watch Party, etc."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value.slice(0, 50))}
                className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 text-xs px-3 py-5 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Description (Optional)</label>
              <Input
                type="text"
                placeholder="What is this movie club about?"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value.slice(0, 150))}
                className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 text-xs px-3 py-5 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Invite Friends</label>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1 scrollbar-thin border border-zinc-900 p-2 rounded-2xl bg-zinc-900/20">
                {friends.length === 0 ? (
                  <p className="text-[10px] text-zinc-650 italic py-2 text-center">No active friends found</p>
                ) : (
                  friends.map((friend) => {
                    const isInvited = selectedInvitedUsers.has(friend.userId);
                    return (
                      <div
                        key={friend.userId}
                        onClick={() => {
                          const updated = new Set(selectedInvitedUsers);
                          if (updated.has(friend.userId)) updated.delete(friend.userId);
                          else updated.add(friend.userId);
                          setSelectedInvitedUsers(updated);
                        }}
                        className={cn(
                          "flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs",
                          isInvited ? "bg-blue-600/10 text-white" : "hover:bg-zinc-900/50 text-zinc-400"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6 border border-zinc-900">
                            {friend.image && <AvatarImage src={friend.image} alt={friend.name} className="object-cover" />}
                            <AvatarFallback className="bg-zinc-900 text-zinc-400 text-[8px] font-bold">
                              {friend.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold">{friend.name}</span>
                        </div>
                        {isInvited && <Check className="h-3.5 w-3.5 text-blue-400" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Button onClick={handleCreateGroup} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-5 font-bold uppercase tracking-wider text-[10px] mt-4">
              Create Group Chat
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Invite Friends to existing Group              */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isInviteFriendsOpen} onOpenChange={setIsInviteFriendsOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">Invite Friends</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550">Select Friends to Invite</h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin border border-zinc-900 p-2 rounded-2xl bg-zinc-900/20">
              {friends.length === 0 ? (
                <p className="text-xs text-zinc-650 italic text-center py-4">No active friends found</p>
              ) : (
                friends.map((friend) => {
                  const isInvited = selectedInvitedUsers.has(friend.userId);
                  const isAlreadyMember = activeChatMembers?.some((m) => m.userId === friend.userId);

                  return (
                    <div
                      key={friend.userId}
                      onClick={() => {
                        if (isAlreadyMember) return;
                        const updated = new Set(selectedInvitedUsers);
                        if (updated.has(friend.userId)) updated.delete(friend.userId);
                        else updated.add(friend.userId);
                        setSelectedInvitedUsers(updated);
                      }}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs",
                        isAlreadyMember
                          ? "opacity-40 cursor-not-allowed"
                          : isInvited
                          ? "bg-blue-600/10 text-white"
                          : "hover:bg-zinc-900/50 text-zinc-400"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-zinc-900">
                          {friend.image && <AvatarImage src={friend.image} alt={friend.name} className="object-cover" />}
                          <AvatarFallback className="bg-zinc-900 text-zinc-400 text-[8px] font-bold">
                            {friend.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{friend.name}</span>
                      </div>
                      {isAlreadyMember ? (
                        <span className="text-[8px] font-bold text-zinc-550 uppercase">Member</span>
                      ) : isInvited ? (
                        <Check className="h-3.5 w-3.5 text-blue-400" />
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>

            <Button onClick={handleInviteToGroup} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-5 font-bold uppercase tracking-wider text-[10px] mt-4">
              Send Invitations
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Curated GIF Picker Modal             */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isGIFPickerOpen} onOpenChange={setIsGIFPickerOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">Movie Reaction GIFs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550 flex items-center gap-1.5 justify-center">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              Select a GIF reaction
            </h3>
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
              {REACTION_GIFS.map((gif) => (
                <div
                  key={gif.name}
                  onClick={() => handleSendGIF(gif.url)}
                  className="relative group rounded-xl overflow-hidden aspect-video border border-zinc-850 cursor-pointer hover:border-blue-500 hover:scale-[1.02] active:scale-98 transition-all bg-zinc-900"
                >
                  <img src={gif.url} alt={gif.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white truncate w-full">{gif.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------------------------------------------------- */}
      {/* MODAL: Safety Submit Report Modal                   */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">Report Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">Reason for Report</label>
              <textarea
                rows={4}
                placeholder="Explain the safety violation in detail (harassment, spam, abusive chat, etc.). Popcorn Vision security admins will review chat logs."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value.slice(0, 500))}
                className="w-full rounded-2xl border border-zinc-850 bg-zinc-900/30 p-4 text-xs text-white placeholder-zinc-550 outline-hidden focus:border-blue-500/50 resize-none min-h-[120px]"
              />
            </div>
            <Button onClick={handleSubmitReport} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-5 font-bold uppercase tracking-wider text-[10px] mt-4">
              Submit Safety Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
