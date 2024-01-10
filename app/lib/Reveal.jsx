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
  return (
    <m.div
      initial={{ opacity: 0, y: y }}
      whileInView={{ opacity: opacity, y: 0 }}
      transition={{ duration: 0.5, type: "tween", delay: delay }}
      viewport={{ once: once }}
      className={className}
    >
      {children}
    </m.div>
  );
}
