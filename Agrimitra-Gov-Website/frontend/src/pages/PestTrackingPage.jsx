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
import { Alert, AlertDescription, AlertTitle } from "../components/ui/Alert";
import { Sidebar } from "../components/Sidebar";
import {
  Bug,
  AlertTriangle,
  MapPin,
  Menu,
  Bell,
  Shield,
  Eye,
} from "lucide-react";
import CropHealthMap from "./CropHealthMap";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/Dialog";

const getPestOutbreaks = (t) => [
  {
    id: 1,
    pest: t("pestTracking.data.pests.brownPlantHopper"),
    crop: t("pestTracking.data.crops.rice"),
    district: t("pestTracking.data.districts.cuttack"),
    severity: "High",
    affectedArea: "2,500 Ha",
    reportedDate: "2024-12-18",
    status: "Active",
    farmers: 450,
  },
  {
    id: 2,
    pest: t("pestTracking.data.pests.stemBorer"),
    crop: t("pestTracking.data.crops.rice"),
    district: t("pestTracking.data.districts.puri"),
    severity: "Medium",
    affectedArea: "1,800 Ha",
    reportedDate: "2024-12-15",
    status: "Controlled",
    farmers: 320,
  },
  {
    id: 3,
    pest: t("pestTracking.data.pests.aphids"),
    crop: t("pestTracking.data.crops.wheat"),
    district: t("pestTracking.data.districts.bhubaneswar"),
    severity: "Low",
    affectedArea: "900 Ha",
    reportedDate: "2024-12-12",
    status: "Monitoring",
    farmers: 180,
  },
  {
    id: 4,
    pest: t("pestTracking.data.pests.leafCurlVirus"),
    crop: t("pestTracking.data.crops.tomato"),
    district: t("pestTracking.data.districts.khordha"),
    severity: "High",
    affectedArea: "1,200 Ha",
    reportedDate: "2024-12-10",
    status: "Treatment",
    farmers: 280,
  },
];

const getDiseaseAlerts = (t) => [
  {
    id: 1,
    disease: t("pestTracking.data.diseases.blastDisease"),
    crop: t("pestTracking.data.crops.rice"),
    symptoms: t("pestTracking.data.symptoms.blastDisease"),
    prevention: t("pestTracking.data.prevention.blastDisease"),
    treatment: t("pestTracking.data.treatment.blastDisease"),
    severity: "High",
  },
  {
    id: 2,
    disease: t("pestTracking.data.diseases.powderyMildew"),
    crop: t("pestTracking.data.crops.wheat"),
    symptoms: t("pestTracking.data.symptoms.powderyMildew"),
    prevention: t("pestTracking.data.prevention.powderyMildew"),
    treatment: t("pestTracking.data.treatment.powderyMildew"),
    severity: "Medium",
  },
  {
    id: 3,
    disease: t("pestTracking.data.diseases.bacterialWilt"),
    crop: t("pestTracking.data.crops.tomato"),
    symptoms: t("pestTracking.data.symptoms.bacterialWilt"),
    prevention: t("pestTracking.data.prevention.bacterialWilt"),
    treatment: t("pestTracking.data.treatment.bacterialWilt"),
    severity: "High",
  },
];

const getWeatherAdvisories = (t) => [
  {
    id: 1,
    title: t("pestTracking.data.weatherAdvisories.heavyRainfall.title"),
    description: t(
      "pestTracking.data.weatherAdvisories.heavyRainfall.description"
    ),
    districts: [
      t("pestTracking.data.districts.puri"),
      t("pestTracking.data.districts.balasore"),
      t("pestTracking.data.districts.bhadrak"),
    ],
    validUntil: "2024-12-25",
    priority: "High",
  },
  {
    id: 2,
    title: t("pestTracking.data.weatherAdvisories.temperatureRise.title"),
    description: t(
      "pestTracking.data.weatherAdvisories.temperatureRise.description"
    ),
    districts: [
      t("pestTracking.data.districts.cuttack"),
      t("pestTracking.data.districts.khordha"),
      t("pestTracking.data.districts.nayagarh"),
    ],
    validUntil: "2024-12-30",
    priority: "Medium",
  },
];

const getTreatmentRecommendations = (t) => [
  {
    pest: t("pestTracking.data.pests.brownPlantHopper"),
    chemical: t("pestTracking.data.treatments.brownPlantHopper.chemical"),
    dosage: t("pestTracking.data.treatments.brownPlantHopper.dosage"),
    application: t("pestTracking.data.treatments.brownPlantHopper.application"),
    frequency: t("pestTracking.data.treatments.brownPlantHopper.frequency"),
  },
  {
    pest: t("pestTracking.data.pests.stemBorer"),
    chemical: t("pestTracking.data.treatments.stemBorer.chemical"),
    dosage: t("pestTracking.data.treatments.stemBorer.dosage"),
    application: t("pestTracking.data.treatments.stemBorer.application"),
    frequency: t("pestTracking.data.treatments.stemBorer.frequency"),
  },
];

export default function PestTrackingPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedSeverity, setSelectedSeverity] = useState("All Severity");
  const [viewingOutbreak, setViewingOutbreak] = useState(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertOutbreak, setAlertOutbreak] = useState(null);

  const pestOutbreaks = getPestOutbreaks(t);
  const diseaseAlerts = getDiseaseAlerts(t);
  const weatherAdvisories = getWeatherAdvisories(t);
  const treatmentRecommendations = getTreatmentRecommendations(t);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-red-100 text-red-800 border-red-200";
      case "Controlled":
        return "bg-green-100 text-green-800 border-green-200";
      case "Monitoring":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Treatment":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Translate severity and status
  const translateSeverity = (severity) => {
    return t(`pestTracking.severity.${severity.toLowerCase()}`, {
      defaultValue: severity,
    });
  };

  const translateStatus = (status) => {
    return t(`pestTracking.status.${status.toLowerCase()}`, {
      defaultValue: status,
    });
  };

  const filteredOutbreaks = getPestOutbreaks(t).filter((o) => {
    const districtOk =
      selectedDistrict === "All Districts" ||
      o.district === selectedDistrict ||
      // Some locales translate district labels; allow includes match
      o.district?.toString() === selectedDistrict;
    const severityOk =
      selectedSeverity === "All Severity" || o.severity === selectedSeverity;
    return districtOk && severityOk;
  });

  const handleResetFilters = () => {
    setSelectedDistrict("All Districts");
    setSelectedSeverity("All Severity");
  };

  const handleViewDetails = (outbreak) => {
    setViewingOutbreak(outbreak);
  };

  const handleSendAlert = (outbreak) => {
    setAlertOutbreak(outbreak);
    setShowAlertDialog(true);
  };

  const confirmSendAlert = () => {
    // Simulate sending alert
    console.log("Sending alert for outbreak:", alertOutbreak);
    setShowAlertDialog(false);
    setAlertOutbreak(null);
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
                {t("pestTracking.header.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("pestTracking.header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="destructive" className="animate-pulse">
              {t("pestTracking.header.activeOutbreaks", {
                count: pestOutbreaks.filter((p) => p.status === "Active")
                  .length,
              })}
            </Badge>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Alert Banner */}
          <Alert className="animate-in fade-in-0 slide-in-from-top-4 duration-500 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">
              {t("pestTracking.alerts.critical")}
            </AlertTitle>
            <AlertDescription className="text-red-700">
              {t("pestTracking.alerts.description")}
            </AlertDescription>
          </Alert>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                title: t("pestTracking.metrics.activeOutbreaks"),
                value: "4",
                change: t("pestTracking.metrics.change.activeOutbreaks"),
                icon: Bug,
                color: "text-red-500",
              },
              {
                title: t("pestTracking.metrics.affectedArea"),
                value: "6.4K Ha",
                change: t("pestTracking.metrics.change.affectedArea"),
                icon: MapPin,
                color: "text-orange-500",
              },
              {
                title: t("pestTracking.metrics.farmersImpacted"),
                value: "1,230",
                change: t("pestTracking.metrics.change.farmersImpacted"),
                icon: AlertTriangle,
                color: "text-yellow-500",
              },
              {
                title: t("pestTracking.metrics.controlRate"),
                value: "78%",
                change: t("pestTracking.metrics.change.controlRate"),
                icon: Shield,
                color: "text-green-500",
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
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle>{t("pestTracking.filters.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={selectedDistrict}
                  onValueChange={setSelectedDistrict}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("pestTracking.filters.district")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Districts">
                      {t("pestTracking.filters.allDistricts")}
                    </SelectItem>
                    <SelectItem value="Cuttack">Cuttack</SelectItem>
                    <SelectItem value="Puri">Puri</SelectItem>
                    <SelectItem value="Bhubaneswar">Bhubaneswar</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedSeverity}
                  onValueChange={setSelectedSeverity}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("pestTracking.filters.severity")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Severity">
                      {t("pestTracking.filters.allSeverity")}
                    </SelectItem>
                    <SelectItem value="High">
                      {t("pestTracking.severity.high")}
                    </SelectItem>
                    <SelectItem value="Medium">
                      {t("pestTracking.severity.medium")}
                    </SelectItem>
                    <SelectItem value="Low">
                      {t("pestTracking.severity.low")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleResetFilters}>
                  {t("pestTracking.filters.reset")}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs Content */}
          <Tabs
            defaultValue="weather"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="weather">
                {t("pestTracking.tabs.heatmap")}
              </TabsTrigger>
              <TabsTrigger value="outbreaks">
                {t("pestTracking.tabs.outbreaks")}
              </TabsTrigger>
              <TabsTrigger value="diseases">
                {t("pestTracking.tabs.diseases")}
              </TabsTrigger>
              <TabsTrigger value="treatment">
                {t("pestTracking.tabs.treatment")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="outbreaks" className="space-y-4">
              {filteredOutbreaks.map((outbreak, index) => (
                <Card
                  key={outbreak.id}
                  className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-foreground">
                            {outbreak.pest}
                          </h3>
                          <Badge
                            variant="outline"
                            className={getSeverityColor(outbreak.severity)}
                          >
                            {translateSeverity(outbreak.severity)}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={getStatusColor(outbreak.status)}
                          >
                            {translateStatus(outbreak.status)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">
                              {t("pestTracking.outbreaks.crop")}
                            </p>
                            <p>{outbreak.crop}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("pestTracking.outbreaks.district")}
                            </p>
                            <p>{outbreak.district}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("pestTracking.outbreaks.area")}
                            </p>
                            <p>{outbreak.affectedArea}</p>
                          </div>
                          <div>
                            <p className="font-medium">
                              {t("pestTracking.outbreaks.farmers")}
                            </p>
                            <p>{outbreak.farmers}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(outbreak)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          {t("pestTracking.outbreaks.view")}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleSendAlert(outbreak)}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          {t("pestTracking.outbreaks.alert")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="diseases" className="space-y-4">
              {diseaseAlerts.map((disease, index) => (
                <Card
                  key={disease.id}
                  className="animate-in fade-in-0 slide-in-from-right-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {disease.disease}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={getSeverityColor(disease.severity)}
                      >
                        {t("pestTracking.disease.risk", {
                          severity: translateSeverity(disease.severity),
                        })}
                      </Badge>
                    </div>
                    <CardDescription>
                      {t("pestTracking.disease.affecting", {
                        crop: disease.crop,
                      })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          {t("pestTracking.disease.symptoms")}
                        </h4>
                        <p className="text-sm">{disease.symptoms}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          {t("pestTracking.disease.prevention")}
                        </h4>
                        <p className="text-sm">{disease.prevention}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">
                          {t("pestTracking.disease.treatment")}
                        </h4>
                        <p className="text-sm">{disease.treatment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="weather" className="space-y-4">
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">
                  {t("pestTracking.heatmap.title")}
                </h2>
                <CropHealthMap />
              </div>
            </TabsContent>

            <TabsContent value="treatment" className="space-y-4">
              {treatmentRecommendations.map((treatment, index) => (
                <Card
                  key={treatment.pest}
                  className="animate-in fade-in-0 slide-in-from-left-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {t("pestTracking.treatment.header", {
                        pest: treatment.pest,
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            {t("pestTracking.treatment.chemical")}
                          </h4>
                          <p className="text-sm font-medium">
                            {treatment.chemical}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            {t("pestTracking.treatment.dosage")}
                          </h4>
                          <p className="text-sm">{treatment.dosage}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            {t("pestTracking.treatment.application")}
                          </h4>
                          <p className="text-sm">{treatment.application}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">
                            {t("pestTracking.treatment.frequency")}
                          </h4>
                          <p className="text-sm">{treatment.frequency}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* View Details Dialog */}
      <Dialog
        open={!!viewingOutbreak}
        onOpenChange={(open) => !open && setViewingOutbreak(null)}
      >
        <DialogContent className="max-w-2xl animate-in fade-in-0 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>{viewingOutbreak?.pest}</DialogTitle>
            <DialogDescription>
              {t("pestTracking.details.description")}
            </DialogDescription>
          </DialogHeader>
          {viewingOutbreak && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("pestTracking.outbreaks.crop")}
                  </h4>
                  <p className="text-sm">{viewingOutbreak.crop}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("pestTracking.outbreaks.district")}
                  </h4>
                  <p className="text-sm">{viewingOutbreak.district}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("pestTracking.outbreaks.area")}
                  </h4>
                  <p className="text-sm">{viewingOutbreak.affectedArea}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("pestTracking.outbreaks.farmers")}
                  </h4>
                  <p className="text-sm">{viewingOutbreak.farmers}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("pestTracking.details.severity")}
                  </h4>
                  <Badge
                    variant="outline"
                    className={getSeverityColor(viewingOutbreak.severity)}
                  >
                    {translateSeverity(viewingOutbreak.severity)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    {t("pestTracking.details.status")}
                  </h4>
                  <Badge
                    variant="outline"
                    className={getStatusColor(viewingOutbreak.status)}
                  >
                    {translateStatus(viewingOutbreak.status)}
                  </Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  {t("pestTracking.details.reportedDate")}
                </h4>
                <p className="text-sm">{viewingOutbreak.reportedDate}</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setViewingOutbreak(null)}
                >
                  {t("common.close")}
                </Button>
                <Button
                  onClick={() => {
                    setViewingOutbreak(null);
                    handleSendAlert(viewingOutbreak);
                  }}
                >
                  <Bell className="h-4 w-4 mr-2" />
                  {t("pestTracking.outbreaks.alert")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Send Alert Dialog */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent className="max-w-md animate-in fade-in-0 zoom-in-95 duration-200">
          <DialogHeader>
            <DialogTitle>Pest Alert</DialogTitle>
            <DialogDescription>
                Stay informed about current pest infestations affecting crops.
            </DialogDescription>
          </DialogHeader>
          {alertOutbreak && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">
                      Details of current pest outbreaks.
                </h4>
                <p className="text-sm">
                  <strong>Outbreak Pest:</strong>{" "}
                  {alertOutbreak.pest}
                </p>
                <p className="text-sm">
                  <strong>{t("pestTracking.outbreaks.crop")}:</strong>{" "}
                  {alertOutbreak.crop}
                </p>
                <p className="text-sm">
                  <strong>{t("pestTracking.outbreaks.district")}:</strong>{" "}
                  {alertOutbreak.district}
                </p>
                <p className="text-sm">
                  <strong>{t("pestTracking.outbreaks.area")}:</strong>{" "}
                  {alertOutbreak.affectedArea}
                </p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAlertDialog(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button onClick={confirmSendAlert}>
                  <Bell className="h-4 w-4 mr-2" />
                      Send
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
