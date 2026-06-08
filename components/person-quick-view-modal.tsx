"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getPersonDetails } from "@/lib/tmdb-actions";
import {
  Loader2,
  Maximize2,
  MapPin,
  Award,
  Calendar,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import moment from "moment";

interface TMDBPerson {
  id: number;
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  known_for_department: string;
  popularity: number;
}

interface PersonQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  personId: number | null;
}

export default function PersonQuickViewModal({
  isOpen,
  onClose,
  personId,
}: PersonQuickViewModalProps) {
  const [person, setPerson] = useState<TMDBPerson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !personId) return;

    // Reset state asynchronously to prevent React cascading renders warning
    Promise.resolve().then(() => {
      setLoading(true);
      setPerson(null);
    });

    getPersonDetails(String(personId)).then((data) => {
      if (data) {
        setPerson(data as TMDBPerson);
      }
      setLoading(false);
    });
  }, [isOpen, personId]);

  if (!personId) return null;

  const profileUrl = person?.profile_path
    ? `https://image.tmdb.org/t/p/h632${person.profile_path}`
    : "/logo/popcorn.png";

  const age = person?.birthday
    ? (() => {
        const birth = moment(person.birthday);
        if (person.deathday) {
          const death = moment(person.deathday);
          return `${death.diff(birth, "years")} (Deceased)`;
        }
        return moment().diff(birth, "years");
      })()
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[80svh] w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 p-0 text-white shadow-2xl backdrop-blur-xl sm:h-[70svh] sm:max-w-4xl md:h-[75svh]">
        <DialogTitle className="sr-only">
          Quick View: {person?.name || "Loading..."}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Biography and career information of the person.
        </DialogDescription>

        {loading ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <Loader2 className="text-primary mb-4 h-12 w-12 animate-spin" />
            <p className="text-sm text-zinc-400">Loading details...</p>
          </div>
        ) : person ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
            {/* Left Column: Photo & Action */}
            <div className="relative flex flex-col items-center justify-center border-b border-zinc-900 bg-zinc-950 p-6 md:h-full md:w-[280px] md:shrink-0 md:border-r md:border-b-0">
              <div className="aspect-2/3 w-full max-w-[200px] overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900 shadow-xl transition-all duration-300 hover:scale-102">
                <img
                  src={profileUrl}
                  alt={person.name}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-6 w-full max-w-[200px]">
                <Link href={`/person/${person.id}`} onClick={onClose} passHref legacyBehavior>
                  <Button
                    className="w-full cursor-pointer rounded-full border border-zinc-700 bg-black/40 text-xs font-semibold text-zinc-300 transition-all hover:scale-105 hover:bg-zinc-900 hover:text-white active:scale-98"
                    variant="outline"
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <Maximize2 className="h-3.5 w-3.5" />
                      Maximize Profile
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: Details & Bio */}
            <div className="flex grow scrollbar-thin flex-col space-y-6 overflow-y-auto p-6 sm:p-8 md:h-full">
              <div>
                <h2 className="bg-linear-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-2xl font-black tracking-tight text-transparent sm:text-3xl">
                  {person.name}
                </h2>
                {person.known_for_department && (
                  <span className="mt-2 inline-block rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-zinc-400 uppercase">
                    {person.known_for_department}
                  </span>
                )}
              </div>

              {/* Personal Info Grid */}
              <div className="grid grid-cols-2 gap-4 border-y border-zinc-900 py-4 text-xs text-zinc-400">
                {person.birthday && (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                      <Calendar className="h-3 w-3" /> Birthday
                    </span>
                    <span className="font-medium text-zinc-200">
                      {moment(person.birthday).format("MMM Do, YYYY")}
                      {age && ` (Age ${age})`}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                      <MapPin className="h-3 w-3" /> Place of Birth
                    </span>
                    <span className="font-medium text-zinc-200">
                      {person.place_of_birth}
                    </span>
                  </div>
                )}
                {person.popularity !== undefined && (
                  <div className="space-y-1">
                    <span className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">
                      <Award className="h-3 w-3" /> Popularity
                    </span>
                    <span className="font-bold text-white">
                      {person.popularity.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Biography */}
              <div>
                <h4 className="mb-2 text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Biography
                </h4>
                <p className="text-sm leading-relaxed text-zinc-300">
                  {person.biography || "No biography details available."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center">
            <User className="mb-2 h-12 w-12 text-zinc-500" />
            <p className="text-sm text-zinc-400">Person not found.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
