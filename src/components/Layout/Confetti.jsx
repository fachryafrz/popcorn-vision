"use client";

import { useConfetti } from "@/zustand/confetti";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import ConfettiBoom from "react-confetti-boom";

export default function Confetti() {
  const { confetti, setConfetti } = useConfetti();
  const pathname = usePathname();

  useEffect(() => {
    if (
      !pathname.startsWith("/movies") ||
      !pathname.startsWith("/tv") ||
      pathname === "/tv"
    ) {
      setConfetti(false);
    }
  }, [pathname]);

  return (
    <>
      {confetti && (
        <div
          id={`Confetti`}
          className={`pointer-events-none fixed inset-0 z-[60]`}
        >
          <ConfettiBoom mode={`fall`} particleCount={100} shapeSize={15} />
        </div>
      )}
    </>
  );
}
