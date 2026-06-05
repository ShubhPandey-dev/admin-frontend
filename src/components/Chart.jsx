import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

function Chart() {
  const data = {
    labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    datasets: [
      {
        data: [61, 65, 63, 66, 67, 71, 73, 74],
        borderColor: "#2563eb",
        backgroundColor: "#2563eb",
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#081b45",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#94a3b8",
          font: { weight: "600" },
        },
        border: { display: false },
      },
      y: {
        min: 50,
        max: 80,
        grid: {
          color: "rgba(148, 163, 184, 0.18)",
        },
        ticks: {
          color: "#94a3b8",
          font: { weight: "600" },
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="h-full rounded-[28px] bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="h-full rounded-[24px] bg-white p-3">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default Chart;
