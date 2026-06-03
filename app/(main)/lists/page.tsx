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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  List,
  Plus,
  Loader2,
  Calendar,
  ChevronRight,
  Globe,
  Lock,
  Heart,
  Users,
  Star,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface ListCreator {
  userId: string;
  username: string;
  name: string;
  image?: string;
}

interface CustomList {
  _id: string;
  name: string;
  description?: string;
  createdById: string;
  createdAt: number;
  privacy: string;
  isCollaborative: boolean;
  isWatchlist?: boolean;
  itemCount: number;
  likeCount: number;
  creator: ListCreator | null;
}

export default function ListsPage() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"my" | "public" | "favorites">(
    "my",
  );

  // Queries
  const myLists = useQuery(
    api.customLists.getUserLists,
    isLoggedIn ? {} : "skip",
  ) as CustomList[] | undefined;

  const publicLists = useQuery(api.customLists.getPublicLists, {}) as
    | CustomList[]
    | undefined;

  const favoriteLists = useQuery(
    api.customLists.getFavoritedLists,
    isLoggedIn ? {} : "skip",
  ) as CustomList[] | undefined;

  // Mutations
  const createListMutation = useMutation(api.customLists.createList);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private">("public");
  const [isCollaborative, setIsCollaborative] = useState(false);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a name for your list");
      return;
    }

    setIsCreating(true);
    try {
      const id = await createListMutation({
        name: name.trim(),
        description: description.trim() || undefined,
        privacy,
        isCollaborative,
        isWatchlist: isCollaborative ? isWatchlist : false,
      });
      toast.success("List created successfully!");
      setIsOpen(false);
      setName("");
      setDescription("");
      setPrivacy("public");
      setIsCollaborative(false);
      setIsWatchlist(false);
      router.push(`/lists/${id}`);
    } catch {
      toast.error("Failed to create list");
    } finally {
      setIsCreating(false);
    }
  };

  const renderListsList = (lists: CustomList[] | undefined) => {
    if (lists === undefined) {
      return (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      );
    }

    if (lists.length === 0) {
      return (
        <Card className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-900/10 p-12 text-center">
          <CardContent className="flex flex-col items-center justify-center p-0">
            <List className="text-zinc-650 mb-4 h-12 w-12" />
            <h3 className="text-lg font-bold text-zinc-300">No lists found</h3>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Create a custom collection or browse public lists to get started!
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {lists.map((list) => (
          <Link
            key={list._id}
            href={`/lists/${list._id}`}
            className="group block"
          >
            <Card className="h-full rounded-3xl border border-zinc-800 bg-zinc-900/30 transition-all hover:border-zinc-700 hover:bg-zinc-900/60">
              <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="group-hover:text-primary text-lg font-bold text-white transition-colors">
                      {list.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      {list.privacy === "public" ? (
                        <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-extrabold text-zinc-400">
                          <Globe className="h-3 w-3" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-extrabold text-zinc-400">
                          <Lock className="h-3 w-3" /> Private
                        </span>
                      )}
                      {list.isCollaborative && (
                        <span className="text-primary flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold">
                          <Users className="h-3 w-3" /> Collaborative
                        </span>
                      )}
                      {list.isWatchlist && (
                        <span className="text-emerald-400 flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-2 py-0.5 text-[10px] font-extrabold">
                          Watchlist
                        </span>
                      )}
                    </div>
                  </div>
                  {list.description && (
                    <CardDescription className="line-clamp-2 text-sm text-zinc-400">
                      {list.description}
                    </CardDescription>
                  )}
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-zinc-600 transition-colors group-hover:text-white" />
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-zinc-900 p-6 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-400">
                  <List className="h-3.5 w-3.5" />
                  {list.itemCount} {list.itemCount === 1 ? "title" : "titles"}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-rose-400">
                  <Heart className="h-3.5 w-3.5 fill-rose-400/10 transition-colors group-hover:fill-rose-400" />
                  {list.likeCount} {list.likeCount === 1 ? "like" : "likes"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(list.createdAt).toLocaleDateString()}
                </span>
                {list.creator && (
                  <span className="ml-auto text-zinc-500">
                    by{" "}
                    <span className="font-bold text-zinc-400">
                      @{list.creator.username}
                    </span>
                  </span>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto min-h-[85vh] w-full max-w-6xl px-6 py-24 text-white sm:px-12 md:px-16">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Custom Lists
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Create, share, and collaborate on personalized movie and TV show
            collections.
          </p>
        </div>

        {isLoggedIn && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger
              render={
                <Button className="cursor-pointer gap-2 rounded-2xl bg-white px-5 py-2.5 font-bold text-black hover:bg-zinc-200">
                  <Plus className="h-4 w-4" /> Create List
                </Button>
              }
            />
            <DialogContent className="max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 text-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  New Custom List
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
                  >
                    List Name
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Best Sci-Fi Movies, Top Horror"
                    className="placeholder:text-zinc-650 rounded-xl border-zinc-800 bg-zinc-900 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="desc"
                    className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
                  >
                    Description (Optional)
                  </label>
                  <Textarea
                    id="desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the theme of this list..."
                    className="placeholder:text-zinc-650 min-h-24 resize-none rounded-xl border-zinc-800 bg-zinc-900 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="privacy"
                    className="text-xs font-bold tracking-wider text-zinc-400 uppercase"
                  >
                    Privacy
                  </label>
                  <Select
                    value={privacy}
                    onValueChange={(val) =>
                      setPrivacy(val as "public" | "private")
                    }
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
                      id="collab"
                      checked={isCollaborative}
                      onCheckedChange={(checked) => {
                        setIsCollaborative(!!checked);
                        if (!checked) setIsWatchlist(false);
                      }}
                      className="border-zinc-800 bg-zinc-900"
                    />
                    <label
                      htmlFor="collab"
                      className="cursor-pointer text-xs font-bold text-zinc-300 select-none"
                    >
                      Collaborative List
                    </label>
                  </div>
                  {isCollaborative && (
                    <div className="flex items-center gap-2 mt-1.5 pl-6">
                      <Checkbox
                        id="watchlist"
                        checked={isWatchlist}
                        onCheckedChange={(checked) =>
                          setIsWatchlist(!!checked)
                        }
                        className="border-zinc-800 bg-zinc-900"
                      />
                      <label
                        htmlFor="watchlist"
                        className="cursor-pointer text-xs font-bold text-zinc-300 select-none"
                      >
                        Watchlist Mode (Voting & Watched status)
                      </label>
                    </div>
                  )}
                </div>
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="text-zinc-450 rounded-xl border-zinc-800 hover:bg-zinc-900 hover:text-white"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={isCreating}
                    className="rounded-xl bg-white font-bold text-black hover:bg-zinc-200"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Creating
                      </>
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-8 flex border-b border-zinc-900 text-sm">
        <button
          onClick={() => setActiveTab("my")}
          className={`mr-6 border-b-2 pb-4 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "my"
              ? "border-white font-extrabold text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          My Lists
        </button>
        <button
          onClick={() => setActiveTab("public")}
          className={`mr-6 border-b-2 pb-4 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "public"
              ? "border-white font-extrabold text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Public Lists
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`border-b-2 pb-4 text-xs font-bold tracking-wider uppercase transition-all ${
            activeTab === "favorites"
              ? "border-white font-extrabold text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Favorites
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "my" &&
        (isLoggedIn ? (
          renderListsList(myLists)
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <Lock className="mb-4 h-12 w-12 text-zinc-700" />
            <h3 className="text-lg font-bold text-white">Sign in required</h3>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Please sign in to view your custom collections and create
              collaborative lists.
            </p>
          </div>
        ))}
      {activeTab === "public" && renderListsList(publicLists)}
      {activeTab === "favorites" &&
        (isLoggedIn ? (
          renderListsList(favoriteLists)
        ) : (
          <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
            <Star className="mb-4 h-12 w-12 text-zinc-700" />
            <h3 className="text-lg font-bold text-white">Sign in required</h3>
            <p className="mt-2 max-w-sm text-sm text-zinc-500">
              Please sign in to view your saved favorite lists.
            </p>
          </div>
        ))}
    </div>
  );
}
