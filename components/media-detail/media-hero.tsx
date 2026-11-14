import { RefObject } from "react";
import { Play } from "lucide-react";

interface MediaHeroProps {
  backdropRef: RefObject<HTMLDivElement | null>;
  backdropUrl: string;
  mobileBackdropUrl: string;
  title: string;
  canPlay: boolean;
  onPlay: () => void;
}

export default function MediaHero({
  backdropRef,
  backdropUrl,
  mobileBackdropUrl,
  title,
  canPlay,
  onPlay,
}: MediaHeroProps) {
  return (
    <div className="relative h-[65svh] w-full overflow-hidden">
      <div
        ref={backdropRef}
        className="absolute inset-0 hidden scale-102 bg-cover bg-top bg-no-repeat sm:block"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      <div
        className="absolute inset-0 block scale-102 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ backgroundImage: `url(${mobileBackdropUrl})` }}
      />
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent" />
      {canPlay && (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${title}`}
          className="focus-visible:ring-primary absolute top-1/2 left-1/2 z-20 flex size-16 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/65 text-white shadow-2xl transition-[transform,background-color] hover:scale-105 hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:ring-offset-black focus-visible:outline-none active:scale-95 sm:size-20"
        >
          <Play
            className="ml-1 size-7 fill-current sm:size-9"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
}
