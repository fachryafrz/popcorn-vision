import React from "react";
import { Check, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Friend, ChatMember } from "./types";

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

interface ChatModalsProps {
  isNewChatOpen: boolean;
  setIsNewChatOpen: (open: boolean) => void;
  isCreateGroupOpen: boolean;
  setIsCreateGroupOpen: (open: boolean) => void;
  isInviteFriendsOpen: boolean;
  setIsInviteFriendsOpen: (open: boolean) => void;
  isGIFPickerOpen: boolean;
  setIsGIFPickerOpen: (open: boolean) => void;
  isReportOpen: boolean;
  setIsReportOpen: (open: boolean) => void;
  friends: Friend[];
  activeChatMembers: ChatMember[] | undefined;
  selectedInvitedUsers: Set<string>;
  setSelectedInvitedUsers: (users: Set<string>) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  groupDescription: string;
  setGroupDescription: (desc: string) => void;
  reportReason: string;
  setReportReason: (reason: string) => void;
  handleStartDM: (friendId: string) => void;
  handleCreateGroup: () => void;
  handleInviteToGroup: () => void;
  handleSendGIF: (url: string) => void;
  handleSubmitReport: () => void;
}

export default function ChatModals({
  isNewChatOpen,
  setIsNewChatOpen,
  isCreateGroupOpen,
  setIsCreateGroupOpen,
  isInviteFriendsOpen,
  setIsInviteFriendsOpen,
  isGIFPickerOpen,
  setIsGIFPickerOpen,
  isReportOpen,
  setIsReportOpen,
  friends,
  activeChatMembers,
  selectedInvitedUsers,
  setSelectedInvitedUsers,
  groupName,
  setGroupName,
  groupDescription,
  setGroupDescription,
  reportReason,
  setReportReason,
  handleStartDM,
  handleCreateGroup,
  handleInviteToGroup,
  handleSendGIF,
  handleSubmitReport,
}: ChatModalsProps) {
  return (
    <>
      {/* ---------------------------------------------------- */}
      {/* MODAL: Select Friend to start DM                     */}
      {/* ---------------------------------------------------- */}
      <Dialog open={isNewChatOpen} onOpenChange={setIsNewChatOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl p-6 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
              Start New Conversation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550">
              Choose a Movie Friend
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {friends.length === 0 ? (
                <p className="text-xs text-zinc-500 italic py-4">
                  No active friends found. Search for users to add them as friends first!
                </p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.userId}
                    onClick={() => handleStartDM(friend.userId)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-zinc-900/60 cursor-pointer border border-transparent hover:border-zinc-850 transition-all text-xs"
                  >
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {friend.image && (
                        <AvatarImage src={friend.image} alt={friend.name} className="object-cover" />
                      )}
                      <AvatarFallback className="bg-zinc-900 text-zinc-300 font-bold text-xs">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <span className="font-bold text-white block">{friend.name}</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">
                        @{friend.username}
                      </span>
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
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
              Create Group Chat
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">
                Group Name
              </label>
              <Input
                type="text"
                placeholder="Movie Club, Watch Party, etc."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value.slice(0, 50))}
                className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 text-xs px-3 py-5 text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">
                Description (Optional)
              </label>
              <Input
                type="text"
                placeholder="What is this movie club about?"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value.slice(0, 150))}
                className="w-full rounded-xl border border-zinc-850 bg-zinc-900/30 text-xs px-3 py-5 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">
                Invite Friends
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1 scrollbar-thin border border-zinc-900 p-2 rounded-2xl bg-zinc-900/20">
                {friends.length === 0 ? (
                  <p className="text-[10px] text-zinc-650 italic py-2 text-center">
                    No active friends found
                  </p>
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
                            {friend.image && (
                              <AvatarImage
                                src={friend.image}
                                alt={friend.name}
                                className="object-cover"
                              />
                            )}
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

            <Button
              onClick={handleCreateGroup}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-5 font-bold uppercase tracking-wider text-[10px] mt-4 cursor-pointer"
            >
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
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <h3 className="text-xs font-black uppercase tracking-wider text-zinc-550">
              Select Friends to Invite
            </h3>
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin border border-zinc-900 p-2 rounded-2xl bg-zinc-900/20">
              {friends.length === 0 ? (
                <p className="text-xs text-zinc-650 italic text-center py-4">
                  No active friends found
                </p>
              ) : (
                friends.map((friend) => {
                  const isInvited = selectedInvitedUsers.has(friend.userId);
                  const isAlreadyMember = activeChatMembers?.some(
                    (m) => m.userId === friend.userId
                  );

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
                          {friend.image && (
                            <AvatarImage
                              src={friend.image}
                              alt={friend.name}
                              className="object-cover"
                            />
                          )}
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

            <Button
              onClick={handleInviteToGroup}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-5 font-bold uppercase tracking-wider text-[10px] mt-4 cursor-pointer"
            >
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
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
              Movie Reaction GIFs
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-center">
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
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white truncate w-full">
                      {gif.name}
                    </span>
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
            <DialogTitle className="text-base font-black uppercase tracking-wider text-white">
              Report Conversation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4 text-left">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500 block">
                Reason for Report
              </label>
              <textarea
                rows={4}
                placeholder="Explain the safety violation in detail (harassment, spam, abusive chat, etc.). Popcorn Vision security admins will review chat logs."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value.slice(0, 500))}
                className="w-full rounded-2xl border border-zinc-850 bg-zinc-900/30 p-4 text-xs text-white placeholder-zinc-550 outline-hidden focus:border-blue-500/50 resize-none min-h-[120px]"
              />
            </div>
            <Button
              onClick={handleSubmitReport}
              className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-5 font-bold uppercase tracking-wider text-[10px] mt-4 cursor-pointer"
            >
              Submit Safety Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
