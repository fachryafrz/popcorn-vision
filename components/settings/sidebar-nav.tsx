import { User, Lock, Trash2, Palette, Shield, FileText } from "lucide-react";

type SettingsSection =
  | "profile"
  | "appearance"
  | "privacy"
  | "security"
  | "danger"
  | "import";

interface SidebarNavProps {
  activeSection: SettingsSection;
  setActiveSection: (section: SettingsSection) => void;
  isLoggedIn: boolean;
}

export default function SidebarNav({
  activeSection,
  setActiveSection,
  isLoggedIn,
}: SidebarNavProps) {
  return (
    <div className="flex flex-col gap-2 md:col-span-1">
      {isLoggedIn && (
        <button
          type="button"
          onClick={() => setActiveSection("profile")}
          className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all ${
            activeSection === "profile"
              ? "border border-zinc-800 bg-zinc-900 text-white"
              : "border border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
          }`}
        >
          <User className="h-4 w-4" />
          Edit Profile
        </button>
      )}
      <button
        type="button"
        onClick={() => setActiveSection("appearance")}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all ${
          activeSection === "appearance"
            ? "border border-zinc-800 bg-zinc-900 text-white"
            : "border border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
        }`}
      >
        <Palette className="h-4 w-4" />
        Appearance & Styling
      </button>
      {isLoggedIn && (
        <>
          <button
            type="button"
            onClick={() => setActiveSection("privacy")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all ${
              activeSection === "privacy"
                ? "border border-zinc-800 bg-zinc-900 text-white"
                : "border border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
            }`}
          >
            <Shield className="h-4 w-4" />
            Privacy & Social
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("security")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all ${
              activeSection === "security"
                ? "border border-zinc-800 bg-zinc-900 text-white"
                : "border border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
            }`}
          >
            <Lock className="h-4 w-4" />
            Security
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("import")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all ${
              activeSection === "import"
                ? "border border-zinc-800 bg-zinc-900 text-white"
                : "border border-transparent text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-200"
            }`}
          >
            <FileText className="h-4 w-4" />
            Import & Export
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("danger")}
            className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold tracking-wide transition-all ${
              activeSection === "danger"
                ? "border border-red-900/40 bg-red-950/30 text-red-400"
                : "border border-transparent text-zinc-400 hover:bg-red-950/10 hover:text-red-400"
            }`}
          >
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </button>
        </>
      )}
    </div>
  );
}
