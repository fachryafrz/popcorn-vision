import React from "react";

export default function CompanyLogo({ logo, title }) {
  return (
    <figure className={`flex items-end`}>
      <img
        src={`https://image.tmdb.org/t/p/w780${logo.file_path.replace(
          /\.png$/,
          ".svg"
        )}`}
        alt={title}
        className={`max-h-[50px] max-w-[150px] filter grayscale invert`}
      />
    </figure>
  );
}