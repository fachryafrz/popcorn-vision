"use client";

import React from "react";
import { Crown, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role?: string;
  className?: string;
  showIcon?: boolean;
}

export function UserRoleBadge({
  role,
  className,
  showIcon = true,
}: UserRoleBadgeProps) {
  if (!role || role === "user") return null;

  const normalizedRole = role.toLowerCase();

  if (normalizedRole === "owner") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-md",
          "bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20",
          "text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]",
          "select-none",
          className
        )}
        title="Project Owner"
      >
        {showIcon && <Crown className="w-3 h-3 text-amber-400 fill-amber-400/20 shrink-0" />}
        <span>Owner</span>
      </span>
    );
  }

  if (normalizedRole === "admin") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-md",
          "bg-blue-500/15 text-blue-400 border border-blue-500/30",
          "select-none",
          className
        )}
        title="Administrator"
      >
        {showIcon && <ShieldCheck className="w-3 h-3 text-blue-400 shrink-0" />}
        <span>Admin</span>
      </span>
    );
  }

  return null;
}
