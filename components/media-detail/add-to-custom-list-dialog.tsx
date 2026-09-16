"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Check } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface CustomListItemSummary {
  _id: Id<"customLists">;
  name: string;
  isCollaborative?: boolean;
  hasMedia: boolean;
}

interface AddToCustomListDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  customLists: CustomListItemSummary[] | undefined;
  onToggleList: (list: CustomListItemSummary) => Promise<void>;
  onCreateListClick: () => void;
}

export default function AddToCustomListDialog({
  isOpen,
  onOpenChange,
  customLists,
  onToggleList,
  onCreateListClick,
}: AddToCustomListDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add to Custom List
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-87.5 space-y-4 overflow-y-auto py-4 pr-1">
          {customLists === undefined ? (
            <div className="flex justify-center py-6">
              <Loader2 className="text-primary h-6 w-6 animate-spin" />
            </div>
          ) : customLists.length === 0 ? (
            <div className="py-6 text-center">
              <p className="mb-4 text-sm text-zinc-500">
                You have not created or joined any custom lists yet.
              </p>
              <Button
                onClick={onCreateListClick}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-black hover:bg-zinc-200"
              >
                Create Custom List
              </Button>
            </div>
          ) : (
            customLists.map((list) => (
              <div
                key={list._id}
                onClick={() => onToggleList(list)}
                className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-zinc-900 bg-zinc-900/20 p-3 transition-all hover:border-zinc-800 hover:bg-zinc-900/60"
              >
                <div>
                  <p className="group-hover:text-primary text-sm font-bold text-white transition-colors">
                    {list.name}
                  </p>
                  {list.isCollaborative && (
                    <span className="text-primary border-primary/30 bg-primary/10 mt-1 inline-block rounded border px-1.5 py-0.5 text-[9px] font-extrabold uppercase">
                      Collaborative
                    </span>
                  )}
                </div>
                {list.hasMedia ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Plus className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-white" />
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
