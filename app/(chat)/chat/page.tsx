"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import types and subcomponents
import {
  Friend,
  ChatMessage,
  ChatItem,
  ChatMember,
} from "@/components/chat/types";
import SidebarPanel from "@/components/chat/sidebar-panel";
import ChatWorkspace from "@/components/chat/chat-workspace";
import DetailsPanel from "@/components/chat/details-panel";
import ChatModals from "@/components/chat/chat-modals";

export default function ChatPage() {
  const router = useRouter();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const currentUserId = session.data?.user?.id;

  // ----------------------------------------------------
  // CONVEX STATE QUERIES & MUTATIONS
  // ----------------------------------------------------
  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );
  const rawChatsList = useQuery(
    api.chats.getChatsList,
    isLoggedIn ? {} : "skip",
  );

  // Cast raw Convex query output to strong local ChatItem interface
  const chats = useMemo(() => {
    if (!rawChatsList) return undefined;
    return rawChatsList as unknown as ChatItem[];
  }, [rawChatsList]);

  // Get active friends list to start new chat
  const profileData = useQuery(
    api.social.getUserSocialProfile,
    currentUserProfile?.username
      ? { username: currentUserProfile.username }
      : "skip",
  );

  // Strictly cast friends profiles
  const friends = useMemo(() => {
    if (!profileData || !("friends" in profileData) || !profileData.friends) {
      return [];
    }
    return profileData.friends as Friend[];
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

  // ----------------------------------------------------
  // LOCAL COMPONENT STATE
  // ----------------------------------------------------
  const [selectedChatId, setSelectedChatId] = useState<Id<"chats"> | null>(
    null,
  );
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [editingMessageId, setEditingMessageId] =
    useState<Id<"messages"> | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activeContextMenuMessageId, setActiveContextMenuMessageId] = useState<
    string | null
  >(null);

  // Modals
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isInviteFriendsOpen, setIsInviteFriendsOpen] = useState(false);
  const [isGIFPickerOpen, setIsGIFPickerOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Forms
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedInvitedUsers, setSelectedInvitedUsers] = useState<Set<string>>(
    new Set(),
  );
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

  const rawActiveChatMessages = useQuery(
    api.chats.getChatMessages,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  );
  const activeChatMessages = useMemo(() => {
    if (!rawActiveChatMessages) return undefined;
    return rawActiveChatMessages as unknown as ChatMessage[];
  }, [rawActiveChatMessages]);

  const rawActiveChatMembers = useQuery(
    api.chats.getChatMembers,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  );
  const activeChatMembers = useMemo(() => {
    if (!rawActiveChatMembers) return undefined;
    return rawActiveChatMembers as unknown as ChatMember[];
  }, [rawActiveChatMembers]);

  const activeChatTyping = useQuery(
    api.chats.getTypingUsers,
    selectedChatId ? { chatId: selectedChatId } : "skip",
  );

  // Mark chat as read when opening or receiving messages
  useEffect(() => {
    if (selectedChatId) {
      setReadReceipt({ chatId: selectedChatId }).catch(console.error);
    }
  }, [selectedChatId, activeChatMessages?.length, setReadReceipt]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [activeChatMessages?.length]);

  // Handle typing triggers
  const handleTyping = () => {
    if (!selectedChatId) return;
    setTypingStatus({ chatId: selectedChatId, isTyping: true }).catch(
      console.error,
    );

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setTypingStatus({ chatId: selectedChatId, isTyping: false }).catch(
        console.error,
      );
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
      setTypingStatus({ chatId: selectedChatId, isTyping: false }).catch(
        console.error,
      );

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
      toast.success(
        "User reported successfully. Popcorn Vision safety admins will review this chat session.",
      );
    } catch {
      toast.error("Failed to submit report");
    }
  };

  // Start direct message
  const handleStartDM = async (friendId: string) => {
    try {
      const newChatId = await createOrGetPrivateChat({
        friendUserId: friendId,
      });
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
    return activeChatMessages.filter((m) =>
      m.content.toLowerCase().includes(q),
    );
  }, [activeChatMessages, searchQuery]);

  // Extract shared media list
  const sharedMediaList = useMemo(() => {
    if (!activeChatMessages) return [];
    return activeChatMessages.filter(
      (m) => m.attachmentType === "media" && m.sharedMediaId,
    );
  }, [activeChatMessages]);

  // Enforce logged-in status
  if (!isLoggedIn || !currentUserId) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 p-6 text-center text-white">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-500" />
        <h1 className="text-xl font-bold">Loading chats...</h1>
        <p className="text-zinc-550 mt-1 text-xs">
          Please log in to participate in direct and group chats.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 cursor-pointer rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-500"
        >
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex max-h-svh min-h-svh grow flex-row overflow-hidden border-t border-zinc-900 bg-zinc-950 text-white">
      <SidebarPanel
        chats={chats}
        selectedChatId={selectedChatId}
        setSelectedChatId={setSelectedChatId}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        setIsCreateGroupOpen={setIsCreateGroupOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        setSelectedInvitedUsers={setSelectedInvitedUsers}
      />

      <ChatWorkspace
        selectedChatId={selectedChatId}
        activeChat={activeChat}
        currentUserId={currentUserId}
        activeChatMessages={activeChatMessages}
        activeChatMembers={activeChatMembers}
        activeChatTyping={activeChatTyping}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredMessages={filteredMessages}
        messageText={messageText}
        setMessageText={setMessageText}
        handleSendMessage={handleSendMessage}
        handleTyping={handleTyping}
        setIsGIFPickerOpen={setIsGIFPickerOpen}
        showRightPanel={showRightPanel}
        setShowRightPanel={setShowRightPanel}
        setIsSidebarOpen={setIsSidebarOpen}
        editingMessageId={editingMessageId}
        setEditingMessageId={setEditingMessageId}
        editingText={editingText}
        setEditingText={setEditingText}
        handleUpdateMessage={handleUpdateMessage}
        messageEndRef={messageEndRef}
        activeContextMenuMessageId={activeContextMenuMessageId}
        setActiveContextMenuMessageId={setActiveContextMenuMessageId}
      />

      {selectedChatId && activeChat && (
        <DetailsPanel
          activeChat={activeChat}
          activeChatMembers={activeChatMembers}
          sharedMediaList={sharedMediaList}
          showRightPanel={showRightPanel}
          setShowRightPanel={setShowRightPanel}
          setIsInviteFriendsOpen={setIsInviteFriendsOpen}
          setSelectedInvitedUsers={setSelectedInvitedUsers}
          handleLeaveGroup={handleLeaveGroup}
        />
      )}

      <ChatModals
        isNewChatOpen={isNewChatOpen}
        setIsNewChatOpen={setIsNewChatOpen}
        isCreateGroupOpen={isCreateGroupOpen}
        setIsCreateGroupOpen={setIsCreateGroupOpen}
        isInviteFriendsOpen={isInviteFriendsOpen}
        setIsInviteFriendsOpen={setIsInviteFriendsOpen}
        isGIFPickerOpen={isGIFPickerOpen}
        setIsGIFPickerOpen={setIsGIFPickerOpen}
        isReportOpen={isReportOpen}
        setIsReportOpen={setIsReportOpen}
        friends={friends}
        activeChatMembers={activeChatMembers}
        selectedInvitedUsers={selectedInvitedUsers}
        setSelectedInvitedUsers={setSelectedInvitedUsers}
        groupName={groupName}
        setGroupName={setGroupName}
        groupDescription={groupDescription}
        setGroupDescription={setGroupDescription}
        reportReason={reportReason}
        setReportReason={setReportReason}
        handleStartDM={handleStartDM}
        handleCreateGroup={handleCreateGroup}
        handleInviteToGroup={handleInviteToGroup}
        handleSendGIF={handleSendGIF}
        handleSubmitReport={handleSubmitReport}
      />
    </div>
  );
}
