import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { BarChart3, TrendingUp } from "lucide-react";
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
import { Bar, Line } from "react-chartjs-2";
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

const monthlyData = [
  { monthKey: "Jan", farmers: 2400, crops: 1800 },
  { monthKey: "Feb", farmers: 2210, crops: 1900 },
  { monthKey: "Mar", farmers: 2290, crops: 2100 },
  { monthKey: "Apr", farmers: 2000, crops: 1950 },
  { monthKey: "May", farmers: 2181, crops: 2200 },
  { monthKey: "Jun", farmers: 2500, crops: 2400 },
];

const cropDistribution = [
  { key: "rice", value: 45, color: "#2E7D32" },
  { key: "wheat", value: 25, color: "#66BB6A" },
  { key: "sugarcane", value: 15, color: "#004080" },
  { key: "others", value: 15, color: "#DAA520" },
];

const yieldTrend = [
  { monthKey: "Jan", yield: 65 },
  { monthKey: "Feb", yield: 68 },
  { monthKey: "Mar", yield: 72 },
  { monthKey: "Apr", yield: 70 },
  { monthKey: "May", yield: 75 },
  { monthKey: "Jun", yield: 78 },
];

function getBarChartData() {
  const {t} = useTranslation();
  return {
    labels: monthlyData.map((item) => (t(`month2.${item.monthKey}`))),
    datasets: [
      {
        label: t("dashboard.datasets.farmers"),
        data: monthlyData.map((item) => item.farmers),
        backgroundColor: "#2E7D32",
        borderColor: "#2E7D32",
        borderWidth: 1,
      },
      {
        label: t("dashboard.datasets.crops"),
        data: monthlyData.map((item) => item.crops),
        backgroundColor: "#66BB6A",
        borderColor: "#66BB6A",
        borderWidth: 1,
      },
    ],
  };
}

function getLineChartData(t) {
  return {
    labels: yieldTrend.map((item) => (t(`month2.${item.monthKey}`))),
    datasets: [
      {
        label: t("dashboard.datasets.yieldPct"),
        data: yieldTrend.map((item) => item.yield),
        borderColor: "#004080",
        backgroundColor: "#004080",
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        pointBackgroundColor: "#DAA520",
        pointBorderColor: "#DAA520",
        pointHoverBackgroundColor: "#DAA520",
        pointHoverBorderColor: "#FFFFFF",
      },
    ],
  };
}

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000, // Animation duration in milliseconds
    easing: "easeOutQuart", // Animation easing function
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#212121", // Text primary
        font: {
          weight: "bold",
        },
        usePointStyle: true,
        padding: 20,
      },
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
  scales: {
    x: {
      grid: {
        color: "#E0E0E0", // Border color
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        color: "#4E4E4E", // Text secondary
        padding: 8,
      },
    },
    y: {
      grid: {
        color: "#E0E0E0", // Border color
        drawBorder: true,
        drawOnChartArea: true,
        drawTicks: true,
      },
      ticks: {
        color: "#4E4E4E", // Text secondary
        padding: 8,
      },
    },
  },
};

export function DashboardCharts() {
  const { t } = useTranslation();
  const barData = getBarChartData(t);
  const lineData = getLineChartData(t);
  return (
    <div className="space-y-6 ">
      {/* Bar Chart */}
      <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-300 bg-[#fff3d4]/45">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>{t("dashboard.monthlyRegistrationTrends")}</span>
          </CardTitle>
          <CardDescription>
            {t("dashboard.monthlyRegistrationDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "300px" }}>
            <Bar data={barData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-400 bg-[#fff3d4]/45">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>{t("dashboard.yieldPerformance")}</span>
          </CardTitle>
          <CardDescription>
            {t("dashboard.yieldPerformanceDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "250px" }}>
            <Line data={lineData} options={chartOptions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
