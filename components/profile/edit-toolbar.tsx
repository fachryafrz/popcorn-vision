"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DiaryItem } from "./types";

interface EditToolbarProps {
  isOwner: boolean;
  items: ({ mediaId: string; mediaType: string } | DiaryItem)[] | undefined;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  selectedItems: Set<string>;
  handleSelectAll: (items: ({ mediaId: string; mediaType: string } | DiaryItem)[]) => void;
  handleBulkDelete: () => void;
  isBulkDeleting: boolean;
}

export function EditToolbar({
  isOwner,
  items,
  isEditMode,
  setIsEditMode,
  selectedItems,
  handleSelectAll,
  handleBulkDelete,
  isBulkDeleting,
}: EditToolbarProps) {
  if (!isOwner || !items || items.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-zinc-950/20 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className={cn(
            "h-9 cursor-pointer rounded-xl border-zinc-800 text-xs font-semibold",
            isEditMode && "border-zinc-700 bg-zinc-900 text-white",
          )}
        >
          {isEditMode ? "Exit Edit Mode" : "Edit List"}
        </Button>
        {isEditMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelectAll(items)}
            className="h-9 cursor-pointer rounded-xl text-xs font-semibold text-zinc-400 hover:text-white"
          >
            {selectedItems.size === items.length
              ? "Deselect All"
              : "Select All"}
          </Button>
        )}
      </div>

      {isEditMode && selectedItems.size > 0 && (
        <Button
          size="sm"
          onClick={handleBulkDelete}
          disabled={isBulkDeleting}
          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border-red-500 bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
        >
          {isBulkDeleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
          Remove Selected ({selectedItems.size})
        </Button>
      )}
    </div>
  );
}
