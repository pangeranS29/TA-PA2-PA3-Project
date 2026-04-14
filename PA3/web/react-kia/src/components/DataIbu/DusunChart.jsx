import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DusunChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4 h-64 flex items-center justify-center text-gray-500">
        Tidak ada data dusun
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.dusun),
    datasets: [
      {
        label: "Jumlah Ibu",
        data: data.map((d) => d.jumlah),
        backgroundColor: "rgba(79, 70, 229, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw} Ibu` } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-64">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DusunChart;