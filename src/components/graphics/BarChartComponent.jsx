import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BarChartComponent = ({ data }) => {
  return (
    <div className="border rounded-2xl p-4 bg-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">Monthly Revenue</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="month" tick={{ fill: "#1b1b1b" }} />
          <YAxis tick={{ fill: "#1b1b1b" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#4416A8" barSize={16} stackId="stack" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const mockData = [
  { month: "January", revenue: 850000, max: 1000000 },
  { month: "February", revenue: 720000, max: 1000000 },
  { month: "March", revenue: 910000, max: 1000000 },
  { month: "April", revenue: 870000, max: 1000000 },
  { month: "May", revenue: 960000, max: 1000000 },
  { month: "June", revenue: 750000, max: 1000000 },
  { month: "July", revenue: 820000, max: 1000000 },
  { month: "August", revenue: 900000, max: 1000000 },
  { month: "September", revenue: 880000, max: 1000000 },
  { month: "October", revenue: 940000, max: 1000000 },
  { month: "November", revenue: 970000, max: 1000000 },
  { month: "December", revenue: 990000, max: 1000000 }
];

export default BarChartComponent;
