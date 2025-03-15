import { useState, useEffect } from "react";
import { ChevronDown, Database, BarChart, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock data for Oracle APEX integration
const consensusData = [
  { date: "Aug 1", agreement: 94 },
  { date: "Aug 2", agreement: 89 },
  { date: "Aug 3", agreement: 92 },
  { date: "Aug 4", agreement: 97 },
  { date: "Aug 5", agreement: 95 },
];

const tokenDistribution = [
  { category: "Validators", percentage: 45 },
  { category: "Liquidity Pool", percentage: 25 },
  { category: "Development", percentage: 20 },
  { category: "Community", percentage: 10 },
];

const networkGrowth = [
  { month: "May", users: 120 },
  { month: "Jun", users: 250 },
  { month: "Jul", users: 370 },
  { month: "Aug", users: 580 },
];

function SimpleBarChart({ data, xKey, yKey, title }: any) {
  const maxValue = Math.max(...data.map((item: any) => item[yKey]));

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-xs text-gray-500">Oracle APEX Data</span>
      </div>
      <div className="h-40 flex items-end space-x-2">
        {data.map((item: any, index: number) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t" 
              style={{ height: `${(item[yKey] / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs mt-1">{item[xKey]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SimplePieChart({ data, categoryKey, valueKey, title }: any) {
  const total = data.reduce((acc: number, item: any) => acc + item[valueKey], 0);
  
  let startAngle = 0;
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-xs text-gray-500">Oracle APEX Data</span>
      </div>
      <div className="h-40 relative">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <g transform="translate(50,50)">
            {data.map((item: any, index: number) => {
              const angle = (item[valueKey] / total) * 360;
              const endAngle = startAngle + angle;
              
              // Calculate SVG arc path
              const x1 = Math.cos((startAngle - 90) * (Math.PI / 180)) * 40;
              const y1 = Math.sin((startAngle - 90) * (Math.PI / 180)) * 40;
              const x2 = Math.cos((endAngle - 90) * (Math.PI / 180)) * 40;
              const y2 = Math.sin((endAngle - 90) * (Math.PI / 180)) * 40;
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 0 0`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`
              ].join(' ');
              
              const color = [
                "#3b82f6", "#ef4444", "#eab308", "#22c55e", 
                "#8b5cf6", "#ec4899", "#14b8a6"
              ][index % 7];
              
              const currentAngle = startAngle + angle / 2;
              startAngle = endAngle;
              
              return (
                <path 
                  key={index} 
                  d={pathData} 
                  fill={color} 
                  stroke="white" 
                  strokeWidth="0.5"
                />
              );
            })}
          </g>
        </svg>
        
        <div className="absolute bottom-0 w-full">
          <div className="flex flex-wrap justify-center gap-2">
            {data.map((item: any, index: number) => (
              <div key={index} className="flex items-center text-xs">
                <div 
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ 
                    backgroundColor: [
                      "#3b82f6", "#ef4444", "#eab308", "#22c55e", 
                      "#8b5cf6", "#ec4899", "#14b8a6"
                    ][index % 7]
                  }}
                ></div>
                {item[categoryKey]} ({item[valueKey]}%)
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleLineChart({ data, xKey, yKey, title }: any) {
  const maxValue = Math.max(...data.map((item: any) => item[yKey]));
  const width = 100;
  const height = 40;
  const points = data.map((item: any, i: number) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (item[yKey] / maxValue) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">{title}</h4>
        <span className="text-xs text-gray-500">Oracle APEX Data</span>
      </div>
      <div className="h-40 relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            points={points}
          />
        </svg>
        
        <div className="absolute bottom-0 w-full flex justify-between">
          {data.map((item: any, index: number) => (
            <div key={index} className="text-xs">{item[xKey]}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ApexCharts() {
  return (
    <div className="border rounded-lg bg-white shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Database className="h-5 w-5 mr-2" />
          <h3 className="font-semibold text-lg">Oracle APEX Integration</h3>
        </div>
        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Oracle APEX Powered
        </div>
      </div>
      
      <Tabs defaultValue="consensus" className="p-4">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="consensus">
            <BarChart className="h-4 w-4 mr-2" />
            Consensus
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChart className="h-4 w-4 mr-2" />
            Distribution
          </TabsTrigger>
          <TabsTrigger value="growth">
            <TrendingUp className="h-4 w-4 mr-2" />
            Growth
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="consensus" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Consensus Formation</CardTitle>
              <CardDescription>
                Agreement rates across AI models over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleBarChart 
                data={consensusData} 
                xKey="date" 
                yKey="agreement" 
                title="Daily Agreement Rate (%)" 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distribution" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Token Distribution</CardTitle>
              <CardDescription>
                Allocation of rewards across network participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimplePieChart 
                data={tokenDistribution} 
                categoryKey="category" 
                valueKey="percentage" 
                title="Token Allocation (%)" 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="growth" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Network Growth</CardTitle>
              <CardDescription>
                Active validators joining the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SimpleLineChart 
                data={networkGrowth} 
                xKey="month" 
                yKey="users" 
                title="Monthly Active Validators" 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t text-xs text-gray-500 text-center">
        Data synchronized with Oracle APEX dashboards | Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
}
