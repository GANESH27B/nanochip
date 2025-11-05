'use client';
import AppHeader from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { generateTelemetryData } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';
import type { TelemetryData } from '@/lib/types';

const ChartWrapper = ({ data, dataKey, name, color }: { data: TelemetryData[], dataKey: keyof TelemetryData, name: string, color: string }) => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="time"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(str) => {
            const date = new Date(str);
            return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
          }}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          domain={['dataMin - 1', 'dataMax + 1']}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
            }}
        />
        <Legend />
        <Line type="monotone" dataKey={dataKey} name={name} stroke={color} dot={false} />
      </LineChart>
    </ResponsiveContainer>
);

export default function AnalyticsPage() {
  const [timeframe, setTimeframe] = useState('24h');

  const dataMap: { [key: string]: TelemetryData[] } = {
    '24h': generateTelemetryData(1),
    '7d': generateTelemetryData(7),
    '30d': generateTelemetryData(30),
  };

  const data = dataMap[timeframe];

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Analytics" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Tabs defaultValue="24h" onValueChange={setTimeframe} className="w-full">
          <div className="flex items-center justify-between">
            <CardTitle>Aggregated Telemetry Data</CardTitle>
            <TabsList>
              <TabsTrigger value="24h">24h</TabsTrigger>
              <TabsTrigger value="7d">7d</TabsTrigger>
              <TabsTrigger value="30d">30d</TabsTrigger>
            </TabsList>
          </div>
          <div className="grid gap-4 md:gap-8 mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Temperature (°C)</CardTitle>
                    <CardDescription>Average temperature across all shipments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartWrapper data={data} dataKey="temperature" name="Temperature" color="hsl(var(--primary))" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Humidity (%)</CardTitle>
                    <CardDescription>Average humidity levels across all shipments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartWrapper data={data} dataKey="humidity" name="Humidity" color="hsl(var(--chart-2))" />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Pressure (hPa)</CardTitle>
                    <CardDescription>Average atmospheric pressure during transit.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartWrapper data={data} dataKey="pressure" name="Pressure" color="hsl(var(--accent))" />
                </CardContent>
            </Card>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
