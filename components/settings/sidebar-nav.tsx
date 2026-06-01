import { User, Lock, Trash2, Palette, Shield, FileText } from "lucide-react";

type SettingsSection = "profile" | "appearance" | "privacy" | "security" | "danger" | "import";

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
    <div className="md:col-span-1 flex flex-col gap-2">
      {isLoggedIn && (
        <button
          type="button"
          onClick={() => setActiveSection("profile")}
          className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
            activeSection === "profile"
              ? "bg-zinc-900 text-white border border-zinc-800"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
          }`}
        >
          <User className="h-4 w-4" />
          Edit Profile
        </button>
      )}
      <button
        type="button"
        onClick={() => setActiveSection("appearance")}
        className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
          activeSection === "appearance"
            ? "bg-zinc-900 text-white border border-zinc-800"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
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
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
              activeSection === "privacy"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
            }`}
          >
            <Shield className="h-4 w-4" />
            Privacy & Social
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("security")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
              activeSection === "security"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
            }`}
          >
            <Lock className="h-4 w-4" />
            Security
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("import")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
              activeSection === "import"
                ? "bg-zinc-900 text-white border border-zinc-800"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30 border border-transparent"
            }`}
          >
            <FileText className="h-4 w-4" />
            Import & Export
          </button>
          <button
            type="button"
            onClick={() => setActiveSection("danger")}
            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide flex items-center gap-3 transition-all cursor-pointer ${
              activeSection === "danger"
                ? "bg-red-950/30 text-red-400 border border-red-900/40"
                : "text-zinc-400 hover:text-red-400 hover:bg-red-950/10 border border-transparent"
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
