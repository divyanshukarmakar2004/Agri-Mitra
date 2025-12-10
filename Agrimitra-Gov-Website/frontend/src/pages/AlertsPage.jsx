import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Textarea } from "../components/ui/Textarea";
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
import { Checkbox } from "../components/ui/Checkbox";
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
  Bell,
  Send,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Menu,
  Plus,
  Filter,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { createAlert } from "../services/auth";

const districts = [
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Bhubaneswar",
  "Bolangir",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Kendujhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur",
  "Subarnapur",
  "Sundargarh",
];

export default function AlertsPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedAlertType, setSelectedAlertType] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [isComposing, setIsComposing] = useState(false);
  const [filterType, setFilterType] = useState(
    t("alertsPage.filters.allTypes")
  );
  const [filterStatus, setFilterStatus] = useState(
    t("alertsPage.filters.allStatus")
  );
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templateDraft, setTemplateDraft] = useState({
    subject: "",
    message: "",
  });

  // Dynamic data based on language
  const alertTypes = [
    {
      id: "weather",
      label: t("alertsPage.notifications.weather"),
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      id: "pest",
      label: t("alertsPage.notifications.pest"),
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      id: "market",
      label: t("alertsPage.notifications.market"),
      icon: Info,
      color: "text-blue-500",
    },
    {
      id: "scheme",
      label: t("alertsPage.notifications.scheme"),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      id: "advisory",
      label: t("alertsPage.notifications.advisory"),
      icon: Info,
      color: "text-purple-500",
    },
  ];

  const sentAlerts = [
    {
      id: 1,
      title: t("alertsPage.sentAlerts.weather.title"),
      message: t("alertsPage.sentAlerts.weather.message"),
      type: "weather",
      priority: t("alertsPage.priority.high"),
      recipients: 15420,
      districts: [
        t("alertsPage.districts.puri"),
        t("alertsPage.districts.balasore"),
        t("alertsPage.districts.bhadrak"),
      ],
      sentAt: "2024-12-20 14:30",
      status: t("alertsPage.status.delivered"),
      deliveryRate: 98.5,
    },
    {
      id: 2,
      title: t("alertsPage.sentAlerts.pest.title"),
      message: t("alertsPage.sentAlerts.pest.message"),
      type: "pest",
      priority: t("alertsPage.priority.critical"),
      recipients: 8750,
      districts: [
        t("alertsPage.districts.cuttack"),
        t("alertsPage.districts.khordha"),
      ],
      sentAt: "2024-12-19 09:15",
      status: t("alertsPage.status.delivered"),
      deliveryRate: 96.2,
    },
    {
      id: 3,
      title: t("alertsPage.sentAlerts.scheme.title"),
      message: t("alertsPage.sentAlerts.scheme.message"),
      type: "scheme",
      priority: t("alertsPage.priority.medium"),
      recipients: 25600,
      districts: [t("alertsPage.districts.allDistricts")],
      sentAt: "2024-12-18 16:45",
      status: t("alertsPage.status.delivered"),
      deliveryRate: 94.8,
    },
    {
      id: 4,
      title: t("alertsPage.sentAlerts.market.title"),
      message: t("alertsPage.sentAlerts.market.message"),
      type: "market",
      priority: t("alertsPage.priority.low"),
      recipients: 12300,
      districts: [
        t("alertsPage.districts.bhubaneswar"),
        t("alertsPage.districts.cuttack"),
        t("alertsPage.districts.puri"),
      ],
      sentAt: "2024-12-17 11:20",
      status: t("alertsPage.status.delivered"),
      deliveryRate: 97.1,
    },
  ];

  const templates = [
    {
      id: 1,
      name: t("alertsPage.templates.weather.name"),
      type: "weather",
      subject: t("alertsPage.templates.weather.subject"),
      message: t("alertsPage.templates.weather.message"),
    },
    {
      id: 2,
      name: t("alertsPage.templates.pest.name"),
      type: "pest",
      subject: t("alertsPage.templates.pest.subject"),
      message: t("alertsPage.templates.pest.message"),
    },
  ];

  const metrics = [
    {
      title: t("alertsPage.metrics.totalAlerts"),
      value: "1,247",
      change: t("alertsPage.metrics.thisWeek", { count: 23 }),
      icon: Bell,
    },
    {
      title: t("alertsPage.metrics.activeRecipients"),
      value: "24,847",
      change: t("alertsPage.metrics.newRecipients", { count: 156 }),
      icon: CheckCircle,
    },
    {
      title: t("alertsPage.metrics.deliveryRate"),
      value: "96.8%",
      change: t("alertsPage.metrics.improvement", { percent: 2.1 }),
      icon: Send,
    },
    {
      title: t("alertsPage.metrics.responseRate"),
      value: "78.5%",
      change: t("alertsPage.metrics.increase", { percent: 5.3 }),
      icon: Clock,
    },
  ];

  const deliveryMetrics = [
    {
      label: t("alertsPage.analytics.smsDelivery"),
      rate: 98.5,
      color: "bg-green-500",
    },
    {
      label: t("alertsPage.analytics.appNotifications"),
      rate: 94.2,
      color: "bg-blue-500",
    },
    {
      label: t("alertsPage.analytics.voiceCalls"),
      rate: 87.8,
      color: "bg-yellow-500",
    },
    {
      label: t("alertsPage.analytics.emailDelivery"),
      rate: 92.1,
      color: "bg-purple-500",
    },
  ];

  const handleDistrictChange = (district, checked) => {
    if (checked) {
      setSelectedDistricts([...selectedDistricts, district]);
    } else {
      setSelectedDistricts(selectedDistricts.filter((d) => d !== district));
    }
  };

  const handleSendAlert = async () => {
    const payload = {
      type: selectedAlertType,
      title: alertTitle,
      message: alertMessage,
      districts: selectedDistricts,
      priority,
    };
    try {
      await createAlert(payload);
      setSelectedAlertType("");
      setSelectedDistricts([]);
      setAlertTitle("");
      setAlertMessage("");
      setPriority("Medium");
      setIsComposing(false);
    } catch (e) {
      alert("Failed to send alert: " + e.message);
    }
  };

  const filteredSentAlerts = sentAlerts.filter((a) => {
    const typeOk =
      filterType === t("alertsPage.filters.allTypes") || a.type === filterType;
    const statusOk =
      filterStatus === t("alertsPage.filters.allStatus") ||
      a.status === filterStatus;
    return typeOk && statusOk;
  });

  const resetFilters = () => {
    setFilterType(t("alertsPage.filters.allTypes"));
    setFilterStatus(t("alertsPage.filters.allStatus"));
  };

  const beginEditTemplate = (tpl) => {
    setEditingTemplate(tpl.id);
    setTemplateDraft({ subject: tpl.subject, message: tpl.message });
  };

  const saveTemplateEdit = (tplId) => {
    // In a real app we'd persist; here we update local state array
    const idx = templates.findIndex((t) => t.id === tplId);
    if (idx !== -1) {
      templates[idx].subject = templateDraft.subject;
      templates[idx].message = templateDraft.message;
    }
    setEditingTemplate(null);
  };

  const useTemplate = (tpl) => {
    setIsComposing(true);
    setSelectedAlertType(tpl.type);
    setAlertTitle(tpl.subject);
    setAlertMessage(tpl.message);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case t("alertsPage.priority.critical"):
        return "bg-red-100 text-red-800 border-red-200";
      case t("alertsPage.priority.high"):
        return "bg-orange-100 text-orange-800 border-orange-200";
      case t("alertsPage.priority.medium"):
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case t("alertsPage.priority.low"):
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    const alertType = alertTypes.find((t) => t.id === type);
    if (alertType) {
      const Icon = alertType.icon;
      return <Icon className={`h-4 w-4 ${alertType.color}`} />;
    }
    return <Info className="h-4 w-4 text-gray-500" />;
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
                {t("alertsPage.header.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("alertsPage.header.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Dialog open={isComposing} onOpenChange={setIsComposing}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("alertsPage.header.composeAlert")}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-200">
                <DialogHeader>
                  <DialogTitle>{t("alertsPage.compose.title")}</DialogTitle>
                  <DialogDescription>
                    {t("alertsPage.compose.description")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Alert Type */}
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">
                      {t("alertsPage.compose.alertType")}
                    </Label>
                    <Select
                      value={selectedAlertType}
                      onValueChange={setSelectedAlertType}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("alertsPage.compose.selectAlertType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">
                      {t("alertsPage.compose.priority")}
                    </Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("alertsPage.priority.critical")}>
                          {t("alertsPage.priority.critical")}
                        </SelectItem>
                        <SelectItem value={t("alertsPage.priority.high")}>
                          {t("alertsPage.priority.high")}
                        </SelectItem>
                        <SelectItem value={t("alertsPage.priority.medium")}>
                          {t("alertsPage.priority.medium")}
                        </SelectItem>
                        <SelectItem value={t("alertsPage.priority.low")}>
                          {t("alertsPage.priority.low")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      {t("alertsPage.compose.alertTitle")}
                    </Label>
                    <Input
                      id="title"
                      value={alertTitle}
                      onChange={(e) => setAlertTitle(e.target.value)}
                      placeholder={t("alertsPage.compose.enterAlertTitle")}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t("alertsPage.compose.message")}
                    </Label>
                    <Textarea
                      id="message"
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      placeholder={t("alertsPage.compose.enterAlertMessage")}
                      rows={6}
                    />
                  </div>

                  {/* District Selection */}
                  <div className="space-y-2">
                    <Label>{t("alertsPage.compose.targetDistricts")}</Label>
                    <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
                      {districts.map((district) => (
                        <div
                          key={district}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={district}
                            checked={selectedDistricts.includes(district)}
                            onCheckedChange={(checked) =>
                              handleDistrictChange(district, checked)
                            }
                          />
                          <Label htmlFor={district} className="text-sm">
                            {district}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedDistricts.length}{" "}
                      {t("alertsPage.compose.districtsSelected")}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsComposing(false)}
                    >
                      {t("alertsPage.compose.cancel")}
                    </Button>
                    <Button
                      onClick={handleSendAlert}
                      disabled={
                        !selectedAlertType ||
                        !alertTitle ||
                        !alertMessage ||
                        selectedDistricts.length === 0
                      }
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {t("alertsPage.compose.sendAlert")}
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
            defaultValue="sent"
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sent">
                {t("alertsPage.tabs.sent")}
              </TabsTrigger>
              <TabsTrigger value="templates">
                {t("alertsPage.tabs.templates")}
              </TabsTrigger>
              <TabsTrigger value="analytics">
                {t("alertsPage.tabs.analytics")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sent" className="space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5 text-primary" />
                    <span>{t("alertsPage.filters.title")}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("alertsPage.filters.filterByType")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("alertsPage.filters.allTypes")}>
                          {t("alertsPage.filters.allTypes")}
                        </SelectItem>
                        {alertTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("alertsPage.filters.filterByStatus")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={t("alertsPage.filters.allStatus")}>
                          {t("alertsPage.filters.allStatus")}
                        </SelectItem>
                        <SelectItem value={t("alertsPage.status.delivered")}>
                          {t("alertsPage.status.delivered")}
                        </SelectItem>
                        <SelectItem value={t("alertsPage.status.pending")}>
                          {t("alertsPage.status.pending")}
                        </SelectItem>
                        <SelectItem value={t("alertsPage.status.failed")}>
                          {t("alertsPage.status.failed")}
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Button variant="outline" onClick={resetFilters}>
                      {t("alertsPage.filters.reset")}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Sent Alerts List */}
              <div className="space-y-4">
                {filteredSentAlerts.map((alert, index) => (
                  <Card
                    key={alert.id}
                    className="animate-in fade-in-0 slide-in-from-left-2 hover:shadow-md transition-all duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center space-x-3">
                            {getTypeIcon(alert.type)}
                            <h3 className="text-lg font-semibold text-foreground">
                              {alert.title}
                            </h3>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(alert.priority)}
                            >
                              {alert.priority}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-800 border-green-200"
                            >
                              {alert.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {alert.message}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {alert.districts.map((district) => (
                              <Badge
                                key={district}
                                variant="secondary"
                                className="text-xs"
                              >
                                {district}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right space-y-2 lg:ml-6">
                          <div className="text-sm">
                            <p className="font-medium text-foreground">
                              {alert.recipients.toLocaleString()}{" "}
                              {t("alertsPage.recipients")}
                            </p>
                            <p className="text-muted-foreground">
                              {alert.deliveryRate}% {t("alertsPage.delivered")}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {alert.sentAt}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template, index) => (
                  <Card
                    key={template.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        {getTypeIcon(template.type)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {t("alertsPage.templates.subject")}
                        </p>
                        {editingTemplate === template.id ? (
                          <Input
                            value={templateDraft.subject}
                            onChange={(e) =>
                              setTemplateDraft({
                                ...templateDraft,
                                subject: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <p className="text-sm bg-muted p-2 rounded">
                            {template.subject}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {t("alertsPage.templates.messageTemplate")}
                        </p>
                        {editingTemplate === template.id ? (
                          <Textarea
                            value={templateDraft.message}
                            onChange={(e) =>
                              setTemplateDraft({
                                ...templateDraft,
                                message: e.target.value,
                              })
                            }
                            rows={6}
                          />
                        ) : (
                          <div className="text-sm bg-muted p-3 rounded max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap text-xs">
                              {template.message}
                            </pre>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {editingTemplate === template.id ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => setEditingTemplate(null)}
                            >
                              {t("common.cancel")}
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => saveTemplateEdit(template.id)}
                            >
                              {t("common.save")}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => beginEditTemplate(template)}
                            >
                              {t("alertsPage.templates.edit")}
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={() => useTemplate(template)}
                            >
                              {t("alertsPage.templates.use")}
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("alertsPage.analytics.distributionByType")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {alertTypes.map((type, index) => (
                        <div
                          key={type.id}
                          className="animate-in fade-in-0 slide-in-from-left-2"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center space-x-2">
                              <type.icon className={`h-4 w-4 ${type.color}`} />
                              <span className="text-sm font-medium">
                                {type.label}
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {Math.floor(Math.random() * 300) + 50}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {t("alertsPage.analytics.deliveryPerformance")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {deliveryMetrics.map((metric, index) => (
                        <div
                          key={metric.label}
                          className="animate-in fade-in-0 slide-in-from-right-2"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              {metric.label}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {metric.rate}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className={`${metric.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                              style={{ width: `${metric.rate}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
