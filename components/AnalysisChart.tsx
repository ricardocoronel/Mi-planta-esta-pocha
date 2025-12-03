import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis, Tooltip } from 'recharts';

interface AnalysisChartProps {
  score: number;
  label: string;
  color: string;
}

export const AnalysisChart: React.FC<AnalysisChartProps> = ({ score, label, color }) => {
  const data = [
    {
      name: label,
      value: score,
      fill: color,
    },
  ];

  return (
    <div className="h-48 w-full relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
           <Tooltip 
             cursor={false}
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
           />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-2/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-2">
        <span className="text-3xl font-bold" style={{ color }}>{score}%</span>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
};
