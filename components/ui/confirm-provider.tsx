"use client";

import React from "react";
import { create } from "zustand";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmOptions {
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

interface ConfirmStore {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  resolve: ((value: boolean) => void) | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  close: (value: boolean) => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  title: "Confirm Action",
  description: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  resolve: null,
  confirm: (options) => {
    return new Promise<boolean>((resolve) => {
      set({
        isOpen: true,
        title: options.title ?? "Confirm Action",
        description: options.description,
        confirmText: options.confirmText ?? "Confirm",
        cancelText: options.cancelText ?? "Cancel",
        resolve,
      });
    });
  },
  close: (value) => {
    const { resolve } = get();
    if (resolve) {
      resolve(value);
    }
    set({ isOpen: false, resolve: null });
  },
}));

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useConfirmStore((state) => state.isOpen);
  const title = useConfirmStore((state) => state.title);
  const description = useConfirmStore((state) => state.description);
  const confirmText = useConfirmStore((state) => state.confirmText);
  const cancelText = useConfirmStore((state) => state.cancelText);
  const close = useConfirmStore((state) => state.close);

  return (
    <>
      {children}
      <AlertDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            close(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => close(false)}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => close(true)}>
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function useConfirm() {
  return useConfirmStore((state) => state.confirm);
}
