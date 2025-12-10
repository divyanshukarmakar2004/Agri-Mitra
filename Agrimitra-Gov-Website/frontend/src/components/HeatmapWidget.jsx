import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { MapPin, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

const districtData = [
  { name: "bhubaneswar", farmers: 3420, intensity: 85 },
  { name: "Cuttack", farmers: 2890, intensity: 72 },
  { name: "Puri", farmers: 2156, intensity: 54 },
  { name: "Khordha", farmers: 1987, intensity: 49 },
  { name: "Ganjam", farmers: 1654, intensity: 41 },
  { name: "Balasore", farmers: 1432, intensity: 36 },
  { name: "Mayurbhanj", farmers: 1298, intensity: 32 },
  { name: "Kendrapara", farmers: 1156, intensity: 29 },
];

const getIntensityColor = (intensity) => {
  if (intensity >= 80) return "bg-[#DAA520]";
  if (intensity >= 60) return "bg-[#004080]";
  if (intensity >= 40) return "bg-[#2E7D32]";
  if (intensity >= 20) return "bg-[#66BB6A]";
  return "bg-[#4E4E4E]";
};

export function HeatmapWidget() {
  const { t } = useTranslation();

  const getIntensityLabel = (intensity) => {
    if (intensity >= 80) return t("dashboard.heatmap.intensity.veryHigh");
    if (intensity >= 60) return t("dashboard.heatmap.intensity.high");
    if (intensity >= 40) return t("dashboard.heatmap.intensity.medium");
    if (intensity >= 20) return t("dashboard.heatmap.intensity.low");
    return t("dashboard.heatmap.intensity.veryLow");
  };

  return (
    <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200 bg-[#fff3d4]/45">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>{t("dashboard.heatmap.title")}</span>
        </CardTitle>
        <CardDescription>
          {t("dashboard.heatmap.subtitle")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {districtData.map((district, index) => (
            <div
              key={district.name}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200 animate-in fade-in-0 slide-in-from-left-2"
              style={{ animationDelay: `${400 + index * 50}ms` }}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${getIntensityColor(
                    district.intensity
                  )} animate-pulse`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                     {t(`dashboard.heatmap.districts.${district.name.toLowerCase()}`)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {getIntensityLabel(district.intensity)} {t("dashboard.heatmap.density")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 text-sm font-medium text-foreground">
                  <Users className="h-3 w-3" />
                  <span>{district.farmers.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {district.intensity}% {t("dashboard.heatmap.capacity")}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {t("dashboard.heatmap.legend")}
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { color: "bg-[#DAA520]", label: t("dashboard.heatmap.legendItems.veryHigh") },
              { color: "bg-[#004080]", label: t("dashboard.heatmap.legendItems.high") },
              { color: "bg-[#2E7D32]", label: t("dashboard.heatmap.legendItems.medium") },
              { color: "bg-[#66BB6A]", label: t("dashboard.heatmap.legendItems.low") },
              { color: "bg-[#4E4E4E]", label: t("dashboard.heatmap.legendItems.veryLow") },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
