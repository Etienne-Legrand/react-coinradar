import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface SparklineChartProps {
  readonly data: number[];
  readonly change: number;
}

export function SparklineChart({ data, change }: SparklineChartProps) {
  const color = change >= 0 ? "#10B981" : "#EF4444";

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: { display: false, grid: { display: false } },
    },
    elements: {
      point: { radius: 0 },
      line: {
        tension: 0.4,
        borderWidth: 1.5,
        borderColor: color,
      },
    },
    layout: {
      padding: 0,
    },
  };

  const chartData = {
    labels: data.map((_, i) => i.toString()),
    datasets: [
      {
        data,
        fill: false,
        borderColor: color,
        // backgroundColor: change >= 0 ? "#10B98135" : "#EF444435",
      },
    ],
  };

  return (
    <div className="h-14 w-32">
      <Line options={options} data={chartData} />
    </div>
  );
}
