import React from "react";

export default function SkeletonReviewCard() {
  const loadingClass = `animate-pulse bg-gray-400 bg-opacity-20`;

  return (
    <div className={`${loadingClass} flex flex-col gap-4 p-4 md:rounded-xl`}>
      {/* Header */}
      <div>
        {/* Profile */}
        <div className={`flex items-center gap-2`}>
          {/* Poster */}
          <span
            className={`${loadingClass} aspect-square w-[50px] rounded-full`}
          ></span>

          {/* Info */}
          <div className={`flex flex-grow flex-col gap-1 [&_*]:rounded`}>
            <span className={`${loadingClass} h-5 max-w-[100px]`}></span>
            <span className={`${loadingClass} h-3 max-w-[100px]`}></span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 [&_*]:rounded`}>
        <span className={`${loadingClass} h-5`}></span>
        <span className={`${loadingClass} h-5`}></span>
        <span className={`${loadingClass} h-5 max-w-[90%]`}></span>
      </div>
    </div>
  );
}
