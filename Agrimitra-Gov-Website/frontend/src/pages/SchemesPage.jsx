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
import { Progress } from "../components/ui/Progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Sidebar } from "../components/Sidebar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Gift,
  Users,
  DollarSign,
  IndianRupee,
  TrendingUp,
  Menu,
  Download,
  Eye,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/Dialog";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { useTranslation } from "react-i18next";
import { createScheme } from "../services/auth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Data arrays with translation functions
const getSchemes = (t) => [
  {
    id: 1,
    name: t("schemes.data.schemes.pmKisan.name"),
    description: t("schemes.data.schemes.pmKisan.description"),
    totalBudget: 50000000,
    utilized: 38500000,
    beneficiaries: 15420,
    targetBeneficiaries: 18000,
    status: "Active",
    launchDate: "2019-02-24",
    category: t("schemes.data.categories.incomeSupport"),
    eligibility: t("schemes.data.schemes.pmKisan.eligibility"),
    benefits: t("schemes.data.schemes.pmKisan.benefits"),
  },
  {
    id: 2,
    name: t("schemes.data.schemes.pmfby.name"),
    description: t("schemes.data.schemes.pmfby.description"),
    totalBudget: 25000000,
    utilized: 18750000,
    beneficiaries: 8750,
    targetBeneficiaries: 12000,
    status: "Active",
    launchDate: "2016-01-13",
    category: t("schemes.data.categories.insurance"),
    eligibility: t("schemes.data.schemes.pmfby.eligibility"),
    benefits: t("schemes.data.schemes.pmfby.benefits"),
  },
  {
    id: 3,
    name: t("schemes.data.schemes.soilHealth.name"),
    description: t("schemes.data.schemes.soilHealth.description"),
    totalBudget: 8000000,
    utilized: 7200000,
    beneficiaries: 12300,
    targetBeneficiaries: 15000,
    status: "Active",
    launchDate: "2015-02-19",
    category: t("schemes.data.categories.soilHealth"),
    eligibility: t("schemes.data.schemes.soilHealth.eligibility"),
    benefits: t("schemes.data.schemes.soilHealth.benefits"),
  },
  {
    id: 4,
    name: t("schemes.data.schemes.kisanCredit.name"),
    description: t("schemes.data.schemes.kisanCredit.description"),
    totalBudget: 75000000,
    utilized: 52500000,
    beneficiaries: 6850,
    targetBeneficiaries: 10000,
    status: "Active",
    launchDate: "1998-08-01",
    category: t("schemes.data.categories.credit"),
    eligibility: t("schemes.data.schemes.kisanCredit.eligibility"),
    benefits: t("schemes.data.schemes.kisanCredit.benefits"),
  },
  {
    id: 5,
    name: t("schemes.data.schemes.organicFarming.name"),
    description: t("schemes.data.schemes.organicFarming.description"),
    totalBudget: 12000000,
    utilized: 4800000,
    beneficiaries: 2100,
    targetBeneficiaries: 5000,
    status: "New",
    launchDate: "2024-01-01",
    category: t("schemes.data.categories.sustainableAgriculture"),
    eligibility: t("schemes.data.schemes.organicFarming.eligibility"),
    benefits: t("schemes.data.schemes.organicFarming.benefits"),
  },
];

const getCategoryData = (t) => [
  {
    name: t("schemes.data.categories.incomeSupport"),
    value: 35,
    color: "#2E7D32",
  },
  {
    name: t("schemes.data.categories.insurance"),
    value: 25,
    color: "#66BB6A",
  },
  {
    name: t("schemes.data.categories.credit"),
    value: 20,
    color: "#004080",
  },
  {
    name: t("schemes.data.categories.soilHealth"),
    value: 12,
    color: "#DAA520",
  },
  {
    name: t("schemes.data.categories.sustainableAgriculture"),
    value: 8,
    color: "#4E4E4E",
  },
];

const getMonthlyEnrollment = (t) => [
  { month: t("schemes.data.months.jul"), enrolled: 1200, target: 1500 },
  { month: t("schemes.data.months.aug"), enrolled: 1450, target: 1500 },
  { month: t("schemes.data.months.sep"), enrolled: 1680, target: 1800 },
  { month: t("schemes.data.months.oct"), enrolled: 1920, target: 2000 },
  { month: t("schemes.data.months.nov"), enrolled: 2150, target: 2200 },
  { month: t("schemes.data.months.dec"), enrolled: 2380, target: 2500 },
];

const getDistrictPerformance = (t) => [
  {
    district: t("schemes.data.districts.cuttack"),
    beneficiaries: 3420,
    utilization: 85,
  },
  {
    district: t("schemes.data.districts.bhubaneswar"),
    beneficiaries: 2890,
    utilization: 78,
  },
  {
    district: t("schemes.data.districts.puri"),
    beneficiaries: 2156,
    utilization: 92,
  },
  {
    district: t("schemes.data.districts.khordha"),
    beneficiaries: 1987,
    utilization: 88,
  },
  {
    district: t("schemes.data.districts.ganjam"),
    beneficiaries: 1654,
    utilization: 76,
  },
];

export default function SchemesPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    t("schemes.filters.allCategories")
  );
  const [selectedStatus, setSelectedStatus] = useState(
    t("schemes.filters.allStatus")
  );
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newScheme, setNewScheme] = useState({
    name: "",
    description: "",
    category: t("schemes.data.categories.incomeSupport"),
    status: "Active",
    totalBudget: 0,
    beneficiaries: 0,
    targetBeneficiaries: 0,
  });

  // Initialize data with translations
  const schemes = getSchemes(t);
  const categoryData = getCategoryData(t);
  const monthlyEnrollment = getMonthlyEnrollment(t);
  const districtPerformance = getDistrictPerformance(t);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "New":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const translateStatus = (status) => {
    return t(`schemes.status.${status.toLowerCase()}`, {
      defaultValue: status,
    });
  };

  const calculateUtilizationPercentage = (utilized, total) => {
    return Math.round((utilized / total) * 100);
  };

  const exportSchemes = () => {
    const headers = [
      "Name",
      "Category",
      "Status",
      "Beneficiaries",
      "Target",
      "TotalBudget",
    ];
    const rows = schemes.map((s) => [
      s.name,
      s.category,
      s.status,
      s.beneficiaries,
      s.targetBeneficiaries,
      s.totalBudget,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schemes.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleResetFilters = () => {
    setSelectedCategory(t("schemes.filters.allCategories"));
    setSelectedStatus(t("schemes.filters.allStatus"));
  };

  const filteredSchemes = schemes.filter((s) => {
    const categoryOk =
      selectedCategory === t("schemes.filters.allCategories") ||
      s.category === selectedCategory;
    const statusOk =
      selectedStatus === t("schemes.filters.allStatus") ||
      s.status === selectedStatus;
    return categoryOk && statusOk;
  });

  const [viewingSchemeId, setViewingSchemeId] = useState(null);
  const viewingScheme = filteredSchemes.find((s) => s.id === viewingSchemeId);

  const calculateBeneficiaryPercentage = (current, target) => {
    return Math.round((current / target) * 100);
  };

  // Chart configurations
  const categoryConfig = {
    labels: categoryData.map((item) => item.name),
    datasets: [
      {
        data: categoryData.map((item) => item.value),
        backgroundColor: categoryData.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  const enrollmentConfig = {
    labels: monthlyEnrollment.map((item) => item.month),
    datasets: [
      {
        label: t("schemes.charts.enrolled"),
        data: monthlyEnrollment.map((item) => item.enrolled),
        backgroundColor: "#2E7D32",
      },
      {
        label: t("schemes.charts.target"),
        data: monthlyEnrollment.map((item) => item.target),
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
                {t("schemes.header.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("schemes.header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={exportSchemes}>
              <Download className="h-4 w-4 mr-2" />
              {t("schemes.buttons.export")}
            </Button>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t("schemes.buttons.addScheme")}
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Add Scheme Dialog */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogContent className="max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
              <DialogHeader>
                <DialogTitle>{t("schemes.dialog.addTitle")}</DialogTitle>
                <DialogDescription>
                  {t("schemes.dialog.addDescription")}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div>
                  <Label>{t("schemes.form.name")}</Label>
                  <Input
                    value={newScheme.name}
                    onChange={(e) =>
                      setNewScheme({ ...newScheme, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>{t("schemes.form.description")}</Label>
                  <Input
                    value={newScheme.description}
                    onChange={(e) =>
                      setNewScheme({
                        ...newScheme,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>{t("schemes.form.category")}</Label>
                    <Select
                      value={newScheme.category}
                      onValueChange={(v) =>
                        setNewScheme({ ...newScheme, category: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={t("schemes.data.categories.incomeSupport")}
                        >
                          {t("schemes.data.categories.incomeSupport")}
                        </SelectItem>
                        <SelectItem
                          value={t("schemes.data.categories.insurance")}
                        >
                          {t("schemes.data.categories.insurance")}
                        </SelectItem>
                        <SelectItem value={t("schemes.data.categories.credit")}>
                          {t("schemes.data.categories.credit")}
                        </SelectItem>
                        <SelectItem
                          value={t("schemes.data.categories.soilHealth")}
                        >
                          {t("schemes.data.categories.soilHealth")}
                        </SelectItem>
                        <SelectItem
                          value={t(
                            "schemes.data.categories.sustainableAgriculture"
                          )}
                        >
                          {t("schemes.data.categories.sustainableAgriculture")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("schemes.form.status")}</Label>
                    <Select
                      value={newScheme.status}
                      onValueChange={(v) =>
                        setNewScheme({ ...newScheme, status: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">
                          {t("schemes.status.active")}
                        </SelectItem>
                        <SelectItem value="New">
                          {t("schemes.status.new")}
                        </SelectItem>
                        <SelectItem value="Completed">
                          {t("schemes.status.completed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label>{t("schemes.form.beneficiaries")}</Label>
                    <Input
                      type="number"
                      value={newScheme.beneficiaries}
                      onChange={(e) =>
                        setNewScheme({
                          ...newScheme,
                          beneficiaries: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("schemes.form.targetBeneficiaries")}</Label>
                    <Input
                      type="number"
                      value={newScheme.targetBeneficiaries}
                      onChange={(e) =>
                        setNewScheme({
                          ...newScheme,
                          targetBeneficiaries: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>{t("schemes.form.totalBudget")}</Label>
                    <Input
                      type="number"
                      value={newScheme.totalBudget}
                      onChange={(e) =>
                        setNewScheme({
                          ...newScheme,
                          totalBudget: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await createScheme(newScheme);
                      setShowAddDialog(false);
                    } catch (e) {
                      alert("Failed to save scheme: " + e.message);
                    }
                  }}
                >
                  {t("common.save")}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: t("schemes.metrics.totalSchemes"),
                value: "5",
                change: t("schemes.metrics.changes.totalSchemes"),
                icon: Gift,
                color: "text-blue-500",
              },
              {
                title: t("schemes.metrics.totalBeneficiaries"),
                value: "45,420",
                change: t("schemes.metrics.changes.totalBeneficiaries"),
                icon: Users,
                color: "text-green-500",
              },
              {
                title: t("schemes.metrics.budgetUtilized"),
                value: t("schemes.metrics.values.budgetUtilized", {
                  amount: "121.75",
                }),
                change: t("schemes.metrics.changes.budgetUtilized", {
                  percentage: 77,
                }),
                icon: IndianRupee,
                color: "text-purple-500",
              },
              {
                title: t("schemes.metrics.avgEnrollment"),
                value: "85.2%",
                change: t("schemes.metrics.changes.avgEnrollment"),
                icon: TrendingUp,
                color: "text-orange-500",
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
                      <p className="text-xs text-muted-foreground">
                        {metric.change}
                      </p>
                    </div>
                    <metric.icon className={`h-8 w-8 ${metric.color}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Filters */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle>{t("schemes.filters.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("schemes.filters.selectCategory")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t("schemes.filters.allCategories")}>
                      {t("schemes.filters.allCategories")}
                    </SelectItem>
                    <SelectItem
                      value={t("schemes.data.categories.incomeSupport")}
                    >
                      {t("schemes.data.categories.incomeSupport")}
                    </SelectItem>
                    <SelectItem value={t("schemes.data.categories.insurance")}>
                      {t("schemes.data.categories.insurance")}
                    </SelectItem>
                    <SelectItem value={t("schemes.data.categories.credit")}>
                      {t("schemes.data.categories.credit")}
                    </SelectItem>
                    <SelectItem value={t("schemes.data.categories.soilHealth")}>
                      {t("schemes.data.categories.soilHealth")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("schemes.filters.selectStatus")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={t("schemes.filters.allStatus")}>
                      {t("schemes.filters.allStatus")}
                    </SelectItem>
                    <SelectItem value="Active">
                      {t("schemes.status.active")}
                    </SelectItem>
                    <SelectItem value="New">
                      {t("schemes.status.new")}
                    </SelectItem>
                    <SelectItem value="Completed">
                      {t("schemes.status.completed")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters}>
                  {t("schemes.buttons.reset")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs
            defaultValue="schemes"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schemes">
                {t("schemes.tabs.activeSchemes")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {t("schemes.tabs.analytics")}
              </TabsTrigger>
              <TabsTrigger value="performance">
                {t("schemes.tabs.performance")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="schemes" className="space-y-4">
              {filteredSchemes.map((scheme, index) => (
                <Card
                  key={scheme.id}
                  className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-2 lg:space-y-0">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-foreground">
                              {scheme.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getStatusColor(scheme.status)}
                            >
                              {translateStatus(scheme.status)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {scheme.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {scheme.description}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingSchemeId(scheme.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t("schemes.buttons.viewDetails")}
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            {t("schemes.labels.budgetUtilization")}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{scheme.utilized / 10000000}</span>
                              <span>
                                {calculateUtilizationPercentage(
                                  scheme.utilized,
                                  scheme.totalBudget
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={calculateUtilizationPercentage(
                                scheme.utilized,
                                scheme.totalBudget
                              )}
                              className="h-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            {t("schemes.labels.beneficiaries")}
                          </p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>
                                {scheme.beneficiaries.toLocaleString()}
                              </span>
                              <span>
                                {calculateBeneficiaryPercentage(
                                  scheme.beneficiaries,
                                  scheme.targetBeneficiaries
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={calculateBeneficiaryPercentage(
                                scheme.beneficiaries,
                                scheme.targetBeneficiaries
                              )}
                              className="h-2"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            {t("schemes.labels.launchDate")}
                          </p>
                          <p className="text-sm">
                            {new Date(scheme.launchDate).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            {t("schemes.labels.totalBudget")}
                          </p>
                          <p className="text-sm font-medium">
                            {scheme.totalBudget / 1000}k
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {t("schemes.labels.eligibility")}
                          </p>
                          <p className="text-sm">{scheme.eligibility}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            {t("schemes.labels.benefits")}
                          </p>
                          <p className="text-sm">{scheme.benefits}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("schemes.charts.schemeDistribution")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                      <Doughnut
                        data={categoryConfig}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {categoryData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-muted-foreground">
                            {item.name} ({item.value}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("schemes.charts.monthlyEnrollment")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: "300px" }}>
                      <Bar data={enrollmentConfig} options={chartOptions} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("schemes.performance.title")}</CardTitle>
                  <CardDescription>
                    {t("schemes.performance.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {districtPerformance.map((district, index) => (
                      <div
                        key={district.district}
                        className="flex items-center justify-between p-4 rounded-lg border border-border animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="space-y-1">
                          <h4 className="font-medium text-foreground">
                            {district.district}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {t("schemes.performance.beneficiaries", {
                              count: district.beneficiaries.toLocaleString(),
                            })}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">
                            {t("schemes.performance.utilization", {
                              percentage: district.utilization,
                            })}
                          </p>
                          <div className="w-24">
                            <Progress
                              value={district.utilization}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
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
