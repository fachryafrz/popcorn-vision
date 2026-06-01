import React, { RefObject } from "react";
import { User as UserIcon, Loader2, Globe, FileText, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RegionSelect from "@/components/region-select";

interface ProfileSectionProps {
  name: string;
  setName: (name: string) => void;
  username: string;
  setUsername: (username: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  country: string;
  setCountry: (country: string) => void;
  profileImage: string;
  uploadingImage: boolean;
  savingProfile: boolean;
  handleRemoveImage: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdateProfile: (e: React.FormEvent) => void;
  fileInputRef: RefObject<HTMLInputElement | null>;
}

export default function ProfileSection({
  name,
  setName,
  username,
  setUsername,
  bio,
  setBio,
  country,
  setCountry,
  profileImage,
  uploadingImage,
  savingProfile,
  handleRemoveImage,
  handleFileChange,
  handleUpdateProfile,
  fileInputRef,
}: ProfileSectionProps) {
  return (
    <form onSubmit={handleUpdateProfile} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white mb-1">Profile Details</h2>
        <p className="text-xs text-zinc-550">Update your public credentials, region, and custom bio</p>
      </div>

      {/* Profile Picture Uploader Area */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-zinc-900">
        <div className="relative group/avatar cursor-pointer select-none">
          <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border border-zinc-800 shadow-xl overflow-hidden relative">
            {profileImage ? (
              <AvatarImage src={profileImage} alt={name} className="object-cover" />
            ) : null}
            <AvatarFallback className="bg-blue-600 text-white font-black text-3xl flex items-center justify-center w-full h-full">
              {name.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>

            {/* Loading overlay spinner */}
            {uploadingImage && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
              </div>
            )}

            {/* Hover Edit Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 md:opacity-0 md:group-hover/avatar:opacity-100 flex flex-col items-center justify-center transition-opacity duration-200 z-10"
            >
              <Camera className="h-5 w-5 text-white mb-1" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-white">Change</span>
            </div>
          </Avatar>
        </div>

        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white">Profile Picture</h3>
          <p className="text-xs text-zinc-500 max-w-xs">
            Supported formats: JPG, JPEG, PNG, or WEBP. Max file size: 2MB.
          </p>
          <div className="flex justify-center sm:justify-start gap-3 mt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-zinc-800 text-xs font-semibold px-4 cursor-pointer hover:bg-zinc-850 hover:text-white"
            >
              Upload Photo
            </Button>
            {profileImage && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveImage}
                className="rounded-xl border border-red-950/40 text-red-400 text-xs font-semibold px-4 cursor-pointer hover:bg-red-950/20 hover:text-red-300"
              >
                Remove
              </Button>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block text-left">
              Display Name
            </Label>
            <span className="text-[10px] text-zinc-650 font-bold">{name.length}/50</span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
              <UserIcon className="h-4 w-4" />
            </span>
            <Input
              type="text"
              required
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-left"
            />
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block text-left">
              Username
            </Label>
            <span className="text-[10px] text-zinc-650 font-bold">{username.length}/15</span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-550 z-10">
              <span className="text-sm font-semibold select-none">@</span>
            </span>
            <Input
              type="text"
              required
              placeholder="username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 15)
                )
              }
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 text-left"
            />
          </div>
          <p className="text-[10px] text-zinc-500 mt-1 pl-1 text-left">
            Lowercase letters, numbers, and underscores only
          </p>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block text-left">
              Bio
            </Label>
            <span className="text-[10px] text-zinc-650 font-bold">{bio.length}/200</span>
          </div>
          <div className="relative">
            <span className="absolute top-3 left-4 text-zinc-500 z-10">
              <FileText className="h-4 w-4" />
            </span>
            <Textarea
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              rows={3}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 pt-3 pb-3 pl-12 pr-4 text-sm text-white placeholder-zinc-600 outline-hidden transition-all focus:border-blue-500/50 focus:bg-zinc-900 resize-none min-h-[90px] text-left"
            />
          </div>
        </div>

        <div className="relative">
          <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-1 text-left">
            Country / Region
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 z-10">
              <Globe className="h-4 w-4" />
            </span>
            <RegionSelect
              value={country}
              onValueChange={(val) => setCountry(val || "")}
              mode="name"
              placeholder="Select your region"
              className="pl-12 text-sm font-semibold text-zinc-300 hover:text-white"
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={savingProfile}
        className="w-full rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 py-6 text-sm font-semibold text-white transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] mt-6 cursor-pointer"
      >
        {savingProfile ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Profile Changes"}
      </Button>
    </form>
  );
}
