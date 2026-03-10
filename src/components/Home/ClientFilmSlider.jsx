"use client";

import React from "react";
import useSWR from "swr";
import FilmSlider from "@/components/Film/Slider";
import SkeletonSlider from "@/components/Skeleton/main/Slider";
import { axios } from "@/lib/axios";
import { useInView } from "react-intersection-observer";

export default function ClientFilmSlider({
  endpoint,
  params,
  title,
  viewAll,
  sort,
}) {
  const { ref, inView } = useInView({ rootMargin: "200px", triggerOnce: true });

  const { data, error, isLoading } = useSWR(
    inView
      ? `/api/${endpoint}?${new URLSearchParams(params).toString()}`
      : null,
    (url) => axios.get(url).then((res) => res.data),
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <div ref={ref}>
      {!inView || isLoading ? (
        <SkeletonSlider />
      ) : error || !data ? null : (
        <FilmSlider films={data} title={title} viewAll={viewAll} sort={sort} />
      )}
    </div>
  );
}
