"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { UserRoleBadge } from "@/components/user-role-badge";
import { useConfirm } from "@/components/ui/confirm-provider";
import { toast } from "sonner";
import {
  Search,
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Ban,
  MoreVertical,
  Loader2,
  Users,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ManagedUser {
  _id: Id<"users">;
  userId: string;
  name: string;
  username: string;
  email: string;
  image?: string;
  role: string;
  status: string;
  country?: string;
  bio?: string;
}

interface UserManagementTableProps {
  currentUserRole: string;
}

export function UserManagementTable({
  currentUserRole,
}: UserManagementTableProps) {
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [loadingUserAction, setLoadingUserAction] = useState<string | null>(
    null,
  );

  const users = useQuery(api.users.getAdminUsersList, {
    search: search.trim() || undefined,
    roleFilter: roleFilter !== "all" ? roleFilter : undefined,
    statusFilter: statusFilter !== "all" ? statusFilter : undefined,
  }) as ManagedUser[] | undefined;

  const updateUserRoleMutation = useMutation(api.users.updateUserRole);
  const updateUserStatusMutation = useMutation(api.users.updateUserStatus);

  const handleRoleChange = async (user: ManagedUser, newRole: string) => {
    setActiveDropdown(null);
    if (user.role === newRole) return;

    if (currentUserRole !== "owner") {
      toast.error("Only the Owner can manage user roles");
      return;
    }

    if (
      await confirm({
        title: `Change User Role`,
        description: `Are you sure you want to change @${user.username}'s role from ${user.role.toUpperCase()} to ${newRole.toUpperCase()}?`,
        confirmText: "Change Role",
      })
    ) {
      setLoadingUserAction(user._id);
      try {
        await updateUserRoleMutation({
          targetUserId: user._id,
          newRole,
        });
        toast.success(`Role for @${user.username} changed to ${newRole}`);
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        toast.error(errorObj.message || "Failed to update role");
      } finally {
        setLoadingUserAction(null);
      }
    }
  };

  const handleStatusChange = async (user: ManagedUser, newStatus: string) => {
    setActiveDropdown(null);
    if (user.status === newStatus) return;

    const actionTitle =
      newStatus === "suspended"
        ? "Suspend User"
        : newStatus === "banned"
          ? "Ban User"
          : "Reactivate User";

    if (
      await confirm({
        title: actionTitle,
        description: `Are you sure you want to set @${user.username}'s status to ${newStatus.toUpperCase()}?`,
        confirmText: actionTitle,
      })
    ) {
      setLoadingUserAction(user._id);
      try {
        await updateUserStatusMutation({
          targetUserId: user._id,
          newStatus,
        });
        toast.success(`User @${user.username} status updated to ${newStatus}`);
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        toast.error(errorObj.message || "Failed to update status");
      } finally {
        setLoadingUserAction(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400">
            <UserCheck className="h-3 w-3" />
            Active
          </span>
        );
      case "suspended":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400">
            <UserX className="h-3 w-3" />
            Suspended
          </span>
        );
      case "banned":
        return (
          <span className="inline-flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-bold text-rose-400">
            <Ban className="h-3 w-3" />
            Banned
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-bold text-zinc-400">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <Input
            placeholder="Search by name, username, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="focus:border-primary rounded-xl border-zinc-800 bg-zinc-900/60 pl-9 text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(val) => setRoleFilter(val ?? "all")}
          >
            <SelectTrigger className="h-9 w-36 rounded-xl border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300 focus:border-zinc-700">
              <SelectValue>
                {roleFilter === "all"
                  ? "All Roles"
                  : roleFilter === "owner"
                    ? "Owner"
                    : roleFilter === "admin"
                      ? "Admin"
                      : "User"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-800 bg-zinc-950 text-zinc-300">
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val ?? "all")}
          >
            <SelectTrigger className="h-9 w-36 rounded-xl border-zinc-800 bg-zinc-900/60 text-xs text-zinc-300 focus:border-zinc-700">
              <SelectValue>
                {statusFilter === "all"
                  ? "All Statuses"
                  : statusFilter === "active"
                    ? "Active"
                    : statusFilter === "suspended"
                      ? "Suspended"
                      : "Banned"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-zinc-800 bg-zinc-950 text-zinc-300">
              <SelectGroup>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 shadow-xl backdrop-blur-md">
        {users === undefined ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-zinc-500">
            <Loader2 className="text-primary h-6 w-6 animate-spin" />
            <span className="text-xs font-semibold">
              Loading users database...
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-zinc-500">
            <Users className="h-8 w-8 text-zinc-600" />
            <span className="text-sm font-semibold text-zinc-400">
              No users found
            </span>
            <span className="text-xs text-zinc-600">
              Try adjusting your search query or filters.
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
                <tr>
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {users.map((user) => {
                  const fallbackInitial = user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "?";
                  const isLoadingThis = loadingUserAction === user._id;

                  return (
                    <tr
                      key={user._id}
                      className="transition-colors hover:bg-zinc-800/20"
                    >
                      {/* User Column */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Link href={`/@${user.username}`}>
                            <Avatar className="hover:ring-primary/50 h-9 w-9 border border-zinc-800 transition-all hover:ring-2">
                              <AvatarImage src={user.image} alt={user.name} />
                              <AvatarFallback className="bg-zinc-800 text-xs font-bold text-zinc-300">
                                {fallbackInitial}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          <div>
                            <div className="flex items-center gap-1.5 font-bold text-white">
                              <Link
                                href={`/@${user.username}`}
                                className="hover:underline"
                              >
                                {user.name}
                              </Link>
                              <UserRoleBadge role={user.role} />
                            </div>
                            <span className="text-[11px] font-semibold text-zinc-500">
                              @{user.username}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-3.5 font-medium whitespace-nowrap text-zinc-400">
                        {user.email}
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="font-bold text-zinc-300 capitalize">
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        {isLoadingThis ? (
                          <Loader2 className="inline-block h-4 w-4 animate-spin text-zinc-400" />
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 p-0 text-zinc-400 outline-none hover:bg-zinc-800 hover:text-white">
                              <MoreVertical className="h-4 w-4 text-zinc-400" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-2xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-2xl"
                            >
                              {/* Quick Navigation Link for All Users */}
                              <DropdownMenuGroup>
                                <DropdownMenuItem className="rounded-xl p-0">
                                  <Link
                                    href={`/@${user.username}`}
                                    className="flex w-full cursor-pointer items-center px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white focus:bg-zinc-800 focus:text-white"
                                  >
                                    <Users className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                                    View Profile
                                  </Link>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>

                              {/* Role Management */}
                              {currentUserRole === "owner" &&
                                user.role !== "owner" && (
                                  <>
                                    <DropdownMenuSeparator className="my-1 bg-zinc-800" />
                                    <DropdownMenuGroup>
                                      <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase">
                                        Change Role
                                      </DropdownMenuLabel>
                                      {user.role !== "admin" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRoleChange(user, "admin")
                                          }
                                          className="cursor-pointer rounded-xl text-xs font-semibold text-blue-400 focus:bg-blue-500/10 focus:text-blue-300"
                                        >
                                          <ShieldCheck className="mr-2 h-3.5 w-3.5 text-blue-400" />
                                          Make Admin
                                        </DropdownMenuItem>
                                      )}
                                      {user.role !== "user" && (
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRoleChange(user, "user")
                                          }
                                          className="cursor-pointer rounded-xl text-xs font-semibold text-zinc-300 focus:bg-zinc-800 focus:text-white"
                                        >
                                          <Shield className="mr-2 h-3.5 w-3.5 text-zinc-400" />
                                          Demote to User
                                        </DropdownMenuItem>
                                      )}
                                    </DropdownMenuGroup>
                                  </>
                                )}

                              {/* Account Status Management */}
                              {user.role !== "owner" ? (
                                <>
                                  <DropdownMenuSeparator className="my-1 bg-zinc-800" />
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel className="px-2 py-1 text-[10px] font-bold text-zinc-500 uppercase">
                                      Account Status
                                    </DropdownMenuLabel>
                                    {user.status !== "active" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user, "active")
                                        }
                                        className="cursor-pointer rounded-xl text-xs font-semibold text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-300"
                                      >
                                        <UserCheck className="mr-2 h-3.5 w-3.5 text-emerald-400" />
                                        Activate User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "suspended" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user, "suspended")
                                        }
                                        className="cursor-pointer rounded-xl text-xs font-semibold text-amber-400 focus:bg-amber-500/10 focus:text-amber-300"
                                      >
                                        <UserX className="mr-2 h-3.5 w-3.5 text-amber-400" />
                                        Suspend User
                                      </DropdownMenuItem>
                                    )}
                                    {user.status !== "banned" && (
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleStatusChange(user, "banned")
                                        }
                                        className="cursor-pointer rounded-xl text-xs font-semibold text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"
                                      >
                                        <Ban className="mr-2 h-3.5 w-3.5 text-rose-400" />
                                        Ban Account
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuGroup>
                                </>
                              ) : (
                                <>
                                  <DropdownMenuSeparator className="my-1 bg-zinc-800" />
                                  <DropdownMenuGroup>
                                    <DropdownMenuLabel className="px-2 py-1 text-[10px] font-medium text-zinc-500 italic">
                                      Owner accounts are protected & cannot be
                                      suspended.
                                    </DropdownMenuLabel>
                                  </DropdownMenuGroup>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
