import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

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
        backgroundColor: ["#6FFEA3", "#FB7C7C"], // green / red
        borderWidth: 1
      }
    ]
  };
return (
  <div className="bg-white  rounded-lg p-6 max-w-96 max-h-96"
  >
    <Doughnut data={data} className="" />
  </div>
);
}