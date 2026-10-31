"use client";

import { useState, useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/components/ui/confirm-provider";
import { invalidateStreamingServersCache } from "@/hooks/use-streaming-servers";
import {
  ServerFormDialog,
  ManagedServerItem,
  ServerFormData,
} from "./server-form-dialog";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Server,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  ExternalLink,
  ThumbsUp,
  Zap,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  XCircle,
  Copy,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ServerManagementTable() {
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingServer, setEditingServer] = useState<ManagedServerItem | null>(null);

  const servers = useQuery(api.streamingServers.getAdminServers);
  const createServerMutation = useMutation(api.streamingServers.createServer);
  const updateServerMutation = useMutation(api.streamingServers.updateServer);
  const toggleActiveMutation = useMutation(api.streamingServers.toggleServerActive);
  const deleteServerMutation = useMutation(api.streamingServers.deleteServer);
  const reorderServersMutation = useMutation(api.streamingServers.reorderServers);

  const filteredServers = useMemo(() => {
    if (!servers) return [];
    return servers.filter((s) => {
      const matchesSearch =
        search.trim() === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.movieUrl.toLowerCase().includes(search.toLowerCase()) ||
        s.tvUrl.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && s.isActive) ||
        (statusFilter === "inactive" && !s.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [servers, search, statusFilter]);

  const handleToggleActive = async (id: Id<"streamingServers">, currentActive: boolean) => {
    try {
      await toggleActiveMutation({ id, isActive: !currentActive });
      invalidateStreamingServersCache();
      toast.success(!currentActive ? "Server activated" : "Server disabled");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle status";
      toast.error(msg);
    }
  };

  const handleDelete = async (server: ManagedServerItem) => {
    if (!server._id) return;
    const ok = await confirm({
      title: "Delete Streaming Server",
      description: `Are you sure you want to delete server "${server.title}"? Users will no longer be able to select this server.`,
      confirmText: "Delete Server",
    });

    if (!ok) return;

    try {
      await deleteServerMutation({ id: server._id });
      invalidateStreamingServersCache();
      toast.success(`Server "${server.title}" deleted`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete server";
      toast.error(msg);
    }
  };

  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    if (!servers) return;
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= servers.length) return;

    const newOrder = [...servers];
    const [moved] = newOrder.splice(currentIndex, 1);
    newOrder.splice(targetIndex, 0, moved);

    try {
      await reorderServersMutation({
        orderedIds: newOrder.map((s) => s._id),
      });
      invalidateStreamingServersCache();
      toast.success("Order updated");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reorder servers";
      toast.error(msg);
    }
  };

  const handleSaveForm = async (data: ServerFormData) => {
    if (editingServer?._id) {
      await updateServerMutation({
        id: editingServer._id,
        ...data,
      });
    } else {
      await createServerMutation({
        ...data,
      });
    }
    invalidateStreamingServersCache();
  };

  const handleTestLink = (urlTemplate: string, isTv = false) => {
    if (!urlTemplate) {
      toast.info("No URL configured for this media type");
      return;
    }
    // Test with Fight Club (550) or Game of Thrones (1399 season 1 ep 1)
    const testUrl = urlTemplate
      .replaceAll("{id}", isTv ? "1399" : "550")
      .replaceAll("{season}", "1")
      .replaceAll("{episode}", "1");

    window.open(testUrl, "_blank", "noopener,noreferrer");
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard");
  };

  return (
    <div className="space-y-6">
      {/* Search & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-60 flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              placeholder="Search by server name or URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border-zinc-800 bg-zinc-900/90 pl-10 text-sm text-white placeholder:text-zinc-500 focus-visible:ring-primary"
            />
          </div>

          <div className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 text-xs font-semibold ${
                statusFilter === "all"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              All ({servers?.length ?? 0})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("active")}
              className={`rounded-lg px-3 text-xs font-semibold ${
                statusFilter === "active"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Active ({servers?.filter((s) => s.isActive).length ?? 0})
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("inactive")}
              className={`rounded-lg px-3 text-xs font-semibold ${
                statusFilter === "inactive"
                  ? "bg-rose-500/20 text-rose-300"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Inactive ({servers?.filter((s) => !s.isActive).length ?? 0})
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              setEditingServer(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 rounded-xl px-4 font-bold text-white shadow-lg"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add Server
          </Button>
        </div>
      </div>

      {/* Main Table Content */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 backdrop-blur-sm overflow-hidden">
        {servers === undefined ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <span className="text-sm font-semibold text-zinc-400">Loading streaming servers...</span>
          </div>
        ) : servers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-zinc-400 mb-3">
              <Server className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Streaming Servers Added</h3>
            <p className="max-w-md text-xs text-zinc-400 mb-6">
              No streaming servers have been added yet. The player will use default playback sources.
            </p>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  setEditingServer(null);
                  setIsFormOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 rounded-xl font-bold text-white shadow-lg"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Server
              </Button>
            </div>
          </div>
        ) : filteredServers.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500">
            No servers matched your filter or search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800/80 bg-zinc-900/50 text-xs font-semibold text-zinc-400">
                <tr>
                  <th className="py-3.5 pl-4 pr-2 w-16 text-center">Order</th>
                  <th className="py-3.5 px-4 min-w-45">Server Name</th>
                  <th className="py-3.5 px-4">Badges</th>
                  <th className="py-3.5 px-4 min-w-65">Video URLs</th>
                  <th className="py-3.5 px-4 text-center">Active</th>
                  <th className="py-3.5 pl-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredServers.map((server, idx) => (
                  <tr
                    key={server._id}
                    className={`transition-colors hover:bg-zinc-900/40 ${
                      !server.isActive ? "opacity-60" : ""
                    }`}
                  >
                    {/* Order Controls */}
                    <td className="py-4 pl-4 pr-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="w-5 text-center font-mono text-xs font-bold text-zinc-400">
                          {server.order}
                        </span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => handleMove(idx, "up")}
                            disabled={idx === 0}
                            title="Move up"
                            className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(idx, "down")}
                            disabled={idx === filteredServers.length - 1}
                            title="Move down"
                            className="text-zinc-500 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-500"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Server Name & Status */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-white flex items-center gap-2">
                          {server.title}
                          {server.isActive ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-zinc-500" />
                          )}
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          {server.isActive ? "Visible in player" : "Hidden from player"}
                        </span>
                      </div>
                    </td>

                    {/* Badges */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {server.recommended && (
                          <Badge className="bg-amber-500/15 border border-amber-500/30 text-amber-300 gap-1 text-[10px] py-0">
                            <ThumbsUp className="h-2.5 w-2.5" /> Recommended
                          </Badge>
                        )}
                        {server.fast && (
                          <Badge className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 gap-1 text-[10px] py-0">
                            <Zap className="h-2.5 w-2.5" /> Fast
                          </Badge>
                        )}
                        {server.ads && (
                          <Badge variant="outline" className="border-rose-500/30 text-rose-300 text-[10px] py-0 gap-1">
                            <ShieldAlert className="h-2.5 w-2.5" /> Ads
                          </Badge>
                        )}
                      </div>
                    </td>

                    {/* URLs */}
                    <td className="py-4 px-4">
                      <div className="space-y-1 max-w-sm">
                        {server.movieUrl && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300 uppercase">
                              Movie
                            </span>
                            <span className="truncate font-mono text-[11px] text-zinc-400">
                              {server.movieUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(server.movieUrl)}
                              title="Copy Movie URL"
                              className="text-zinc-500 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTestLink(server.movieUrl, false)}
                              title="Preview Movie Link"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        )}

                        {server.tvUrl && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-300 uppercase">
                              TV
                            </span>
                            <span className="truncate font-mono text-[11px] text-zinc-400">
                              {server.tvUrl}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyUrl(server.tvUrl)}
                              title="Copy TV URL"
                              className="text-zinc-500 hover:text-white"
                            >
                              <Copy className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTestLink(server.tvUrl, true)}
                              title="Preview TV Link"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Active Switch */}
                    <td className="py-4 px-4 text-center">
                      <Switch
                        checked={server.isActive}
                        onCheckedChange={() => handleToggleActive(server._id, server.isActive)}
                      />
                    </td>

                    {/* Actions Menu */}
                    <td className="py-4 pl-2 pr-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-0 p-0 text-zinc-400 outline-none hover:bg-zinc-800 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl border-zinc-800 bg-zinc-950 text-white">
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingServer(server);
                              setIsFormOpen(true);
                            }}
                            className="cursor-pointer gap-2 text-xs"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-sky-400" />
                            <span>Edit Server</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleTestLink(server.movieUrl || server.tvUrl, !server.movieUrl)}
                            className="cursor-pointer gap-2 text-xs"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Preview Player</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-zinc-800" />

                          <DropdownMenuItem
                            onClick={() => handleDelete(server)}
                            className="cursor-pointer gap-2 text-xs text-rose-400 focus:text-rose-400 focus:bg-rose-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Server</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <ServerFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialData={editingServer}
        defaultOrder={(servers?.length ?? 0) + 1}
        onSave={handleSaveForm}
      />
    </div>
  );
}
