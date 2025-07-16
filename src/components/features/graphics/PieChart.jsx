import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import mockData from "../../../services/mockData.js";

const COLORS = ["#6A5ACD", "#FF4500", "#FFD700", "#00BFFF", "#32CD32"];

const PieChartComponent = () => {
  const data = mockData.invoicesStatus;
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 w-full h-full items-start flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-gray-700">Invoice Status</h2>
      <div className="flex items-center justify-center gap-4">
        <PieChart width={250} height={250}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            nameKey="label"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <div className="flex flex-col items-start gap-2">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700 text-sm">
                {entry.label} - {((entry.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComponent;

