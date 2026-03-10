"use client";

import React from "react";
import useSWR from "swr";
import Trending from "@/components/Film/Trending";
import SkeletonTrending from "@/components/Skeleton/main/Trending";
import { axios } from "@/lib/axios";
import { useInView } from "react-intersection-observer";

export default function ClientTrending({ endpoint, index, type }) {
  const { ref, inView } = useInView({ rootMargin: "200px", triggerOnce: true });

  const { data, error, isLoading } = useSWR(
    inView ? `/api/${endpoint}` : null,
    (url) => axios.get(url).then((res) => res.data.results),
    {
      revalidateOnFocus: false,
    },
  );

  return (
    <div ref={ref}>
      {!inView || isLoading ? (
        <SkeletonTrending />
      ) : error || !data || !data[index] ? null : (
        <Trending film={data[index]} type={type} />
      )}
    </div>
  );
}
