import { POPCORN } from "@/lib/constants";
import React from "react";

export default function ImagePovi({
  imgPath,
  className,
  children,
  position = `center`,
}) {
  return (
    <figure
      className={`bg-base-100 ${className}`}
      style={{
        backgroundImage: !imgPath && `url(${POPCORN})`,
        backgroundSize: !imgPath && `contain`,
        backgroundPosition: position,
        backgroundRepeat: `no-repeat`,
      }}
    >
      {imgPath ? children : null}
    </figure>
  );
}
