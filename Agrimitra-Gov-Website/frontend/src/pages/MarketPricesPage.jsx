import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
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
import { Sidebar } from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  MapPin,
  Menu,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

export default function MarketPricesPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState(
    t("marketPage.filters.allMarkets")
  );
  const [selectedCrop, setSelectedCrop] = useState(
    t("marketPage.filters.allCrops")
  );

  const currentPrices = [
    {
      crop: t("marketPage.crops.riceCommon"),
      currentPrice: 2850,
      previousPrice: 2720,
      change: 4.8,
      unit: t("marketPage.units.perQuintal"),
      market: t("marketPage.districts.bhubaneswar"),
      lastUpdated: t("marketPage.updated.2h"),
    },
    {
      crop: t("marketPage.crops.riceBasmati"),
      currentPrice: 4200,
      previousPrice: 4150,
      change: 1.2,
      unit: t("marketPage.units.perQuintal"),
      market: t("marketPage.districts.cuttack"),
      lastUpdated: t("marketPage.updated.1h"),
    },
    {
      crop: t("marketPage.crops.wheat"),
      currentPrice: 2350,
      previousPrice: 2400,
      change: -2.1,
      unit: t("marketPage.units.perQuintal"),
      market: t("marketPage.districts.puri"),
      lastUpdated: t("marketPage.updated.3h"),
    },
    {
      crop: t("marketPage.crops.sugarcane"),
      currentPrice: 380,
      previousPrice: 375,
      change: 1.3,
      unit: t("marketPage.units.perQuintal"),
      market: t("marketPage.districts.khordha"),
      lastUpdated: t("marketPage.updated.4h"),
    },
    {
      crop: t("marketPage.crops.onion"),
      currentPrice: 3200,
      previousPrice: 2950,
      change: 8.5,
      unit: t("marketPage.units.perQuintal"),
      market: t("marketPage.districts.balasore"),
      lastUpdated: t("marketPage.updated.1h"),
    },
    {
      crop: t("marketPage.crops.potato"),
      currentPrice: 1850,
      previousPrice: 1920,
      change: -3.6,
      unit: t("marketPage.units.perQuintal"),
      market: t("marketPage.districts.ganjam"),
      lastUpdated: t("marketPage.updated.2h"),
    },
  ];

  const priceHistory = [
    { date: "Dec 1", rice: 2650, wheat: 2300, onion: 2800, potato: 1750 },
    { date: "Dec 5", rice: 2680, wheat: 2320, onion: 2900, potato: 1780 },
    { date: "Dec 10", rice: 2720, wheat: 2350, onion: 3100, potato: 1850 },
    { date: "Dec 15", rice: 2780, wheat: 2380, onion: 3000, potato: 1900 },
    { date: "Dec 20", rice: 2850, wheat: 2350, onion: 3200, potato: 1850 },
  ];

  const marketComparison = [
    {
      market: t("marketPage.districts.bhubaneswar"),
      rice: 2850,
      wheat: 2350,
      onion: 3200,
    },
    {
      market: t("marketPage.districts.cuttack"),
      rice: 2820,
      wheat: 2380,
      onion: 3150,
    },
    {
      market: t("marketPage.districts.puri"),
      rice: 2780,
      wheat: 2350,
      onion: 3100,
    },
    {
      market: t("marketPage.districts.khordha"),
      rice: 2900,
      wheat: 2400,
      onion: 3300,
    },
    {
      market: t("marketPage.districts.balasore"),
      rice: 2750,
      wheat: 2320,
      onion: 3200,
    },
  ];

  const priceAlerts = [
    {
      id: 1,
      crop: t("marketPage.crops.onion"),
      message: t("marketPage.alerts.onion"),
      type: "increase",
      threshold: "5%",
      market: t("marketPage.districts.balasore"),
    },
    {
      id: 2,
      crop: t("marketPage.crops.riceCommon"),
      message: t("marketPage.alerts.riceCommon"),
      type: "high",
      threshold: "₹2,800",
      market: t("marketPage.districts.bhubaneswar"),
    },
    {
      id: 3,
      crop: t("marketPage.crops.potato"),
      message: t("marketPage.alerts.potato"),
      type: "decrease",
      threshold: "₹1,900",
      market: t("marketPage.districts.ganjam"),
    },
  ];

  const metrics = [
    {
      title: t("marketPage.metrics.averagePriceIndex"),
      value: "₹2,640",
      change: "+3.2%",
      icon: IndianRupee,
    },
    {
      title: t("marketPage.metrics.priceVolatility"),
      value: "12.5%",
      change: "-2.1%",
      icon: TrendingUp,
    },
    {
      title: t("marketPage.metrics.activeMarkets"),
      value: "28",
      change: "+2 new",
      icon: MapPin,
    },
    {
      title: t("marketPage.metrics.dailyUpdates"),
      value: "156",
      change: "+12 today",
      icon: RefreshCw,
    },
  ];

  const getPriceChangeColor = (change) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getPriceChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return null;
  };

  const getAlertColor = (type) => {
    switch (type) {
      case "increase":
        return "bg-red-100 text-red-800 border-red-200";
      case "decrease":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "high":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Chart configurations
  const priceTrendsConfig = {
    labels: priceHistory.map((item) => item.date),
    datasets: [
      {
        label: t("marketPage.charts.rice"),
        data: priceHistory.map((item) => item.rice),
        borderColor: "#2E7D32",
        backgroundColor: "#2E7D32",
        tension: 0.4,
      },
      {
        label: t("marketPage.charts.wheat"),
        data: priceHistory.map((item) => item.wheat),
        borderColor: "#66BB6A",
        backgroundColor: "#66BB6A",
        tension: 0.4,
      },
      {
        label: t("marketPage.charts.onion"),
        data: priceHistory.map((item) => item.onion),
        borderColor: "#004080",
        backgroundColor: "#004080",
        tension: 0.4,
      },
      {
        label: t("marketPage.charts.potato"),
        data: priceHistory.map((item) => item.potato),
        borderColor: "#DAA520",
        backgroundColor: "#DAA520",
        tension: 0.4,
      },
    ],
  };

  const marketComparisonConfig = {
    labels: marketComparison.map((item) => item.market),
    datasets: [
      {
        label: t("marketPage.charts.rice"),
        data: marketComparison.map((item) => item.rice),
        backgroundColor: "#2E7D32",
      },
      {
        label: t("marketPage.charts.wheat"),
        data: marketComparison.map((item) => item.wheat),
        backgroundColor: "#66BB6A",
      },
      {
        label: t("marketPage.charts.onion"),
        data: marketComparison.map((item) => item.onion),
        backgroundColor: "#DAA520",
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
          color: "#212121",
          font: {
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "#FFFFFF",
        titleColor: "#212121",
        bodyColor: "#212121",
        borderColor: "#E0E0E0",
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
          color: "#E0E0E0",
        },
        ticks: {
          color: "#4E4E4E",
        },
      },
      x: {
        grid: {
          color: "#E0E0E0",
        },
        ticks: {
          color: "#4E4E4E",
        },
      },
    },
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className="layout-container bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="content-container flex flex-col overflow-hidden">
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
                {t("marketPage.header.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("marketPage.header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("marketPage.header.refresh")}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
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
                      <p className="text-xs text-green-600">{metric.change}</p>
                    </div>
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Price Alerts */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span>{t("marketPage.alerts2.title")}</span>
              </CardTitle>
              <CardDescription>
                {t("marketPage.alerts2.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {priceAlerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border animate-in fade-in-0 slide-in-from-left-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {alert.crop}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={getAlertColor(alert.type)}
                      >
                        {alert.market}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle>{t("marketPage.filters.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={selectedMarket}
                  onValueChange={setSelectedMarket}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("marketPage.filters.selectMarket")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t("marketPage.filters.allMarkets")}>
                      {t("marketPage.filters.allMarkets")}
                    </SelectItem>
                    <SelectItem value={t("marketPage.districts.bhubaneswar")}>
                      {t("marketPage.districts.bhubaneswar")}
                    </SelectItem>
                    <SelectItem value={t("marketPage.districts.cuttack")}>
                      {t("marketPage.districts.cuttack")}
                    </SelectItem>
                    <SelectItem value={t("marketPage.districts.puri")}>
                      {t("marketPage.districts.puri")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("marketPage.filters.selectCrop")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t("marketPage.filters.allCrops")}>
                      {t("marketPage.filters.allCrops")}
                    </SelectItem>
                    <SelectItem value={t("marketPage.filters.rice")}>
                      {t("marketPage.filters.rice")}
                    </SelectItem>
                    <SelectItem value={t("marketPage.filters.wheat")}>
                      {t("marketPage.filters.wheat")}
                    </SelectItem>
                    <SelectItem value={t("marketPage.filters.vegetables")}>
                      {t("marketPage.filters.vegetables")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  {t("marketPage.filters.reset")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs
            defaultValue="current"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">
                {t("marketPage.tabs.current")}
              </TabsTrigger>
              <TabsTrigger value="trends">
                {t("marketPage.tabs.trends")}
              </TabsTrigger>
              <TabsTrigger value="comparison">
                {t("marketPage.tabs.comparison")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentPrices.map((price, index) => (
                  <Card
                    key={price.crop}
                    className="animate-in fade-in-0 slide-in-from-bottom-2 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">
                            {price.crop}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {getPriceChangeIcon(price.change)}
                            <span
                              className={`text-sm font-medium ${getPriceChangeColor(
                                price.change
                              )}`}
                            >
                              {price.change > 0 ? "+" : ""}
                              {price.change.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-foreground">
                            ₹{price.currentPrice.toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {price.unit}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{price.market}</span>
                          <span>{price.lastUpdated}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t("marketPage.previous")}: ₹
                          {price.previousPrice.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("marketPage.trends.title")}</CardTitle>
                  <CardDescription>
                    {t("marketPage.trends.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Line data={priceTrendsConfig} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("marketPage.comparison.title")}</CardTitle>
                  <CardDescription>
                    {t("marketPage.comparison.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Bar data={marketComparisonConfig} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
