import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import HeaderMd from "../components/HeadersMd";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  activeUsers: number;
  inactiveUsers: number;
};

export default function DoughnutChart({
  activeUsers,
  inactiveUsers
}: Props) {
  const data = {
    labels: ["Active Users", "Inactive Users"],
    datasets: [
      {
        data: [activeUsers, inactiveUsers],
        backgroundColor: ["#6FFEA3", "#FB7C7C"],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col w-full h-full shadow-sm">
      <HeaderMd
        header="Subscriber Breakdown"
        subheader="Your subscriber's activity..."
      />
      <div className="flex-1 relative min-h-0" style={{ minHeight: "300px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
}