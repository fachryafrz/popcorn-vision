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
    <div className="relative w-full h-[65svh] overflow-hidden">
      {/* Backdrop Background (Desktop) */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-cover bg-top bg-no-repeat scale-102 hidden sm:block"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      />
      {/* Poster Background (Mobile) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-102 block sm:hidden"
        style={{ backgroundImage: `url(${mobileBackdropUrl})` }}
      />
      {/* Gradients Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/45 to-transparent z-10" />
    </div>
  );
}
