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
    <div className="border-zinc-850 sticky top-22 h-fit space-y-6 rounded-2xl border bg-zinc-900/10 p-6">
      <h3 className="border-zinc-805 border-b pb-2 text-base font-bold text-white">
        More Info
      </h3>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="col-span-2 flex flex-col gap-1.5 border-b border-zinc-800/80 pb-3">
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Content Region
          </span>
          <RegionSelect
            value={selectedRegion}
            onValueChange={(val) => setSelectedRegion(val || "US")}
            mode="code"
            placeholder="Select Region"
            className="h-10 rounded-xl border-zinc-800 bg-zinc-950 text-xs font-bold text-zinc-200"
          />
        </div>

        {mediaType === "tv" && details && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Seasons
            </span>
            <span className="text-zinc-200">
              {details?.number_of_seasons || 0}
            </span>
          </div>
        )}
        {mediaType === "tv" && details && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Episodes
            </span>
            <span className="text-zinc-200">
              {details?.number_of_episodes || 0}
            </span>
          </div>
        )}
        <div>
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Status
          </span>
          <span className="text-zinc-200">{details?.status || "N/A"}</span>
        </div>
        <div>
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Release Date
          </span>
          <span className="text-zinc-200">
            {releaseDate
              ? moment(releaseDate).format("MMM Do, YYYY (dddd)")
              : "N/A"}
          </span>
        </div>

        {details?.budget !== undefined && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Budget
            </span>
            <span className="text-zinc-200">
              {formatCurrency(details.budget)}
            </span>
          </div>
        )}
        {details?.revenue !== undefined && (
          <div>
            <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              Revenue
            </span>
            <span className="text-zinc-200">
              {formatCurrency(details.revenue)}
            </span>
          </div>
        )}
        <div>
          <span className="block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Original Language
          </span>
          <span className="text-zinc-200 uppercase">
            {details?.original_language || "en"}
          </span>
        </div>
      </div>

      {/* Providers logos */}
      {providers.length > 0 && (
        <div className="border-zinc-850 border-t pt-2">
          <span className="mb-2 block text-xs font-semibold tracking-wider text-zinc-500 uppercase">
            Streaming Services ({selectedRegion})
          </span>
          <div className="flex flex-wrap gap-2">
            {providers.slice(0, 5).map((prov) => (
              <div
                key={prov.provider_id}
                className="h-9 w-9 overflow-hidden rounded-lg border border-zinc-800"
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
