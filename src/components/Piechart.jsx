import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function Piechart() {
  const data = {
    labels: ["Completed", "Pending", "Cancelled", "Refunded"],
    datasets: [
      {
        data: [65, 15, 10, 10],
        backgroundColor: ["#22c55e", "#f97316", "#ef4444", "#3b82f6"],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    cutout: "72%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 18,
          color: "#475569",
          font: { weight: "600" },
        },
      },
    },
  };

  return (
    <div className="h-full rounded-[28px] bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="flex h-full items-center justify-center rounded-[24px] bg-white p-3">
        <div className="h-full w-full max-w-[360px]">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default Piechart;
