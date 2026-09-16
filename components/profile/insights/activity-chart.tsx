"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";

interface ActivityChartProps {
  data: Array<{ date: string; count: number }>;
  config: ChartConfig;
}

export default function ActivityChart({ data, config }: ActivityChartProps) {
  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6 lg:col-span-2">
      <h4 className="mb-6 flex items-center gap-2 text-sm font-bold tracking-wider text-zinc-400 uppercase">
        <TrendingUp className="h-4 w-4 text-emerald-500" /> Viewing Trends
      </h4>
      <div className="h-[250px] w-full">
        {data.length > 0 ? (
          <ChartContainer config={config} className="h-full w-full">
            <AreaChart data={data} margin={{ left: -20, right: 10 }}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" fontSize={11} tickLine={false} />
              <YAxis fontSize={11} tickLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="count"
                stroke="var(--color-count)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#trendGradient)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-600 italic">
            Not enough data
          </div>
        )}
      </div>
    </div>
  );
}
