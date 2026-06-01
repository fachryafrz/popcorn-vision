"use client";

import React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditToolbarProps {
  isOwner: boolean;
  items: { mediaId: string; mediaType: string }[] | undefined;
  isEditMode: boolean;
  setIsEditMode: (mode: boolean) => void;
  selectedItems: Set<string>;
  handleSelectAll: (items: { mediaId: string; mediaType: string }[]) => void;
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
    <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950/20 mb-6 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className={cn(
            "rounded-xl text-xs font-semibold cursor-pointer h-9 border-zinc-800",
            isEditMode && "bg-zinc-900 border-zinc-700 text-white"
          )}
        >
          {isEditMode ? "Exit Edit Mode" : "Edit List"}
        </Button>
        {isEditMode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSelectAll(items)}
            className="rounded-xl text-xs font-semibold h-9 text-zinc-400 hover:text-white cursor-pointer"
          >
            {selectedItems.size === items.length ? "Deselect All" : "Select All"}
          </Button>
        )}
      </div>

      {isEditMode && selectedItems.size > 0 && (
        <Button
          size="sm"
          onClick={handleBulkDelete}
          disabled={isBulkDeleting}
          className="rounded-xl text-xs font-bold h-9 bg-red-600 hover:bg-red-500 text-white border-red-500 cursor-pointer shadow-md flex items-center gap-1.5"
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
