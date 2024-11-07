"use client";

/* eslint-disable @next/next/no-img-element */
import ImagePovi from "@/components/Film/ImagePovi";
import { motion as m } from "framer-motion";
import { useEffect, useState } from "react";

export default function FilmBackdrop({ film }) {
  return (
    <>
      <Reveal y={0} delay={1.2}>
        <ImagePovi
          imgPath={film.backdrop_path}
          position={`top`}
          className={`absolute inset-0 z-0 aspect-video max-h-[100dvh] w-full overflow-hidden before:absolute before:inset-0 before:z-0 before:bg-gradient-to-t before:from-base-100 md:min-h-[500px] md:opacity-[50%] lg:max-h-[120dvh]`}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${film.backdrop_path}`}
            role="presentation"
            loading="lazy"
            srcSet={`
                  https://image.tmdb.org/t/p/w500${film.backdrop_path} 500w,
                  https://image.tmdb.org/t/p/w780${film.backdrop_path} 780w,
                  https://image.tmdb.org/t/p/w1280${film.backdrop_path} 1280w,
                  https://image.tmdb.org/t/p/original${film.backdrop_path} 1536w
                `}
            sizes="100vw"
            draggable={false}
            alt={film.title ?? film.name}
          />
        </ImagePovi>
      </Reveal>
    </>
  );
}

function Reveal({
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
        animate={`animate`}
        transition={{ duration: 0.5, type: "tween", delay: delay }}
        viewport={{ once: once }}
        className={className}
      >
        {children}
      </m.div>
    )
  );
}
