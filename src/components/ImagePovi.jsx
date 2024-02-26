import React from "react";

export default function ImagePovi({
  imgPath,
  className,
  children,
  position = `center`,
}) {
  const popcorn = `/popcorn.png`;

  return (
    <figure
      className={`bg-base-100 ${className}`}
      style={{
        backgroundImage: imgPath === null ? `url(${popcorn})` : `url(${imgPath})`,
        backgroundSize: imgPath === null ? `contain` : `cover`,
        backgroundPosition: position,
        backgroundRepeat: `no-repeat`,
      }}
    >
      {children}
    </figure>
  );
}
