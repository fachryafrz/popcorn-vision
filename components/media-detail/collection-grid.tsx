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
    <div className="space-y-4 pt-4 border-t border-zinc-800/40">
      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
        Movies in this Collection
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              className="group flex flex-col gap-2 bg-zinc-900/45 hover:bg-zinc-900/80 border border-zinc-850 hover:border-zinc-800 rounded-2xl p-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="aspect-2/3 w-full rounded-xl overflow-hidden bg-zinc-950">
                <img
                  src={posterUrl}
                  alt={part.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="px-1 text-left">
                <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {part.title}
                </h4>
                <span className="text-[10px] text-zinc-500 font-semibold">
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
