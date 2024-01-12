"use client";

import { motion as m } from "framer-motion";

export default function Reveal({
  children,
  once = true,
  delay = 0,
  opacity = 1,
  className,
  y = 20,
}) {
  const isMobile = window.innerWidth < 780;

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
