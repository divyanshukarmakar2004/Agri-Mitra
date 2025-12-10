import React, { useState, useRef, useEffect } from "react";
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
  Users,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  IndianRupee,
  Bell,
  Menu,
  Activity,
  X,
  Info,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  Loader,
} from "lucide-react";
import { Sidebar } from "../components/Sidebar";
import { DashboardCharts } from "../components/DashboardCharts";
import { NotificationPanel } from "../components/NotificationPanel";
import { HeatmapWidget } from "../components/HeatmapWidget";
import { PieChart } from "../components/PieChart";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/auth";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const dashboardStats = [
  {
    titleKey: "dashboard.stats.totalFarmers",
    value: "24,847",
    change: "+12.5%",
    changeType: "positive",
    icon: Users,
    color: "text-chart-1",
  },
  {
    titleKey: "dashboard.stats.activeMonitoring",
    value: "18,392",
    change: "+8.2%",
    changeType: "positive",
    icon: TrendingUp,
    color: "text-chart-2",
  },
  {
    titleKey: "dashboard.stats.pestAlerts",
    value: "127",
    change: "-15.3%",
    changeType: "negative",
    icon: AlertTriangle,
    color: "text-destructive",
  },
  {
    titleKey: "dashboard.stats.marketUpdates",
    value: "₹2,45,680",
    change: "+5.7%",
    changeType: "positive",
    icon: IndianRupee,
    color: "text-chart-4",
  },
];

const recentActivities = [
  {
    id: 1,
    title: "New farmer registration in Cuttack district",
    time: "2 minutes ago",
    type: "registration",
  },
  {
    id: 2,
    title: "Pest alert issued for Bhubaneswar region",
    time: "15 minutes ago",
    type: "alert",
  },
  {
    id: 3,
    title: "Market price updated for Rice (Basmati)",
    time: "1 hour ago",
    type: "market",
  },
  {
    id: 4,
    title: "Weather advisory sent to 5,000+ farmers",
    time: "2 hours ago",
    type: "advisory",
  },
];

// Notification data
const notifications = [
  {
    id: 1,
    type: "warning",
    priority: "high",
    titleKey: "dashboard.notifications.weather.title",
    messageKey: "dashboard.notifications.weather.message",
    timeKey: "dashboard.notifications.weather.time",
  },
  {
    id: 2,
    type: "info",
    priority: "medium",
    titleKey: "dashboard.notifications.scheme.title",
    messageKey: "dashboard.notifications.scheme.message",
    timeKey: "dashboard.notifications.scheme.time",
  },
  {
    id: 3,
    type: "success",
    priority: "low",
    titleKey: "dashboard.notifications.pest.title",
    messageKey: "dashboard.notifications.pest.message",
    timeKey: "dashboard.notifications.pest.time",
  }
];

// Helper functions for notification display
const getNotificationIcon = (type) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "info":
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "low":
    default:
      return "bg-green-100 text-green-800 border-green-200";
  }
};

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Handle settings navigation
  const handleSettingsClick = () => {
    navigate("/settings");
    setProfileOpen(false);
  };

  // Handle sign out
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const result = await auth.signOut();
      if (result.success) {
        // Redirect to login page after successful sign out
        navigate("/");
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
      setProfileOpen(false);
    }
  };

  // Close notification popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle profile popup close on outside click and Escape key
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }

    function handleEscKey(event) {
      if (event.key === "Escape" && profileOpen) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [profileOpen]);

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="content-container flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card  border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="logo" className="h-15 w-15" />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {t("dept.agri")}
              </h1>
              <p className="text-sm text-muted-foreground">{t("gov.name")}</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="relative bg-transparent"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>

              {/* Notification Popup */}
              {notificationOpen && (
                <div
                  ref={notificationRef}
                  className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50 animate-in fade-in-0 slide-in-from-top-5 duration-300"
                >
                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      {t("header.notifications")}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setNotificationOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                      <div
                        key={notification.id}
                        className="p-3 border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start space-x-2">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">
                                {t(notification.titleKey)}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                                {t(notification.messageKey)}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                              <Badge
                                variant="outline"
                                className={`text-xs ${getPriorityColor(
                                  notification.priority
                                )}`}
                              >
                                  {t(`dashboard.notifications.priority.${notification.priority}`)}
                              </Badge>
                              <span>{t(notification.timeKey)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent text-xs"
                    >
                      {t("header.viewAll")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{t("header.adminUser")}</p>
              <p className="text-xs text-muted-foreground">
                {t("header.deptOfficer")}
              </p>
            </div>
            <div className="relative">
              <Button
                className="relative bg-transparent border-0"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-haspopup="true"
                aria-expanded={profileOpen}
                aria-label="User profile menu"
              >
                <img
                  src="/profile.png"
                  alt="User profile"
                  className="h-7 w-7 rounded-full"
                />
              </Button>

              {/*Profile Popup */}
              {profileOpen && (
                <div
                  ref={profileRef}
                  className="absolute right-0 top-full mt-2 w-64 bg-card rounded-lg shadow-lg border border-border z-50 animate-in fade-in-0 slide-in-from-top-5 duration-300"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src="/profile.png"
                        alt="Profile"
                        className="h-10 w-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {t("header.adminUser")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          admin@example.com
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={handleSettingsClick}
                        role="menuitem"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        {t("header.settings")}
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50/50"
                        onClick={handleSignOut}
                        role="menuitem"
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? (
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4 mr-2" />
                        )}
                        {isSigningOut
                          ? t("header.signingOut")
                          : t("header.signOut")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardStats.map((stat, index) => (
              <Card
                key={stat.titleKey}
                className="animate-in fade-in-0 slide-in-from-bottom-4 hover:shadow-green-800 transition-all duration-300 hover:-translate-y-1 bg-[#e9ffe4]/45"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t(stat.titleKey)}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span
                      className={
                        stat.changeType === "positive"
                          ? "text-chart-1"
                          : "text-destructive"
                      }
                    >
                      {stat.change}
                    </span>{" "}
                    {t("dashboard.fromLastMonth")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts and Heatmap Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Heatmap Widget */}
            <HeatmapWidget />

            {/* Notifications Panel */}
            <NotificationPanel />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-6">
              <DashboardCharts />
            </div>

            <div className="flex flex-col space-y-6">
              <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-500 bg-[#fff3d4]/45">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>{t("dashboard.recentActivities")}</span>
                  </CardTitle>
                  <CardDescription>
                    {t("dashboard.latestUpdates")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 animate-in fade-in-0 slide-in-from-right-2"
                        style={{ animationDelay: `${600 + index * 100}ms` }}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                              {t(`dashboard.activities.${activity.type}.title`)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                              {t(`dashboard.activities.${activity.type}.time`)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <PieChart />
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700 bg-[#fff3d4]/45">
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("dashboard.schemeImplementation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("dashboard.pmKisan")}</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-800 bg-[#fff3d4]/45">
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("dashboard.dataCollection")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("dashboard.cropSurvey")}</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-900 bg-[#fff3d4]/45">
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("dashboard.systemHealth")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("dashboard.serverStatus")}</span>
                    <span>99%</span>
                  </div>
                  <Progress value={99} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
