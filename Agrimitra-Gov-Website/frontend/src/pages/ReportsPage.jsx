import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Calendar } from "../components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/Popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Sidebar } from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { createReport } from "../services/auth";
import {
  FileText,
  Download,
  CalendarIcon,
  TrendingUp,
  Users,
  BarChart3,
  Menu,
  Plus,
  Eye,
  Filter,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(
    t("reports.filters.allTypes")
  );
  const [selectedStatus, setSelectedStatus] = useState(
    t("reports.filters.allStatus")
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [dateRange, setDateRange] = useState({});
  const [previewReport, setPreviewReport] = useState(null);

  const reports = [
    {
      id: 1,
      title: t("reports.list.monthlyFarmerRegistration.title"),
      description: t("reports.list.monthlyFarmerRegistration.description"),
      type: t("reports.types.registration"),
      generatedDate: "2024-12-20",
      generatedBy: t("reports.generatedBy.systemAdmin"),
      status: t("reports.status.completed"),
      fileSize: "2.4 MB",
      downloadCount: 45,
      format: "PDF",
    },
    {
      id: 2,
      title: t("reports.list.cropYieldPerformance.title"),
      description: t("reports.list.cropYieldPerformance.description"),
      type: t("reports.types.analytics"),
      generatedDate: "2024-12-19",
      generatedBy: t("reports.generatedBy.dataAnalyst"),
      status: t("reports.status.completed"),
      fileSize: "5.1 MB",
      downloadCount: 78,
      format: "Excel",
    },
    {
      id: 3,
      title: t("reports.list.pestOutbreakSummary.title"),
      description: t("reports.list.pestOutbreakSummary.description"),
      type: t("reports.types.pestControl"),
      generatedDate: "2024-12-18",
      generatedBy: t("reports.generatedBy.fieldOfficer"),
      status: t("reports.status.completed"),
      fileSize: "1.8 MB",
      downloadCount: 32,
      format: "PDF",
    },
    {
      id: 4,
      title: t("reports.list.marketPriceTrends.title"),
      description: t("reports.list.marketPriceTrends.description"),
      type: t("reports.types.market"),
      generatedDate: "2024-12-17",
      generatedBy: t("reports.generatedBy.marketAnalyst"),
      status: t("reports.status.processing"),
      fileSize: "3.2 MB",
      downloadCount: 0,
      format: "PDF",
    },
    {
      id: 5,
      title: t("reports.list.schemeImplementation.title"),
      description: t("reports.list.schemeImplementation.description"),
      type: t("reports.types.schemes"),
      generatedDate: "2024-12-16",
      generatedBy: t("reports.generatedBy.programManager"),
      status: t("reports.status.completed"),
      fileSize: "4.7 MB",
      downloadCount: 156,
      format: "Excel",
    },
  ];

  const insights = [
    {
      id: 1,
      title: t("reports.insights.farmerRegistrationSurge.title"),
      description: t("reports.insights.farmerRegistrationSurge.description"),
      impact: t("reports.impact.high"),
      category: t("reports.categories.registration"),
      trend: "up",
      value: "+25%",
      recommendation: t(
        "reports.insights.farmerRegistrationSurge.recommendation"
      ),
    },
    {
      id: 2,
      title: t("reports.insights.cropYieldImprovement.title"),
      description: t("reports.insights.cropYieldImprovement.description"),
      impact: t("reports.impact.high"),
      category: t("reports.categories.yield"),
      trend: "up",
      value: "+12%",
      recommendation: t("reports.insights.cropYieldImprovement.recommendation"),
    },
    {
      id: 3,
      title: t("reports.insights.pestControlEffectiveness.title"),
      description: t("reports.insights.pestControlEffectiveness.description"),
      impact: t("reports.impact.medium"),
      category: t("reports.categories.pestControl"),
      trend: "up",
      value: "+18%",
      recommendation: t(
        "reports.insights.pestControlEffectiveness.recommendation"
      ),
    },
    {
      id: 4,
      title: t("reports.insights.marketPriceVolatility.title"),
      description: t("reports.insights.marketPriceVolatility.description"),
      impact: t("reports.impact.medium"),
      category: t("reports.categories.market"),
      trend: "down",
      value: "±15%",
      recommendation: t(
        "reports.insights.marketPriceVolatility.recommendation"
      ),
    },
  ];

  const metrics = [
    {
      title: t("reports.metrics.totalReports"),
      value: "156",
      change: t("reports.metrics.thisMonth", { count: 12 }),
      icon: FileText,
    },
    {
      title: t("reports.metrics.downloads"),
      value: "2,847",
      change: t("reports.metrics.thisWeek", { count: 234 }),
      icon: Download,
    },
    {
      title: t("reports.metrics.activeUsers"),
      value: "89",
      change: t("reports.metrics.newUsers", { count: 15 }),
      icon: Users,
    },
    {
      title: t("reports.metrics.insightsGenerated"),
      value: "24",
      change: t("reports.metrics.newInsights", { count: 6 }),
      icon: BarChart3,
    },
  ];

  const reportMetrics = [
    { month: t("reports.months.jul"), generated: 12, downloaded: 145 },
    { month: t("reports.months.aug"), generated: 15, downloaded: 178 },
    { month: t("reports.months.sep"), generated: 18, downloaded: 203 },
    { month: t("reports.months.oct"), downloaded: 234, generated: 22 },
    { month: t("reports.months.nov"), generated: 25, downloaded: 267 },
    { month: t("reports.months.dec"), generated: 28, downloaded: 298 },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case t("reports.status.completed"):
        return "bg-green-100 text-green-800 border-green-200";
      case t("reports.status.processing"):
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case t("reports.status.failed"):
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case t("reports.impact.high"):
        return "bg-red-100 text-red-800 border-red-200";
      case t("reports.impact.medium"):
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case t("reports.impact.low"):
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrendIcon = (trend) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />
    );
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await createReport({ title: reportTitle, type: reportType, dateRange });
      setReportTitle("");
      setReportType("");
      setDateRange({});
    } catch (e) {
      alert("Failed to generate report: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return t("reports.selectDate");
    return date.toLocaleDateString();
  };

  const filteredReports = reports.filter((r) => {
    const typeOk =
      selectedType === t("reports.filters.allTypes") || r.type === selectedType;
    const statusOk =
      selectedStatus === t("reports.filters.allStatus") ||
      r.status === selectedStatus;
    return typeOk && statusOk;
  });

  const resetFilters = () => {
    setSelectedType(t("reports.filters.allTypes"));
    setSelectedStatus(t("reports.filters.allStatus"));
  };

  const handlePreview = (report) => {
    setPreviewReport(report);
  };

  const handleDownload = (report) => {
    // Simulate a file download with basic CSV/PDF placeholder
    const content = `Report: ${report.title}\nType: ${report.type}\nGenerated: ${report.generatedDate}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "_")}.${
      report.format.toLowerCase() === "excel" ? "csv" : "txt"
    }`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  // Chart configuration
  const reportMetricsConfig = {
    labels: reportMetrics.map((item) => item.month),
    datasets: [
      {
        label: t("reports.chart.reportsGenerated"),
        data: reportMetrics.map((item) => item.generated),
        backgroundColor: "#2E7D32",
      },
      {
        label: t("reports.chart.downloads"),
        data: reportMetrics.map((item) => item.downloaded),
        backgroundColor: "#66BB6A",
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
                {t("reports.pageTitle")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("reports.pageDescription")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("reports.generateReport")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle>{t("reports.generateNewReport")}</DialogTitle>
                  <DialogDescription>
                    {t("reports.generateReportDescription")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="report-title">
                      {t("reports.reportTitle")}
                    </Label>
                    <Input
                      id="report-title"
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      placeholder={t("reports.enterReportTitle")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-type">
                      {t("reports.reportType")}
                    </Label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("reports.selectReportType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="registration">
                          {t("reports.types.registrationReport")}
                        </SelectItem>
                        <SelectItem value="analytics">
                          {t("reports.types.analyticsReport")}
                        </SelectItem>
                        <SelectItem value="pest">
                          {t("reports.types.pestControlReport")}
                        </SelectItem>
                        <SelectItem value="market">
                          {t("reports.types.marketAnalysis")}
                        </SelectItem>
                        <SelectItem value="schemes">
                          {t("reports.types.schemesReport")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t("reports.dateRange")}</Label>
                    <div className="flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.from
                              ? formatDate(dateRange.from)
                              : t("reports.fromDate")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.from}
                            onSelect={(date) =>
                              setDateRange({ ...dateRange, from: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange.to
                              ? formatDate(dateRange.to)
                              : t("reports.toDate")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateRange.to}
                            onSelect={(date) =>
                              setDateRange({ ...dateRange, to: date })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline">{t("common.cancel")}</Button>
                    <Button
                      onClick={handleGenerateReport}
                      disabled={!reportTitle || !reportType || isGenerating}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                          <span>{t("reports.generating")}</span>
                        </div>
                      ) : (
                        t("reports.generateReport")
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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

          {/* Tabs Content */}
          <Tabs
            defaultValue="reports"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="reports">
                {t("reports.tabs.generatedReports")}
              </TabsTrigger>
              <TabsTrigger value="insights">
                {t("reports.tabs.keyInsights")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {t("reports.tabs.reportAnalytics")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reports" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span>{t("reports.filterReports")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select
                      value={selectedType}
                      onValueChange={setSelectedType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t("reports.filterByType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("reports.filters.allTypes")}>
                          {t("reports.filters.allTypes")}
                        </SelectItem>
                        <SelectItem value={t("reports.types.registration")}>
                          {t("reports.types.registration")}
                        </SelectItem>
                        <SelectItem value={t("reports.types.analytics")}>
                          {t("reports.types.analytics")}
                        </SelectItem>
                        <SelectItem value={t("reports.types.pestControl")}>
                          {t("reports.types.pestControl")}
                        </SelectItem>
                        <SelectItem value={t("reports.types.market")}>
                          {t("reports.types.market")}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("reports.filterByStatus")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("reports.filters.allStatus")}>
                          {t("reports.filters.allStatus")}
                        </SelectItem>
                        <SelectItem value={t("reports.status.completed")}>
                          {t("reports.status.completed")}
                        </SelectItem>
                        <SelectItem value={t("reports.status.processing")}>
                          {t("reports.status.processing")}
                        </SelectItem>
                        <SelectItem value={t("reports.status.failed")}>
                          {t("reports.status.failed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={resetFilters}>
                      {t("reports.resetFilters")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reports List */}
              <div className="space-y-4">
                {filteredReports.map((report, index) => (
                  <Card
                    key={report.id}
                    className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-semibold text-foreground">
                              {report.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(report.status)}
                            >
                              {report.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {report.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>
                              {t("reports.generated")}: {report.generatedDate}
                            </span>
                            <span>
                              {t("reports.by")}: {report.generatedBy}
                            </span>
                            <span>
                              {t("reports.size")}: {report.fileSize}
                            </span>
                            <span>
                              {t("reports.downloads")}: {report.downloadCount}
                            </span>
                            <span>
                              {t("reports.format")}: {report.format}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 lg:ml-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(report)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t("reports.preview")}
                          </Button>
                          <Button
                            size="sm"
                            disabled={
                              report.status !== t("reports.status.completed")
                            }
                            onClick={() => handleDownload(report)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {t("reports.download")}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {insights.map((insight, index) => (
                  <Card
                    key={insight.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(insight.trend)}
                            <h3 className="font-semibold text-foreground">
                              {insight.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className={getImpactColor(insight.impact)}
                            >
                              {insight.impact} {t("reports.impact2")}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {insight.category}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <span className="text-lg font-bold text-primary">
                            {insight.value}
                          </span>
                          <Button variant="ghost" size="sm">
                            {t("reports.viewDetails")}
                          </Button>
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {t("reports.recommendation")}
                          </p>
                          <p className="text-sm">{insight.recommendation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("reports.chart.title")}</CardTitle>
                  <CardDescription>
                    {t("reports.chart.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "400px" }}>
                    <Bar data={reportMetricsConfig} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          {/* Preview Dialog */}
          <Dialog
            open={!!previewReport}
            onOpenChange={(open) => !open && setPreviewReport(null)}
          >
            <DialogContent className="max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200">
              <DialogHeader>
                <DialogTitle>{previewReport?.title}</DialogTitle>
                <DialogDescription>
                  {t("reports.previewing")} {previewReport?.format}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {previewReport?.description}
                </p>
                <div className="text-xs text-muted-foreground flex flex-wrap gap-4">
                  <span>
                    {t("reports.generated")}: {previewReport?.generatedDate}
                  </span>
                  <span>
                    {t("reports.by")}: {previewReport?.generatedBy}
                  </span>
                  <span>
                    {t("reports.size")}: {previewReport?.fileSize}
                  </span>
                  <span>
                    {t("reports.format")}: {previewReport?.format}
                  </span>
                </div>
                <div className="bg-muted p-3 rounded">
                  <pre className="whitespace-pre-wrap text-xs">
                    {t("reports.previewPlaceholder")}
                  </pre>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
