"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import axios from "axios"


const chartConfig = {
    count: {
        label: "Count",
        color: "var(--chart-1)",
    }
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

export function NewPieChart({ group }) {

    const [chartData, setChartData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [total, setTotal] = React.useState(0);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/aggregateData`);
                const formattedData = response.data.slice(0, 2).map((row) => ({
                    category: row[0],
                    count: parseInt(row[1])
                }));
                console.log({ formattedData });
                
                setChartData(formattedData);
                console.log({ formattedData });
                setTotal(formattedData.reduce((acc, curr) => acc+=curr.count, 0))
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
    }, [group]);




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

        <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
        >
            <PieChart>
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="category"
                    innerRadius={60}
                    strokeWidth={2}
                    stroke="var(--background)"
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                    <Label
                        content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                    <text
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                    >
                                        <tspan
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            className="fill-foreground text-3xl font-bold"
                                        >
                                            {total.toLocaleString()}
                                        </tspan>
                                        <tspan
                                            x={viewBox.cx}
                                            y={(viewBox.cy || 0) + 24}
                                            className="fill-muted-foreground"
                                        >
                                            Count
                                        </tspan>
                                    </text>
                                )
                            }
                        }}
                    />
                </Pie>
            </PieChart>
        </ChartContainer>

    )
}
