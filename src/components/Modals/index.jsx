"use client";

import LoginAlert from "./LoginAlert";
import HoverCard from "./HoverCard";
import { userStore } from "@/zustand/userStore";
import Streaming from "./Streaming";
import ImageSlider from "./ImageSlider";
import Disclaimer from "./Disclaimer";

export default function Modal() {
  const { user } = userStore();

  return (
    <>
      {!user && <LoginAlert />}

      <HoverCard />

      <Streaming />

      <ImageSlider />

      <Disclaimer />
    </>
  );
}
