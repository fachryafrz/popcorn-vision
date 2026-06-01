import RegionSelect from "@/components/region-select";
import moment from "moment";
import { MediaDetails, ProviderItem } from "./types";

interface InfoSidebarProps {
  mediaType: "movie" | "tv";
  details: MediaDetails;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  releaseDate: string;
  formatCurrency: (amount?: number) => string;
  providers: ProviderItem[];
}

export default function InfoSidebar({
  mediaType,
  details,
  selectedRegion,
  setSelectedRegion,
  releaseDate,
  formatCurrency,
  providers,
}: InfoSidebarProps) {
  return (
    <div className="rounded-2xl border sticky top-22 border-zinc-850 bg-zinc-900/10 p-6 space-y-6 h-fit">
      <h3 className="text-base font-bold text-white border-b border-zinc-805 pb-2">
        More Info
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2 flex flex-col gap-1.5 pb-3 border-b border-zinc-800/80">
          <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
            Content Region
          </span>
          <RegionSelect
            value={selectedRegion}
            onValueChange={(val) => setSelectedRegion(val || "US")}
            mode="code"
            placeholder="Select Region"
            className="bg-zinc-950 border-zinc-800 text-xs font-bold rounded-xl h-10 text-zinc-200"
          />
        </div>

        {mediaType === "tv" && details && (
          <div>
            <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
              Seasons
            </span>
            <span className="text-zinc-200">
              {details?.number_of_seasons || 0}
            </span>
          </div>
        )}
        {mediaType === "tv" && details && (
          <div>
            <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
              Episodes
            </span>
            <span className="text-zinc-200">
              {details?.number_of_episodes || 0}
            </span>
          </div>
        )}
        <div>
          <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
            Status
          </span>
          <span className="text-zinc-200">{details?.status || "N/A"}</span>
        </div>
        <div>
          <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
            Release Date
          </span>
          <span className="text-zinc-200">
            {releaseDate ? moment(releaseDate).format("MMM Do, YYYY (dddd)") : "N/A"}
          </span>
        </div>

        {details?.budget !== undefined && (
          <div>
            <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
              Budget
            </span>
            <span className="text-zinc-200">{formatCurrency(details.budget)}</span>
          </div>
        )}
        {details?.revenue !== undefined && (
          <div>
            <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
              Revenue
            </span>
            <span className="text-zinc-200">{formatCurrency(details.revenue)}</span>
          </div>
        )}
        <div>
          <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold">
            Original Language
          </span>
          <span className="text-zinc-200 uppercase">
            {details?.original_language || "en"}
          </span>
        </div>
      </div>

      {/* Providers logos */}
      {providers.length > 0 && (
        <div className="pt-2 border-t border-zinc-850">
          <span className="text-zinc-500 block text-xs uppercase tracking-wider font-semibold mb-2">
            Streaming Services ({selectedRegion})
          </span>
          <div className="flex flex-wrap gap-2">
            {providers.slice(0, 5).map((prov) => (
              <div
                key={prov.provider_id}
                className="h-9 w-9 rounded-lg overflow-hidden border border-zinc-800"
                title={prov.provider_name}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w45${prov.logo_path}`}
                  alt={prov.provider_name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
