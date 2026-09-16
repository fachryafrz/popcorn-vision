"use client";

import React from "react";
import { Film } from "lucide-react";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface GenreItem {
  name: string;
  value: number;
}

interface GenreChartProps {
  topGenres: GenreItem[];
  config: ChartConfig;
}

export default function GenreChart({ topGenres, config }: GenreChartProps) {
  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
      <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-zinc-400 uppercase">
        <Film className="text-primary h-4 w-4" /> Genre Breakdown
      </h4>
      <div className="flex flex-col items-center justify-between gap-4 sm:h-[250px] sm:flex-row">
        {topGenres.length > 0 ? (
          <>
            <div className="flex h-full w-full items-center justify-center sm:w-1/2">
              <ChartContainer
                config={config}
                className="aspect-square h-full max-h-[200px] w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={topGenres}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {topGenres.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
            <div className="flex w-full flex-1 flex-col gap-2.5">
              {topGenres.map((genre, index) => (
                <div
                  key={genre.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="font-semibold text-zinc-300">
                      {genre.name}
                    </span>
                  </div>
                  <span className="font-bold text-zinc-500">
                    {genre.value} items
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-xs text-zinc-600 italic">
            Not enough data
          </div>
        )}
      </div>
    </div>
  );
}
