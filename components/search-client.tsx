"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { searchMedia } from "@/lib/tmdb-actions";
import { TMDBMedia } from "@/lib/tmdb";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { Search, Film, Tv, LayoutGrid, X, User, UserPlus, UserCheck, UserX, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Card from "@/components/card";
import QuickViewModal from "@/components/quick-view-modal";
import AuthModal from "@/components/auth-modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { toast } from "sonner";

interface SearchClientProps {
  initialResults: TMDBMedia[];
  initialQuery: string;
  initialType: "all" | "movie" | "tv" | "users";
}

const TYPE_FILTERS: { label: string; value: "all" | "movie" | "tv" | "users"; icon: React.ReactNode }[] = [
  { label: "All", value: "all", icon: <LayoutGrid className="h-3.5 w-3.5" /> },
  { label: "Movies", value: "movie", icon: <Film className="h-3.5 w-3.5" /> },
  { label: "TV Series", value: "tv", icon: <Tv className="h-3.5 w-3.5" /> },
  { label: "Users", value: "users", icon: <User className="h-3.5 w-3.5" /> },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="aspect-2/3 w-full rounded-2xl bg-zinc-800" />
      <div className="h-4 rounded bg-zinc-800 w-3/4" />
      <div className="h-3 rounded bg-zinc-800/60 w-1/2" />
    </div>
  );
}

function UserSkeletonCard() {
  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex gap-4 items-center">
        <div className="h-14 w-14 rounded-full bg-zinc-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-zinc-800 rounded w-3/4" />
          <div className="h-3 bg-zinc-800/60 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-zinc-800 rounded w-full" />
      <div className="h-3 bg-zinc-800 rounded w-5/6" />
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="h-9 bg-zinc-800 rounded-xl" />
        <div className="h-9 bg-zinc-800 rounded-xl" />
      </div>
    </div>
  );
}

interface UserCardProps {
  user: {
    _id: string;
    userId: string;
    username: string;
    name: string;
    bio?: string;
    image?: string;
    friendCount: number;
    friendshipStatus: string;
  };
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

function UserCard({ user, onAuthRequired, isLoggedIn }: UserCardProps) {
  const [friendLoading, setFriendLoading] = useState(false);

  const sendFriendRequest = useMutation(api.social.sendFriendRequest);
  const cancelFriendRequest = useMutation(api.social.cancelFriendRequest);
  const acceptFriendRequest = useMutation(api.social.acceptFriendRequest);
  const removeFriend = useMutation(api.social.removeFriend);

  const handleFriendAction = async () => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    setFriendLoading(true);
    try {
      if (user.friendshipStatus === "none") {
        await sendFriendRequest({ targetUserId: user.userId });
        toast.success("Friend request sent!");
      } else if (user.friendshipStatus === "request_sent") {
        await cancelFriendRequest({ targetUserId: user.userId });
        toast.success("Friend request cancelled.");
      } else if (user.friendshipStatus === "request_received") {
        await acceptFriendRequest({ targetUserId: user.userId });
        toast.success("Friend request accepted!");
      } else if (user.friendshipStatus === "friends") {
        if (confirm(`Are you sure you want to remove ${user.name} from friends?`)) {
          await removeFriend({ targetUserId: user.userId });
          toast.success("Friend removed.");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Friend action failed.");
    } finally {
      setFriendLoading(false);
    }
  };

  // Determine Friend Button style & content
  let friendLabel = "Add Friend";
  let FriendIcon = UserPlus;
  let friendVariant: "default" | "secondary" | "outline" | "destructive" = "outline";

  if (user.friendshipStatus === "request_sent") {
    friendLabel = "Cancel Request";
    FriendIcon = UserX;
    friendVariant = "secondary";
  } else if (user.friendshipStatus === "request_received") {
    friendLabel = "Accept Request";
    FriendIcon = UserCheck;
    friendVariant = "default";
  } else if (user.friendshipStatus === "friends") {
    friendLabel = "Friends";
    FriendIcon = UserCheck;
    friendVariant = "outline";
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 backdrop-blur-md p-5 flex flex-col justify-between hover:border-zinc-700/80 hover:bg-zinc-900/50 transition-all duration-300 shadow-lg hover:shadow-xl">
      {/* Subtle top-right accent glow */}
      <div className="absolute -top-12 -right-12 -z-10 h-24 w-24 rounded-full bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-all duration-300" />
      
      <div>
        {/* User Info */}
        <div className="flex items-start gap-4 mb-4">
          <Link href={`/@/${user.username}`} prefetch={false} className="cursor-pointer">
            <Avatar className="h-14 w-14 border border-zinc-800 ring-2 ring-transparent group-hover:ring-zinc-700/50 transition-all duration-300">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name} className="object-cover" />
              )}
              <AvatarFallback className="bg-zinc-800 text-zinc-300 text-lg font-bold">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/@/${user.username}`} prefetch={false} className="group-hover:text-white transition-colors cursor-pointer block">
              <h3 className="font-bold text-white text-base truncate leading-snug">{user.name}</h3>
            </Link>
            <p className="text-zinc-500 text-xs truncate block">@{user.username}</p>
            
            {/* Stats */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-400 font-semibold">
              <span className="flex items-center gap-1">
                <span className="text-zinc-200">{user.friendCount}</span> friends
              </span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {user.bio ? (
          <p className="text-zinc-400 text-xs line-clamp-2 mb-5 min-h-10 leading-relaxed">
            {user.bio}
          </p>
        ) : (
          <p className="text-zinc-600 text-xs italic mb-5 min-h-10 leading-relaxed">
            No bio yet.
          </p>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-auto">
        <Button
          size="sm"
          variant={friendVariant}
          disabled={friendLoading}
          onClick={handleFriendAction}
          className="rounded-xl h-9 w-full text-xs font-bold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
          {friendLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <FriendIcon className="h-3.5 w-3.5 mr-1" />
              {friendLabel}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default function SearchClient({ initialResults, initialQuery, initialType }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { open: openAuth, isOpen: isAuthOpen, close: closeAuth } = useAuthModalStore();
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [activeType, setActiveType] = useState<"all" | "movie" | "tv" | "users">(initialType);
  const [results, setResults] = useState<TMDBMedia[]>(initialResults);
  const [isPending, startTransition] = useTransition();
  const [quickViewMedia, setQuickViewMedia] = useState<TMDBMedia | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Convex Query for Users
  const userResults = useQuery(
    api.social.searchUsers,
    activeType === "users" && query.trim().length > 0 ? { query } : "skip"
  );
  const isUsersLoading = activeType === "users" && query.trim().length > 0 && userResults === undefined;

  // Push URL update and fetch results
  const performSearch = useCallback(
    (q: string, type: "all" | "movie" | "tv" | "users") => {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("q", q);
      else params.delete("q");
      if (type !== "all") params.set("type", type);
      else params.delete("type");
      router.push(`/search?${params.toString()}`, { scroll: false });

      if (type !== "users") {
        startTransition(async () => {
          const data = await searchMedia(q, type);
          setResults(data);
        });
      }
    },
    [router, searchParams]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQuery(val);
      performSearch(val, activeType);
    }, 400);
  };

  const handleClear = () => {
    setInputValue("");
    setQuery("");
    setResults([]);
    router.push("/search", { scroll: false });
  };

  const handleTypeChange = (type: "all" | "movie" | "tv" | "users") => {
    setActiveType(type);
    performSearch(query, type);
  };

  const hasQuery = query.trim().length > 0;

  return (
    <main className="min-h-svh bg-background text-foreground pt-28 pb-16 transition-colors duration-300">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            Search
          </h1>
          <p className="text-zinc-400 text-sm">Find movies, TV series, or other film enthusiasts</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-2xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 pointer-events-none" />
          <Input
            id="search-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={activeType === "users" ? "Search users by display name or username…" : "Search movies, TV shows…"}
            autoFocus
            className="w-full h-14 pl-12 pr-12 rounded-2xl bg-zinc-900 border-zinc-700/60 text-white placeholder:text-zinc-500 text-base focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-600 transition-all"
          />
          {inputValue && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Type filter tabs */}
        <div className="flex items-center gap-2 mb-8">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleTypeChange(f.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 cursor-pointer",
                activeType === f.value
                  ? "bg-white text-black border-white shadow-lg"
                  : "bg-zinc-900 text-zinc-400 border-zinc-700/60 hover:border-zinc-500 hover:text-zinc-200"
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* Results area */}
        {activeType === "users" ? (
          isUsersLoading ? (
            <>
              <p className="text-zinc-500 text-sm mb-6 animate-pulse">Searching users…</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <UserSkeletonCard key={i} />
                ))}
              </div>
            </>
          ) : hasQuery && (!userResults || userResults.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Search className="h-7 w-7 text-zinc-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-300">No users found</p>
                <p className="text-zinc-500 text-sm mt-1">
                  Try a different keyword or username.
                </p>
              </div>
            </div>
          ) : !hasQuery ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Search className="h-7 w-7 text-zinc-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-zinc-300">Looking for someone?</p>
                <p className="text-zinc-500 text-sm mt-1">
                  Type a display name or username to start searching.
                </p>
              </div>
            </div>
          ) : (
            <>
              <p className="text-zinc-500 text-sm mb-6">
                {userResults?.length} user{userResults?.length !== 1 ? "s" : ""} found for{" "}
                <span className="text-zinc-300 font-semibold">&ldquo;{query}&rdquo;</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {userResults?.map((user) => (
                  <UserCard
                    key={user.userId}
                    user={user}
                    onAuthRequired={openAuth}
                    isLoggedIn={isLoggedIn}
                  />
                ))}
              </div>
            </>
          )
        ) : isPending ? (
          <>
            <p className="text-zinc-500 text-sm mb-6 animate-pulse">Searching…</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </>
        ) : hasQuery && results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Search className="h-7 w-7 text-zinc-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-300">No results found</p>
              <p className="text-zinc-500 text-sm mt-1">
                Try a different keyword or change the filter.
              </p>
            </div>
          </div>
        ) : !hasQuery ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Search className="h-7 w-7 text-zinc-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-300">What are you looking for?</p>
              <p className="text-zinc-500 text-sm mt-1">
                Start typing to search movies and TV shows.
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mb-6">
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="text-zinc-300 font-semibold">&ldquo;{query}&rdquo;</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {results.map((media) => (
                <Card
                  key={`${media.media_type}-${media.id}`}
                  media={media}
                  onQuickView={setQuickViewMedia}
                  onAuthRequired={openAuth}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Quick View Modal */}
      {quickViewMedia && (
        <QuickViewModal
          media={quickViewMedia}
          isOpen={!!quickViewMedia}
          onClose={() => setQuickViewMedia(null)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={closeAuth} />
    </main>
  );
}
