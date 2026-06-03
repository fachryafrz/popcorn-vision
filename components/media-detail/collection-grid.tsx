import { CollectionPart } from "./types";

interface CollectionGridProps {
  collectionParts: CollectionPart[];
  onPartClick: (id: number) => void;
}

export default function CollectionGrid({
  collectionParts,
  onPartClick,
}: CollectionGridProps) {
  if (collectionParts.length === 0) return null;

  return (
    <div className="space-y-4 border-t border-zinc-800/40 pt-4">
      <h3 className="text-xs font-bold tracking-wider text-zinc-400 uppercase">
        Movies in this Collection
      </h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {collectionParts.map((part) => {
          const posterUrl = part.poster_path
            ? `https://image.tmdb.org/t/p/w185${part.poster_path}`
            : "/logo/popcorn.png";
          const year = part.release_date
            ? new Date(part.release_date).getFullYear()
            : "N/A";
          return (
            <div
              key={part.id}
              onClick={() => onPartClick(part.id)}
              className="group border-zinc-850 flex cursor-pointer flex-col gap-2 rounded-2xl border bg-zinc-900/45 p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-800 hover:bg-zinc-900/80"
            >
              <div className="aspect-2/3 w-full overflow-hidden rounded-xl bg-zinc-950">
                <img
                  src={posterUrl}
                  alt={part.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-1 text-left">
                <h4 className="group-hover:text-primary line-clamp-1 text-xs font-bold text-white transition-colors">
                  {part.title}
                </h4>
                <span className="text-[10px] font-semibold text-zinc-500">
                  {year}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
