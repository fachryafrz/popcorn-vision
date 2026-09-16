"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Loader2 } from "lucide-react";
import { CustomList } from "./types";

interface EditListDialogProps {
  list: CustomList;
  onUpdate: (data: {
    name: string;
    description: string;
    privacy: "public" | "private";
    isCollaborative: boolean;
    isWatchlist: boolean;
  }) => Promise<void>;
  onDelete: () => Promise<void>;
}

export default function EditListDialog({
  list,
  onUpdate,
  onDelete,
}: EditListDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description || "");
  const [privacy, setPrivacy] = useState<"public" | "private">(
    (list.privacy as "public" | "private") || "public",
  );
  const [isCollaborative, setIsCollaborative] = useState(list.isCollaborative);
  const [isWatchlist, setIsWatchlist] = useState(list.isWatchlist || false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onUpdate({
        name: name.trim(),
        description: description.trim(),
        privacy,
        isCollaborative,
        isWatchlist,
      });
      setIsOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) {
          setName(list.name);
          setDescription(list.description || "");
          setPrivacy((list.privacy as "public" | "private") || "public");
          setIsCollaborative(list.isCollaborative);
          setIsWatchlist(list.isWatchlist || false);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className="cursor-pointer gap-2 rounded-xl border-zinc-800 text-zinc-300 hover:bg-zinc-900"
          >
            <Edit2 className="h-4 w-4" /> Edit List
          </Button>
        }
      />
      <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit List Details
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <label
              htmlFor="edit-name"
              className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
            >
              List Name
            </label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl border-zinc-800 bg-zinc-900 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="edit-desc"
              className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
            >
              Description (Optional)
            </label>
            <Textarea
              id="edit-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 resize-none rounded-xl border-zinc-800 bg-zinc-900 text-white"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="edit-privacy"
              className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
            >
              Privacy
            </label>
            <Select
              value={privacy}
              onValueChange={(val) => setPrivacy(val as "public" | "private")}
            >
              <SelectTrigger className="flex h-10 w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-sm text-white">
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent className="border-zinc-850 rounded-xl border bg-zinc-950 text-white">
                <SelectGroup>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col justify-end space-y-2 pb-1">
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-collab"
                checked={isCollaborative}
                onCheckedChange={(checked) => {
                  setIsCollaborative(!!checked);
                  if (!checked) setIsWatchlist(false);
                }}
                className="border-zinc-800 bg-zinc-900"
              />
              <label
                htmlFor="edit-collab"
                className="cursor-pointer text-xs font-bold text-zinc-300"
              >
                Collaborative List
              </label>
            </div>
            {isCollaborative && (
              <div className="mt-1.5 flex items-center gap-2 pl-6">
                <Checkbox
                  id="edit-watchlist"
                  checked={isWatchlist}
                  onCheckedChange={(checked) => setIsWatchlist(!!checked)}
                  className="border-zinc-800 bg-zinc-900"
                />
                <label
                  htmlFor="edit-watchlist"
                  className="cursor-pointer text-xs font-bold text-zinc-300"
                >
                  Watchlist Mode (Voting & Watched status)
                </label>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between pt-4">
            <Button
              type="button"
              variant="destructive"
              onClick={onDelete}
              className="rounded-xl font-bold"
            >
              Delete List
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-white font-bold text-black hover:bg-zinc-200"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
