import { usePersonalization, ThemeType } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

export default function AppearanceSection() {
  const { theme, setTheme } = usePersonalization();

  const themesList = [
    {
      id: "dark",
      name: "Dark Mode (Default)",
      bg: "bg-zinc-950 text-white border-zinc-800",
    },
    {
      id: "netflix",
      name: "Netflix Red",
      bg: "bg-zinc-900 text-white border-red-600/30",
    },
    {
      id: "hbo",
      name: "HBO Purple",
      bg: "bg-indigo-950/60 text-white border-purple-800/30",
    },
    {
      id: "disney",
      name: "Disney Blue",
      bg: "bg-blue-950/60 text-white border-blue-600/30",
    },
    {
      id: "prime",
      name: "Prime Video Blue",
      bg: "bg-slate-900 text-white border-sky-600/30",
    },
    {
      id: "letterboxd",
      name: "Letterboxd Orange",
      bg: "bg-zinc-900 text-white border-orange-500/30",
    },
    {
      id: "cinema",
      name: "Cinema Gold",
      bg: "bg-stone-900 text-white border-yellow-600/30",
    },
    {
      id: "sakura",
      name: "Sakura Pink",
      bg: "bg-zinc-900 text-white border-pink-500/30",
    },
  ] as { id: ThemeType; name: string; bg: string }[];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
          Appearance & Styling
        </h2>
        <p className="text-xs text-zinc-500">
          Personalize your platform appearance by choosing from a selection of
          dark themes
        </p>
      </div>

      {/* Core Theme Picker */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">
          Select Theme
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {themesList.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t.id)}
              className={cn(
                "flex min-h-16 cursor-pointer flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-200 hover:scale-[1.02]",
                t.bg,
                theme === t.id
                  ? "scale-102 font-bold ring-2 ring-blue-500"
                  : "opacity-80 hover:opacity-100",
              )}
            >
              <span className="text-xs">{t.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
