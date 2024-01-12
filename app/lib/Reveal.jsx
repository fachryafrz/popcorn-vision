"use client";

import { motion as m } from "framer-motion";
import { useEffect, useState } from "react";

export default function Reveal({
  children,
  once = true,
  delay = 0,
  opacity = 1,
  className,
  y = 20,
}) {
  const [isMobile, setIsMobile] = useState();

  const revealVariants = !isMobile
    ? {
        initial: {
          opacity: 0,
          y: y,
        },
        animate: {
          opacity: opacity,
          y: 0,
        },
      }
    : {};

  useEffect(() => {
    if (typeof window !== "undefined") setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <m.div
      variants={revealVariants}
      initial={`initial`}
      whileInView={`animate`}
      transition={{ duration: 0.5, type: "tween", delay: delay }}
      viewport={{ once: once }}
      className={className}
    >
      {children}
    </m.div>
  );
}
