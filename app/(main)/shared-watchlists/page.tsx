"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Users, Plus, Loader2, Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SharedWatchlistsPage() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const router = useRouter();

  const watchlists = useQuery(
    api.sharedWatchlists.getWatchlists,
    isLoggedIn ? {} : "skip"
  );
  const createWatchlist = useMutation(api.sharedWatchlists.createWatchlist);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a name for the watchlist");
      return;
    }

    setIsCreating(true);
    try {
      const id = await createWatchlist({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      toast.success("Shared watchlist created!");
      setIsOpen(false);
      setName("");
      setDescription("");
      router.push(`/shared-watchlists/${id}`);
    } catch {
      toast.error("Failed to create shared watchlist");
    } finally {
      setIsCreating(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[60vh] grow flex-col items-center justify-center bg-zinc-950 px-6 text-center text-white">
        <Users className="mb-4 h-16 w-16 text-zinc-700" />
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-white">
          Shared Watchlists
        </h1>
        <p className="mb-6 max-w-md text-sm text-zinc-400">
          Create collaborative watchlists with your friends to track movies and TV shows together. Please sign in to access this feature.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-[85vh] w-full max-w-6xl px-6 py-24 text-white sm:px-12 md:px-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Shared Watchlists
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Collaborate on lists, invite friends, vote on titles, and track watched history together.
          </p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="cursor-pointer gap-2 rounded-2xl bg-white px-5 py-2.5 font-bold text-black hover:bg-zinc-200">
                <Plus className="h-4 w-4" /> Create Watchlist
              </Button>
            }
          />
          <DialogContent className="border border-zinc-800 bg-zinc-950 text-white rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">New Collaborative Watchlist</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Watchlist Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Movie Night, Family Favorites"
                  className="border-zinc-800 bg-zinc-900 text-white rounded-xl placeholder:text-zinc-650"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="desc" className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Description (Optional)
                </label>
                <Textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the mood or purpose of this list..."
                  className="border-zinc-800 bg-zinc-900 text-white rounded-xl placeholder:text-zinc-650 min-h-24 resize-none"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="border-zinc-800 text-zinc-450 hover:bg-zinc-900 hover:text-white rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-white text-black hover:bg-zinc-200 rounded-xl font-bold"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    </>
                  ) : (
                    "Create"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {watchlists === undefined ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : watchlists.length === 0 ? (
        <Card className="border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center rounded-3xl">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <Users className="mb-4 h-12 w-12 text-zinc-650" />
            <h3 className="text-lg font-bold text-zinc-300">No watchlists found</h3>
            <p className="mt-2 text-sm text-zinc-500 max-w-sm">
              Create a new watchlist above or have your friends invite you to theirs to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {watchlists.map((watchlist) => (
            <Link key={watchlist._id} href={`/shared-watchlists/${watchlist._id}`} className="group block">
              <Card className="h-full border border-zinc-800 bg-zinc-900/30 transition-all hover:border-zinc-700 hover:bg-zinc-900/60 rounded-3xl">
                <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                      {watchlist.name}
                    </CardTitle>
                    {watchlist.description && (
                      <CardDescription className="line-clamp-2 text-sm text-zinc-400">
                        {watchlist.description}
                      </CardDescription>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
                </CardHeader>
                <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-900 p-6 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5 font-semibold text-zinc-400">
                    <Users className="h-3.5 w-3.5" />
                    {watchlist.memberCount} {watchlist.memberCount === 1 ? "member" : "members"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Created {new Date(watchlist.createdAt).toLocaleDateString()}
                  </span>
                  {watchlist.creator && (
                    <span className="ml-auto text-zinc-500">
                      by <span className="font-bold text-zinc-400">@{watchlist.creator.username}</span>
                    </span>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
