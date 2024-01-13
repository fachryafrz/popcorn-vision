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
  const [revealVariants, setRevealVariants] = useState();

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    if (!isMobile) {
      setRevealVariants({
        initial: { opacity: 0, y: y },
        animate: { opacity: opacity, y: 0 },
      });
    } else {
      setRevealVariants({
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 },
      });
    }
  }, [opacity, y]);

  return (
    revealVariants && (
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
    )
  );
}
