import React, { RefObject } from "react";
import {
  User as UserIcon,
  Loader2,
  Globe,
  FileText,
  Camera,
} from "lucide-react";
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
        <h2 className="mb-1 text-xl font-bold tracking-tight text-white">
          Profile Details
        </h2>
        <p className="text-zinc-550 text-xs">
          Update your public credentials, region, and custom bio
        </p>
      </div>

      {/* Profile Picture Uploader Area */}
      <div className="flex flex-col items-center gap-6 border-b border-zinc-900 pb-6 sm:flex-row">
        <div className="group/avatar relative cursor-pointer select-none">
          <Avatar className="relative h-24 w-24 overflow-hidden border border-zinc-800 shadow-xl sm:h-28 sm:w-28">
            {profileImage ? (
              <AvatarImage
                src={profileImage}
                alt={name}
                className="object-cover"
              />
            ) : null}
            <AvatarFallback className="bg-primary flex h-full w-full items-center justify-center text-3xl font-black text-white">
              {name.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>

            {/* Loading overlay spinner */}
            {uploadingImage && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                <Loader2 className="text-primary h-6 w-6 animate-spin" />
              </div>
            )}

            {/* Hover Edit Overlay */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-200 md:opacity-0 md:group-hover/avatar:opacity-100"
            >
              <Camera className="mb-1 h-5 w-5 text-white" />
              <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                Change
              </span>
            </div>
          </Avatar>
        </div>

        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h3 className="text-sm font-bold text-white">Profile Picture</h3>
          <p className="max-w-xs text-xs text-zinc-500">
            Supported formats: JPG, JPEG, PNG, or WEBP. Max file size: 2MB.
          </p>
          <div className="mt-2 flex justify-center gap-3 sm:justify-start">
            <Button
              type="button"
              variant="ghost"
              onClick={() => fileInputRef.current?.click()}
              className="hover:bg-zinc-850 cursor-pointer rounded-xl border border-zinc-800 px-4 text-xs font-semibold hover:text-white"
            >
              Upload Photo
            </Button>
            {profileImage && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemoveImage}
                className="cursor-pointer rounded-xl border border-red-950/40 px-4 text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300"
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
          <div className="mb-1 flex items-center justify-between">
            <Label className="block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Display Name
            </Label>
            <span className="text-zinc-650 text-[10px] font-bold">
              {name.length}/50
            </span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
              <UserIcon className="h-4 w-4" />
            </span>
            <Input
              type="text"
              required
              placeholder="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              className="focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pr-4 pl-12 text-left text-sm text-white placeholder-zinc-600 outline-hidden transition-all focus:bg-zinc-900"
            />
          </div>
        </div>

        <div className="relative">
          <div className="mb-1 flex items-center justify-between">
            <Label className="block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Username
            </Label>
            <span className="text-zinc-650 text-[10px] font-bold">
              {username.length}/15
            </span>
          </div>
          <div className="relative">
            <span className="text-zinc-550 absolute inset-y-0 left-0 z-10 flex items-center pl-4">
              <span className="text-sm font-semibold select-none">@</span>
            </span>
            <Input
              type="text"
              required
              placeholder="username"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "")
                    .slice(0, 15),
                )
              }
              className="focus:border-primary/50 w-full rounded-2xl border border-zinc-800 bg-zinc-900/30 py-6 pr-4 pl-12 text-left text-sm text-white placeholder-zinc-600 outline-hidden transition-all focus:bg-zinc-900"
            />
          </div>
          <p className="mt-1 pl-1 text-left text-[10px] text-zinc-500">
            Lowercase letters, numbers, and underscores only
          </p>
        </div>

        <div className="relative">
          <div className="mb-1 flex items-center justify-between">
            <Label className="block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
              Bio
            </Label>
            <span className="text-zinc-650 text-[10px] font-bold">
              {bio.length}/200
            </span>
          </div>
          <div className="relative">
            <span className="absolute top-3 left-4 z-10 text-zinc-500">
              <FileText className="h-4 w-4" />
            </span>
            <Textarea
              placeholder="Write something about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 200))}
              rows={3}
              className="focus:border-primary/50 min-h-[90px] w-full resize-none rounded-2xl border border-zinc-800 bg-zinc-900/30 pt-3 pr-4 pb-3 pl-12 text-left text-sm text-white placeholder-zinc-600 outline-hidden transition-all focus:bg-zinc-900"
            />
          </div>
        </div>

        <div className="relative">
          <Label className="mb-1 block text-left text-xs font-semibold tracking-wider text-zinc-400 uppercase">
            Country / Region
          </Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-zinc-500">
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
        className="to-primary hover:to-primary hover:from-primary from-primary mt-6 w-full cursor-pointer rounded-2xl bg-linear-to-r py-6 text-sm font-semibold text-white transition-all duration-200 active:scale-[0.98]"
      >
        {savingProfile ? (
          <Loader2 className="mx-auto h-5 w-5 animate-spin" />
        ) : (
          "Save Profile Changes"
        )}
      </Button>
    </form>
  );
}
