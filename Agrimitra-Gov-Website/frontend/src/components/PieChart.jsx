import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { PieChartIcon } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const cropDistribution = [
  { key: "crops.rice", value: 45, color: "#DAA520" },
  { key: "crops.wheat", value: 25, color: "#2E7D32" },
  { key: "crops.sugarcane", value: 15, color: "#004080" },
  { key: "crops.others", value: 15, color: "#66BB6A" },
];

function getPieChartData(t) {
  return {
    labels: cropDistribution.map((item) => t(item.key)),
    datasets: [
      {
        data: cropDistribution.map((item) => item.value),
        backgroundColor: cropDistribution.map((item) => item.color),
        borderColor: "#FFFFFF",
        borderWidth: 2,
      },
    ],
  };
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: "#FFFFFF", // Surface color
      titleColor: "#212121", // Text primary
      bodyColor: "#4E4E4E", // Text secondary
      borderColor: "#E0E0E0", // Border color
      borderWidth: 1,
      padding: 12,
      cornerRadius: 6,
      displayColors: true,
      boxPadding: 6,
    },
  },
};

export function PieChart() {
  const { t } = useTranslation();
  const pieChartData = getPieChartData(t);
  return (
    <div className="space-y-6 ">
      {/* Pie Chart */}
      <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-500 bg-[#fff3d4]/45">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            <span>{t("pie.title")}</span>
          </CardTitle>
          <CardDescription>{t("pie.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "300px" }}>
            <Pie data={pieChartData} options={pieChartOptions} />
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {cropDistribution.map((item) => (
              <div key={item.key} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {t(item.key)} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
