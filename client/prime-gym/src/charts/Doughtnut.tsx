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
        backgroundColor: ["#6FFEA3", "#FB7C7C"], // green / red
        borderWidth: 1
      }
    ]
  };
return (
  <div className="bg-white  rounded-lg p-6 max-w-96 h-fit"
  >
    <div className="mb-4">
      <h1 className="text-lg font-semibold black mb-2">Subscriber Breakdown</h1>
      <h2 className="text-md  font-light text-gray-500">Your subscriber's activity...</h2>
    </div>   
    <Doughnut data={data} className="" />
  </div>
);
}