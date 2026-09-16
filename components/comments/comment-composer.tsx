"use client";

import React, { useState, useRef } from "react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Send } from "lucide-react";

interface CommentComposerProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  placeholder: string;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function CommentComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder,
  onCancel,
  submitLabel = "Post Comment",
}: CommentComposerProps) {
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Search users based on query
  const searchResults = useQuery(
    api.social.searchUsers,
    mentionQuery !== null && mentionQuery.trim().length >= 1
      ? { query: mentionQuery }
      : "skip",
  );

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);

    const selectionEnd = e.target.selectionEnd;
    const textBeforeCursor = val.substring(0, selectionEnd);

    // Find if the cursor is currently inside an active @mention block
    const mentionRegex = /@([a-zA-Z0-9_]*)$/;
    const match = textBeforeCursor.match(mentionRegex);

    if (match) {
      setMentionQuery(match[1]);
    } else {
      setMentionQuery(null);
    }
  };

  const handleSelectMention = (username: string) => {
    if (!textareaRef.current) return;
    const selectionEnd = textareaRef.current.selectionEnd;
    const textBeforeCursor = value.substring(0, selectionEnd);
    const textAfterCursor = value.substring(selectionEnd);

    // Replace the incomplete `@username` with the full selection
    const lastAtIdx = textBeforeCursor.lastIndexOf("@");
    const newTextBeforeCursor =
      textBeforeCursor.substring(0, lastAtIdx) + `@${username} `;

    onChange(newTextBeforeCursor + textAfterCursor);
    setMentionQuery(null);

    // Re-focus and update cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const cursorPosition = newTextBeforeCursor.length;
        textareaRef.current.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 10);
  };

  return (
    <form onSubmit={onSubmit} className="relative space-y-2">
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="min-h-[90px] rounded-2xl border-zinc-800/80 bg-zinc-900 pr-10 text-white focus-visible:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-700"
          required
        />
      </div>

      {/* Mention Dropdown */}
      {mentionQuery !== null && searchResults && searchResults.length > 0 && (
        <div className="absolute right-0 left-0 z-40 mt-1 max-h-48 max-w-sm divide-y divide-zinc-800/60 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl">
          {searchResults.map((user) => (
            <button
              key={user.userId}
              type="button"
              onClick={() => handleSelectMention(user.username)}
              className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-zinc-800"
            >
              <Avatar className="h-7 w-7 border border-zinc-800">
                {user.image && <AvatarImage src={user.image} alt={user.name} />}
                <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="group-hover:text-primary truncate text-xs font-semibold text-white transition-colors">
                  {user.name}
                </p>
                <p className="truncate text-[10px] text-zinc-500">
                  @{user.username}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Action triggers */}
      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="h-8 cursor-pointer rounded-xl text-xs font-semibold"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting || !value.trim()}
          size="sm"
          className="h-8 cursor-pointer rounded-xl bg-white text-xs font-bold text-black hover:bg-zinc-200"
        >
          {isSubmitting ? (
            "Sending…"
          ) : (
            <>
              <Send className="mr-1.5 h-3 w-3" />
              {submitLabel}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
