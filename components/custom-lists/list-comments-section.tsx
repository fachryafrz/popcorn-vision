"use client";

import React, { useState } from "react";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@/convex/_generated/dataModel";
import { CustomListComment } from "./types";

interface ListCommentsSectionProps {
  comments: CustomListComment[];
  isLoggedIn: boolean;
  currentUserId?: string;
  isOwner: boolean;
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment: (commentId: Id<"customListComments">) => Promise<void>;
}

export default function ListCommentsSection({
  comments,
  isLoggedIn,
  currentUserId,
  isOwner,
  onAddComment,
  onDeleteComment,
}: ListCommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;
    setSubmittingComment(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment("");
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/10 p-6">
      <h3 className="flex items-center gap-2 border-b border-zinc-900 pb-3 text-lg font-bold">
        <MessageSquare className="text-primary h-5 w-5" /> Comments
      </h3>

      {/* Comment Form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts on this list..."
            className="min-h-16 resize-none rounded-xl border-zinc-800 bg-zinc-900 text-xs text-white placeholder:text-zinc-500"
            required
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submittingComment}
              className="h-8 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-black hover:bg-zinc-200"
            >
              {submittingComment ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="py-2 text-center text-xs text-zinc-500">
          Sign in to post comments.
        </p>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <p className="py-6 text-center text-xs text-zinc-500">
          No comments yet. Start the conversation!
        </p>
      ) : (
        <div className="max-h-[400px] space-y-4 overflow-y-auto pr-1">
          {comments.map((comment) => {
            const isCommentAuthor = comment.userId === currentUserId;
            const canDelete = isOwner || isCommentAuthor;

            return (
              <div
                key={comment._id}
                className="flex gap-3 border-b border-zinc-900/50 pb-3 text-xs"
              >
                <Avatar className="h-7 w-7 shrink-0 border border-zinc-800">
                  {comment.author.image && (
                    <AvatarImage
                      src={comment.author.image}
                      alt={comment.author.name}
                    />
                  )}
                  <AvatarFallback className="bg-zinc-850 text-[10px] font-bold text-zinc-400">
                    {comment.author.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-zinc-300">
                      {comment.author.name}{" "}
                      <span className="font-normal text-zinc-500">
                        @{comment.author.username}
                      </span>
                    </p>
                    {canDelete && (
                      <button
                        onClick={() => onDeleteComment(comment._id)}
                        className="cursor-pointer text-zinc-500 transition-colors hover:text-red-400"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="leading-normal whitespace-pre-wrap text-zinc-400">
                    {comment.content}
                  </p>
                  <p className="text-[10px] text-zinc-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
