import { Check, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Friend, ChatMember } from "./types";

const REACTION_GIFS = [
  {
    name: "Excited Popcorn",
    url: "https://media.giphy.com/media/t3dL1FZZ0PDqM/giphy.gif",
  },
  {
    name: "Excited Minions",
    url: "https://media.giphy.com/media/11sBLVxNs7v6WA/giphy.gif",
  },
  {
    name: "Movie Laughing",
    url: "https://media.giphy.com/media/10yXFkB5RKaraU/giphy.gif",
  },
  {
    name: "Leonardo Cheers",
    url: "https://media.giphy.com/media/8Iv5lqKwKsZ2g/giphy.gif",
  },
  {
    name: "Movie Crying",
    url: "https://media.giphy.com/media/2WxWfiavndgc0/giphy.gif",
  },
  {
    name: "Shocked Popcorn",
    url: "https://media.giphy.com/media/3xkQex55IUP7y/giphy.gif",
  },
  {
    name: "Watching Closely",
    url: "https://media.giphy.com/media/13n7XeyIXEIrbG/giphy.gif",
  },
  {
    name: "Clapping Movie",
    url: "https://media.giphy.com/media/3o7qDEq2bMbcbPRVP2/giphy.gif",
  },
  {
    name: "Mind Blown",
    url: "https://media.giphy.com/media/xT0xeJpnrWC4XWblUk/giphy.gif",
  },
  {
    name: "Thumbs Up",
    url: "https://media.giphy.com/media/XreQmk7ETCak0/giphy.gif",
  },
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
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
              Start New Conversation
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-left">
            <h3 className="text-zinc-550 text-xs font-black tracking-wider uppercase">
              Choose a Movie Friend
            </h3>
            <div className="max-h-60 scrollbar-thin space-y-1.5 overflow-y-auto pr-1">
              {friends.length === 0 ? (
                <p className="py-4 text-xs text-zinc-500 italic">
                  No active friends found. Search for users to add them as
                  friends first!
                </p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.userId}
                    onClick={() => handleStartDM(friend.userId)}
                    className="hover:border-zinc-850 flex cursor-pointer items-center gap-3 rounded-2xl border border-transparent p-3 text-xs transition-all hover:bg-zinc-900/60"
                  >
                    <Avatar className="h-9 w-9 border border-zinc-800">
                      {friend.image && (
                        <AvatarImage
                          src={friend.image}
                          alt={friend.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="bg-zinc-900 text-xs font-bold text-zinc-300">
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <span className="block font-bold text-white">
                        {friend.name}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-zinc-500">
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
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
              Create Group Chat
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="block text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                Group Name
              </label>
              <Input
                type="text"
                placeholder="Movie Club, Watch Party, etc."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value.slice(0, 50))}
                className="border-zinc-850 w-full rounded-xl border bg-zinc-900/30 px-3 py-5 text-xs text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                Description (Optional)
              </label>
              <Input
                type="text"
                placeholder="What is this movie club about?"
                value={groupDescription}
                onChange={(e) =>
                  setGroupDescription(e.target.value.slice(0, 150))
                }
                className="border-zinc-850 w-full rounded-xl border bg-zinc-900/30 px-3 py-5 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                Invite Friends
              </label>
              <div className="max-h-40 scrollbar-thin space-y-1 overflow-y-auto rounded-2xl border border-zinc-900 bg-zinc-900/20 p-2 pr-1">
                {friends.length === 0 ? (
                  <p className="text-zinc-650 py-2 text-center text-[10px] italic">
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
                          if (updated.has(friend.userId))
                            updated.delete(friend.userId);
                          else updated.add(friend.userId);
                          setSelectedInvitedUsers(updated);
                        }}
                        className={cn(
                          "flex cursor-pointer items-center justify-between rounded-xl p-2 text-xs transition-colors",
                          isInvited
                            ? "bg-primary/10 text-white"
                            : "text-zinc-400 hover:bg-zinc-900/50",
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
                            <AvatarFallback className="bg-zinc-900 text-[8px] font-bold text-zinc-400">
                              {friend.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-bold">{friend.name}</span>
                        </div>
                        {isInvited && (
                          <Check className="text-primary h-3.5 w-3.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Button
              onClick={handleCreateGroup}
              className="hover:bg-primary bg-primary mt-4 w-full cursor-pointer rounded-xl py-5 text-[10px] font-bold tracking-wider text-white uppercase"
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
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
              Invite Friends
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-left">
            <h3 className="text-zinc-550 text-xs font-black tracking-wider uppercase">
              Select Friends to Invite
            </h3>
            <div className="max-h-60 scrollbar-thin space-y-1.5 overflow-y-auto rounded-2xl border border-zinc-900 bg-zinc-900/20 p-2 pr-1">
              {friends.length === 0 ? (
                <p className="text-zinc-650 py-4 text-center text-xs italic">
                  No active friends found
                </p>
              ) : (
                friends.map((friend) => {
                  const isInvited = selectedInvitedUsers.has(friend.userId);
                  const isAlreadyMember = activeChatMembers?.some(
                    (m) => m.userId === friend.userId,
                  );

                  return (
                    <div
                      key={friend.userId}
                      onClick={() => {
                        if (isAlreadyMember) return;
                        const updated = new Set(selectedInvitedUsers);
                        if (updated.has(friend.userId))
                          updated.delete(friend.userId);
                        else updated.add(friend.userId);
                        setSelectedInvitedUsers(updated);
                      }}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xl p-2 text-xs transition-colors",
                        isAlreadyMember
                          ? "cursor-not-allowed opacity-40"
                          : isInvited
                            ? "bg-primary/10 text-white"
                            : "text-zinc-400 hover:bg-zinc-900/50",
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
                          <AvatarFallback className="bg-zinc-900 text-[8px] font-bold text-zinc-400">
                            {friend.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold">{friend.name}</span>
                      </div>
                      {isAlreadyMember ? (
                        <span className="text-zinc-550 text-[8px] font-bold uppercase">
                          Member
                        </span>
                      ) : isInvited ? (
                        <Check className="text-primary h-3.5 w-3.5" />
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>

            <Button
              onClick={handleInviteToGroup}
              className="hover:bg-primary bg-primary mt-4 w-full cursor-pointer rounded-xl py-5 text-[10px] font-bold tracking-wider text-white uppercase"
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
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
              Movie Reaction GIFs
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-center">
            <h3 className="text-zinc-550 flex items-center justify-center gap-1.5 text-xs font-black tracking-wider uppercase">
              <TrendingUp className="text-primary h-4 w-4" />
              Select a GIF reaction
            </h3>
            <div className="grid max-h-80 scrollbar-thin grid-cols-2 gap-3 overflow-y-auto pr-1">
              {REACTION_GIFS.map((gif) => (
                <div
                  key={gif.name}
                  onClick={() => handleSendGIF(gif.url)}
                  className="group border-zinc-850 hover:border-primary relative aspect-video cursor-pointer overflow-hidden rounded-xl border bg-zinc-900 transition-all hover:scale-[1.02] active:scale-98"
                >
                  <img
                    src={gif.url}
                    alt={gif.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-end bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="w-full truncate text-[9px] font-bold tracking-wider text-white uppercase">
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
        <DialogContent className="max-w-md overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-base font-black tracking-wider text-white uppercase">
              Report Conversation
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-left">
            <div className="space-y-2">
              <label className="block text-[9px] font-black tracking-wider text-zinc-500 uppercase">
                Reason for Report
              </label>
              <textarea
                rows={4}
                placeholder="Explain the safety violation in detail (harassment, spam, abusive chat, etc.). Popcorn Vision security admins will review chat logs."
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value.slice(0, 500))}
                className="border-zinc-850 placeholder-zinc-550 focus:border-primary/50 min-h-[120px] w-full resize-none rounded-2xl border bg-zinc-900/30 p-4 text-xs text-white outline-hidden"
              />
            </div>
            <Button
              onClick={handleSubmitReport}
              className="hover:bg-primary bg-primary mt-4 w-full cursor-pointer rounded-xl py-5 text-[10px] font-bold tracking-wider text-white uppercase"
            >
              Submit Safety Report
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
