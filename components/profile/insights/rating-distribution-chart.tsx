"use client";

import React from "react";
import { Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { RatingCount } from "./types";

interface RatingDistributionChartProps {
  data: RatingCount[];
  config: ChartConfig;
}

export default function RatingDistributionChart({
  data,
  config,
}: RatingDistributionChartProps) {
  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
      <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-zinc-400 uppercase">
        <Star className="h-4 w-4 text-yellow-500" /> Rating Distribution
      </h4>
      <div className="h-[250px] w-full">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={data} margin={{ left: -20, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="rating" fontSize={11} tickLine={false} />
            <YAxis fontSize={11} tickLine={false} allowDecimals={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `Rating: ${label}/10`}
                />
              }
            />
            <Bar
              dataKey="count"
              fill="var(--color-count)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
