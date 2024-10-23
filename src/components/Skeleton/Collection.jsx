import React from "react";

export default function SkeletonCollection() {
  const loadingClass = `animate-pulse bg-gray-400 bg-opacity-20`;

  return (
    <div
      className={`${loadingClass} flex items-center gap-2 !bg-opacity-10 p-2 rounded-xl`}
    >
      {/* Number */}
      <span className={`w-5`}></span>

      {/* Poster */}
      <span className={`${loadingClass} aspect-poster w-[50px] rounded-lg`}></span>

      {/* Title & Info */}
      <div className={`flex flex-grow flex-col gap-1`}>
        <span className={`${loadingClass} h-5 w-full rounded`}></span>
        <div className={`flex gap-1`}>
          <span className={`${loadingClass} h-6 flex-[1] rounded-full`}></span>
          <span className={`${loadingClass} h-6 flex-[2] rounded-full`}></span>
        </div>
      </div>

      {/* Overview */}
      <span className={`flex-grow`}></span>
    </div>
  );
}
