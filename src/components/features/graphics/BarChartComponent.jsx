import React from "react";
import ApexCharts from "react-apexcharts";

const BarChartComponent = () => {
  const data = [
    { month: "January", revenue: 850000 },
    { month: "February", revenue: 720000 },
    { month: "March", revenue: 910000 },
    { month: "April", revenue: 870000 },
    { month: "May", revenue: 960000 },
    { month: "June", revenue: 750000 },
    { month: "July", revenue: 820000 },
    { month: "August", revenue: 900000 },
    { month: "September", revenue: 880000 },
    { month: "October", revenue: 940000 },
    { month: "November", revenue: 970000 },
    { month: "December", revenue: 990000 }
  ];

  const options = {
    chart: {
      type: "area",
      height: "100%",
      fontFamily: "Inter, sans-serif",
      dropShadow: { enabled: false },
      toolbar: { show: false },
    },
    tooltip: {
      enabled: true,
      x: { show: false },
      y: {
        formatter: function (value) {
          return "$" + (value / 1000).toFixed(0) + "K";
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#4416A8",
        gradientToColors: ["#4416A8"],
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 4 },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: { left: 48, right: 0, top: 0 }, // Aumenté el padding izquierdo
      borderColor: "#f0f0f0",
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    },
    series: [{
      name: "Revenue",
      data: data.map((item) => item.revenue),
      color: "#4416A8",
    }],
    xaxis: {
      categories: data.map((item) => item.month),
      labels: { 
        show: true,
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { 
      show: true,
      labels: {
        formatter: function (value) {
          return "$" + (value / 1000).toFixed(0) + "K";
        },
        style: {
          colors: "#6B7280",
          fontSize: "12px"
        },
        offsetX: 10 // Espacio adicional entre los números y la gráfica
      },
      min: 500000, // Establecer un mínimo para mejor visualización
      max: 1000000 // Establecer un máximo para mejor visualización
    },
  };

  return (
    <div className="border border-gray-200 rounded-2xl p-4 bg-white">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Monthly Revenue</h2>
      <ApexCharts 
        options={options} 
        series={options.series} 
        type="area" 
        height={300} 
      />
    </div>
  );
};

export default BarChartComponent;