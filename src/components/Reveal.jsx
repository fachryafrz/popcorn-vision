"use client";

import React from "react";
import { MotionDiv } from "./MotionDiv";

export default function Reveal() {
  return (
    <MotionDiv
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      Reveal
    </MotionDiv>
  );
}
