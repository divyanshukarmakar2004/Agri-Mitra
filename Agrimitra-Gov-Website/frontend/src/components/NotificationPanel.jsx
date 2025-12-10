import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Bell, AlertTriangle, Info, CheckCircle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

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
  },
  {
    id: 4,
    type: "info",
    priority: "medium",
    titleKey: "dashboard.notifications.market.title",
    messageKey: "dashboard.notifications.market.message",
    timeKey: "dashboard.notifications.market.time",
  },
];

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

export function NotificationPanel() {
  const { t } = useTranslation();

  return (
    <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-400 bg-[#fff3d4]/45">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-primary" />
            <span>{t("dashboard.notifications.title")}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {t("dashboard.notifications.count", {
              count: notifications.length,
            })}
          </Badge>
        </CardTitle>
        <CardDescription>
          {t("dashboard.notifications.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors animate-in fade-in-0 slide-in-from-right-2"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1">
                    {t(notification.titleKey)}
                  </h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ml-2 ${getPriorityColor(
                      notification.priority
                    )}`}
                  >
                    {t(`dashboard.notifications.priority.${notification.priority}`)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {t(notification.messageKey)}
                </p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{t(notification.timeKey)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full bg-transparent">
            {t("dashboard.notifications.viewAll")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
