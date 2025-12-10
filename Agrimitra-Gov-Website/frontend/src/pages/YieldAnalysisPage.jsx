import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import { Badge } from "../components/ui/Badge";
import { Sidebar } from "../components/Sidebar";
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
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  BarChart3,
  TrendingUp,
  Crop,
  Calendar,
  MapPin,
  Menu,
  Download,
} from "lucide-react";
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
  Legend,
  Filler
);

const cropColors = [
  "#2E7D32", // Rice
  "#004080", // Sugarcane
  "#DAA520", // Vegetables
  "#66BB6A", // Wheat
  "#4E4E4E", // Pulses
];

const yieldData = [
  { year: "2020", rice: 28, wheat: 25, sugarcane: 65, vegetables: 12 },
  { year: "2021", rice: 31, wheat: 22, sugarcane: 68, vegetables: 14 },
  { year: "2022", rice: 29, wheat: 20, sugarcane: 70, vegetables: 13 },
  { year: "2023", rice: 33, wheat: 19, sugarcane: 72, vegetables: 15 },
  { year: "2024", rice: 35, wheat: 26, sugarcane: 75, vegetables: 16 },
];

const seasonalData = [
  { season: "Kharif 2023", production: 2800, target: 2500, efficiency: 112 },
  { season: "Rabi 2023-24", production: 1900, target: 2000, efficiency: 95 },
  { season: "Summer 2024", production: 800, target: 750, efficiency: 107 },
  { season: "Kharif 2024", production: 3200, target: 2800, efficiency: 114 },
];

const cropComparison = [
  { crop: "Rice", area: 45, production: 65, yield: 35 },
  { crop: "Vegetables", area: 10, production: 2, yield: 16 },
  { crop: "Wheat", area: 25, production: 20, yield: 26 },
  { crop: "Sugarcane", area: 15, production: 12, yield: 50 },
  { crop: "Pulses", area: 5, production: 1, yield: 12 },
];

const districtYield = [
  { district: "Cuttack", rice: 3.8, wheat: 2.8, area: 125000 },
  { district: "Bhubaneswar", rice: 3.6, wheat: 2.6, area: 98000 },
  { district: "Puri", rice: 3.2, wheat: 2.2, area: 87000 },
  { district: "Khordha", rice: 3.4, wheat: 2.4, area: 76000 },
  { district: "Ganjam", rice: 3.1, wheat: 2.1, area: 112000 },
];

const monthlyProgress = [
  { month: "Jan", sowing: 65, growth: 92, harvest: 78 },
  { month: "Feb", sowing: 78, growth: 88, harvest: 85 },
  { month: "Mar", sowing: 92, growth: 75, harvest: 95 },
  { month: "Apr", sowing: 88, growth: 90, harvest: 70 },
  { month: "May", sowing: 95, growth: 87, harvest: 94 },
  { month: "Jun", sowing: 90, growth: 93, harvest: 85 },
];

export default function YieldAnalysisPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");

  const downloadFile = (
    content,
    filename,
    mimeType = "text/csv;charset=utf-8;"
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    // Build a simple CSV from available datasets to simulate an export report
    // Respect current filters where feasible
    const lines = [];
    lines.push("Yield Trends");
    lines.push(
      [
        "Year",
        "Rice(T/Ha)",
        "Wheat(T/Ha)",
        "Vegetables(T/Ha)",
        "Sugarcane(T/Ha)",
      ].join(",")
    );
    yieldData.forEach((row) => {
      lines.push(
        [row.year, row.rice, row.wheat, row.vegetables, row.sugarcane].join(",")
      );
    });

    lines.push("");
    lines.push("Seasonal Production vs Target");
    lines.push(["Season", "Actual(000 T)", "Target(000 T)"].join(","));
    seasonalData.forEach((row) => {
      lines.push([row.season, row.production, row.target].join(","));
    });

    lines.push("");
    lines.push("District Yield");
    lines.push(["District", "Rice(T/Ha)", "Wheat(T/Ha)", "Area(Ha)"].join(","));
    districtYield
      .filter(
        (d) =>
          selectedDistrict === "All Districts" ||
          d.district === selectedDistrict
      )
      .forEach((row) => {
        lines.push([row.district, row.rice, row.wheat, row.area].join(","));
      });

    lines.push("");
    lines.push("Monthly Progress");
    lines.push(["Month", "Sowing(%)", "Growth(%)", "Harvest(%)"].join(","));
    monthlyProgress.forEach((row) => {
      lines.push([row.month, row.sowing, row.growth, row.harvest].join(","));
    });

    const header = `Report Export - ${selectedYear} - ${selectedCrop} - ${selectedDistrict}`;
    const csv = [header, "", ...lines].join("\n");
    downloadFile(csv, `yield-report-${selectedYear}.csv`);
  };

  // Chart configurations
  const yieldTrendsConfig = {
    labels: yieldData.map((item) => item.year),
    datasets: [
      {
        label: "Rice (T/Ha)",
        data: yieldData.map((item) => item.rice),
        borderColor: "#2E7D32", // Primary color
        backgroundColor: "#2E7D32", // Primary color
        tension: 0.4,
      },
      {
        label: "Wheat (T/Ha)",
        data: yieldData.map((item) => item.wheat),
        borderColor: "#66BB6A", // Secondary color
        backgroundColor: "#66BB6A", // Secondary color
        tension: 0.4,
      },
      {
        label: "Vegetables (T/Ha)",
        data: yieldData.map((item) => item.vegetables),
        borderColor: "#DAA520", // Highlight color
        backgroundColor: "#DAA520", // Highlight color
        tension: 0.4,
      },
    ],
  };

  const seasonalConfig = {
    labels: seasonalData.map((item) => item.season),
    datasets: [
      {
        label: "Actual Production (000 T)",
        data: seasonalData.map((item) => item.production),
        backgroundColor: "#2E7D32", // Primary color
      },
      {
        label: "Target (000 T)",
        data: seasonalData.map((item) => item.target),
        backgroundColor: "#66BB6A", // Secondary color
      },
    ],
  };

  const cropAreaConfig = {
    labels: cropComparison.map((item) => item.crop),
    datasets: [
      {
        data: cropComparison.map((item) => item.area),
        backgroundColor: [
          "#2E7D32", // Primary color
          "#004080", // Accent color
          "#DAA520", // Highlight color
          "#66BB6A", // Secondary color
          "#4E4E4E", // Text secondary color
        ],
      },
    ],
  };

  const districtConfig = {
    labels: districtYield.map((item) => item.district),
    datasets: [
      {
        label: "Rice Yield (T/Ha)",
        data: districtYield.map((item) => item.rice),
        backgroundColor: "#2E7D32", // Primary color
      },
      {
        label: "Wheat Yield (T/Ha)",
        data: districtYield.map((item) => item.wheat),
        backgroundColor: "#66BB6A", // Secondary color
      },
    ],
  };

  const monthlyConfig = {
    labels: monthlyProgress.map((item) => item.month),
    datasets: [
      {
        label: "Sowing %",
        data: monthlyProgress.map((item) => item.sowing),
        borderColor: "#2E7D32",
        backgroundColor: "#2E7D32", // Primary color
        fill: false,
      },
      {
        label: "Growth %",
        data: monthlyProgress.map((item) => item.growth),
        borderColor: "#004080",
        backgroundColor: "#004080", // Ascent(blue) color
        fill: false,
      },
      {
        label: "Harvest %",
        data: monthlyProgress.map((item) => item.harvest),
        borderColor: "#DAA520",
        backgroundColor: "#DAA520", // Highlight(yellow) color
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#212121", // Text primary
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "#FFFFFF", // Surface color
        titleColor: "#212121", // Text primary
        bodyColor: "#212121", // Text primary
        borderColor: "#E0E0E0", // Border color
        borderWidth: 1,
        padding: 10,
        boxWidth: 10,
        boxHeight: 10,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#E0E0E0", // Border color
        },
        ticks: {
          color: "#4E4E4E", // Text secondary
        },
      },
      x: {
        grid: {
          color: "#E0E0E0", // Border color
        },
        ticks: {
          color: "#4E4E4E", // Text secondary
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {t("yieldPage.header.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("yieldPage.header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              {t("yieldPage.header.export")}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Filters */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span>{t("yieldPage.filters.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("yieldPage.filters.year")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("yieldPage.filters.crop")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Crops">
                      {t("yieldPage.crops.all")}
                    </SelectItem>
                    <SelectItem value="Rice">
                      {t("yieldPage.crops.rice")}
                    </SelectItem>
                    <SelectItem value="Wheat">
                      {t("yieldPage.crops.wheat")}
                    </SelectItem>
                    <SelectItem value="Sugarcane">
                      {t("yieldPage.crops.sugarcane")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("yieldPage.filters.district")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Districts">
                      {t("yieldPage.districts.all")}
                    </SelectItem>
                    <SelectItem value="Cuttack">
                      {t("yieldPage.districts.cuttack")}
                    </SelectItem>
                    <SelectItem value="Bhubaneswar">
                      {t("yieldPage.districts.bhubaneswar")}
                    </SelectItem>
                    <SelectItem value="Puri">
                      {t("yieldPage.districts.puri")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  {t("yieldPage.filters.reset")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: t("yieldPage.metrics.totalProduction"),
                value: "8.2M Tonnes",
                change: "+12.5%",
                icon: Crop,
              },
              {
                title: t("yieldPage.metrics.averageYield"),
                value: "3.2 T/Ha",
                change: "+8.3%",
                icon: TrendingUp,
              },
              {
                title: t("yieldPage.metrics.cultivatedArea"),
                value: "2.8M Ha",
                change: "+3.2%",
                icon: MapPin,
              },
              {
                title: t("yieldPage.metrics.efficiencyRate"),
                value: "108%",
                change: "+5.1%",
                icon: BarChart3,
              },
            ].map((metric, index) => (
              <Card
                key={metric.title}
                className="animate-in fade-in-0 slide-in-from-bottom-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {metric.value}
                      </p>
                      <p className="text-xs text-green-600">
                        {metric.change} {t("yieldPage.metrics.fromLastYear")}
                      </p>
                    </div>
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs
            defaultValue="trends"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="trends">
                {t("yieldPage.tabs.trends")}
              </TabsTrigger>
              <TabsTrigger value="seasonal">
                {t("yieldPage.tabs.seasonal")}
              </TabsTrigger>
              <TabsTrigger value="comparison">
                {t("yieldPage.tabs.comparison")}
              </TabsTrigger>
              <TabsTrigger value="districts">
                {t("yieldPage.tabs.districts")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t("yieldPage.charts.yieldTrends.title")}
                  </CardTitle>
                  <CardDescription>
                    {t("yieldPage.charts.yieldTrends.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Line data={yieldTrendsConfig} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seasonal">
              <Card>
                <CardHeader>
                  <CardTitle>{t("yieldPage.charts.seasonal.title")}</CardTitle>
                  <CardDescription>
                    {t("yieldPage.charts.seasonal.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Bar data={seasonalConfig} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("yieldPage.charts.comparison.area")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                      <Doughnut
                        data={cropAreaConfig}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("yieldPage.charts.comparison.yield")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cropComparison.map((crop, index) => (
                        <div
                          key={crop.crop}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex justify-between items-center">
                            <span>
                              {t(`yieldPage.crops.${crop.crop.toLowerCase()}`)}
                            </span>
                            <Badge
                              variant="secondary"
                              style={{ backgroundColor: cropColors[index] }}
                            >
                              {crop.yield} T/Ha
                            </Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{
                                width: `${(crop.yield / 75) * 100}%`,
                                backgroundColor: cropColors[index],
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="districts">
              <Card>
                <CardHeader>
                  <CardTitle>{t("yieldPage.charts.district.title")}</CardTitle>
                  <CardDescription>
                    {t("yieldPage.charts.district.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Bar data={districtConfig} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Monthly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>{t("yieldPage.charts.monthly.title")}</span>
              </CardTitle>
              <CardDescription>
                {t("yieldPage.charts.monthly.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div style={{ height: "300px" }}>
                <Line data={monthlyConfig} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
