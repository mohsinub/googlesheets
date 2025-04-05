"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import axios from "axios"
import { useEffect, useState } from "react"

const chartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-1)",
  }
}

export function NewChart({ type }) {
  const [chartData, setChartData] = useState([]);
  const [hrd, setHrdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/aggregateData`);
        const formattedData = response.data.map((row) => ({
          category: row[0],
          count: parseInt(row[1])
        }));
        if(type === "hrd") {
          setChartData(formattedData.slice(0, 2));

        }
        if(type === "group") {
          setChartData(formattedData.slice(2, 14));
        }
        if(type === "district") {
          setChartData(formattedData.slice(15, 29));
        }
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="animate-spin h-6 w-6 border-b-2 border-primary rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-sm">
        Error loading chart data
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart data={chartData} margin={{ left: 0, right: 20, top: 10, bottom: 40 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={20}
          interval={0}
          tick={{
            fontSize: 11,
            angle: -45,
            textAnchor: 'end',
            dominantBaseline: 'auto'
          }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tick={{ fontSize: 11 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="count"
          fill="var(--chart-1)"
          radius={[4, 4, 0, 0]}
          maxBarSize={60}
        />
      </BarChart>
    </ChartContainer>
  );
}
