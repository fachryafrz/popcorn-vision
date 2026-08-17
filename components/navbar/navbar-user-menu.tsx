"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Activity,
  Search,
  MessageSquare,
  List,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarUserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  } | null;
  role?: string;
  onSignOut: () => Promise<void> | void;
}

export function NavbarUserMenu({
  user,
  role,
  onSignOut,
}: NavbarUserMenuProps) {
  const router = useRouter();
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  if (!user) return null;

  const navigateTo = (path: string) => {
    setDropdownMenuOpen(false);
    router.push(path);
  };

  return (
    <DropdownMenu open={dropdownMenuOpen} onOpenChange={setDropdownMenuOpen}>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 py-1.5 pr-3 pl-1.5 text-sm transition-all hover:border-zinc-700 hover:bg-zinc-800 focus:outline-none">
        <Avatar className="h-7 w-7">
          {user.image && (
            <AvatarImage
              src={user.image}
              alt={user.username || "User"}
              className="object-cover"
            />
          )}
          <AvatarFallback className="bg-primary text-xs font-bold text-white">
            {user.username?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[110px] truncate font-semibold text-zinc-200">
          {user.username}
        </span>
        <ChevronDown className="ml-0.5 h-3.5 w-3.5 text-zinc-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-52 rounded-2xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl shadow-black/60"
      >
        <Button
          onClick={() => navigateTo(`/@${user.username}`)}
          variant={"ghost"}
          className="mb-1 flex h-fit w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left hover:bg-zinc-900"
        >
          <Avatar className="h-8 w-8 shrink-0 border border-zinc-700/50">
            {user.image && (
              <AvatarImage
                src={user.image}
                alt={user.username || "User"}
                className="object-cover"
              />
            )}
            <AvatarFallback className="bg-primary text-xs font-bold text-white">
              {user.username?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{user.name}</p>
            <p className="truncate text-xs text-zinc-500">@{user.username}</p>
          </div>
        </Button>

        <DropdownMenuSeparator className="my-1 bg-zinc-800" />

        <DropdownMenuItem
          onClick={() => navigateTo("/feed")}
          className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
        >
          <Activity className="mr-2 h-4 w-4 text-zinc-400" />
          Feed
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigateTo("/search")}
          className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
        >
          <Search className="mr-2 h-4 w-4 text-zinc-400" />
          Search
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigateTo("/chat")}
          className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
        >
          <MessageSquare className="mr-2 h-4 w-4 text-zinc-400" />
          Chats
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigateTo("/lists")}
          className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
        >
          <List className="mr-2 h-4 w-4 text-zinc-400" />
          My Lists
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-zinc-800" />

        {(role === "owner" || role === "admin") && (
          <DropdownMenuItem
            onClick={() => navigateTo("/admin/users")}
            className="cursor-pointer rounded-xl px-3 py-2 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 focus:bg-amber-500/10 focus:text-amber-300"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-amber-400" />
            Admin Panel
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => navigateTo("/settings")}
          className="cursor-pointer rounded-xl px-3 py-2 text-zinc-300 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white"
        >
          <Settings className="mr-2 h-4 w-4 text-zinc-400" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-zinc-800" />

        <DropdownMenuItem
          onClick={() => {
            setDropdownMenuOpen(false);
            onSignOut();
          }}
          className="cursor-pointer rounded-xl px-3 py-2 text-red-400 hover:bg-red-950/60 hover:text-red-300 focus:bg-red-950/60 focus:text-red-300"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
