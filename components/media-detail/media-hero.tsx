import { RefObject } from "react";

interface MediaHeroProps {
  backdropRef: RefObject<HTMLDivElement | null>;
  backdropUrl: string;
  mobileBackdropUrl: string;
}

export default function MediaHero({
  backdropRef,
  backdropUrl,
  mobileBackdropUrl,
}: MediaHeroProps) {
  return (
    <div className="relative h-[65svh] w-full overflow-hidden">
      {/* Backdrop Background (Desktop) */}
      <div
        ref={backdropRef}
        className="absolute inset-0 hidden scale-102 bg-cover bg-top bg-no-repeat sm:block"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      {/* Poster Background (Mobile) */}
      <div
        className="absolute inset-0 block scale-102 bg-cover bg-center bg-no-repeat sm:hidden"
        style={{ backgroundImage: `url(${mobileBackdropUrl})` }}
      />
      {/* Gradients Overlay */}
      <div className="absolute inset-0 z-10 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent" />
    </div>
  );
}
