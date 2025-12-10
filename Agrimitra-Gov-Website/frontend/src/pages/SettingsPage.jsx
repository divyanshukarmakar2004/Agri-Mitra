import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Sidebar } from "../components/Sidebar";
import { Settings, Menu, User, Globe, Bell, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [firstName, setFirstName] = useState("Admin");
  const [lastName, setLastName] = useState("User");
  const [email, setEmail] = useState("admin@odisha.gov.in");
  const [phone, setPhone] = useState("+91 9876543210");
  const [language, setLanguage] = useState("en");
  const [notifications, setNotifications] = useState(true);

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "ta", name: "தமிழ்" },
    { code: "or", name: "ଓଡ଼ିଆ" },
    { code: "te", name: "తెలుగు" },
    { code: "mr", name: "मराठी" },
    { code: "ml", name: "മലയാളം" },
  ];

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
                {t("settings.title")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("settings.subtitle")}
              </p>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Profile Settings */}
          <Card className="animate-in fade-in-0 slide-in-from-top-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>{t("settings.profileInformation")}</span>
              </CardTitle>
              <CardDescription>{t("settings.updateDetails")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t("settings.firstName")}</Label>
                  <Input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t("settings.lastName")}</Label>
                  <Input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t("settings.email")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("settings.phone")}</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6">
                <Button>{t("settings.saveChanges")}</Button>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>{t("settings.languagePreferences")}</span>
              </CardTitle>
              <CardDescription>
                {t("settings.selectPreferredLanguage")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="language">{t("settings.language")}</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>{t("settings.notificationSettings")}</span>
              </CardTitle>
              <CardDescription>
                {t("settings.manageNotifications")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {t("settings.emailNotifications")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.receiveEmailUpdates")}
                    </p>
                  </div>
                  <Button
                    variant={notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotifications(!notifications)}
                  >
                    {notifications
                      ? t("settings.enabled")
                      : t("settings.disabled")}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {t("settings.smsNotifications")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.receiveSMSAlerts")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("settings.disabled")}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {t("settings.pushNotifications")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t("settings.receivePushNotifications")}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    {t("settings.disabled")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>{t("settings.securitySettings")}</span>
              </CardTitle>
              <CardDescription>{t("settings.manageSecurity")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    {t("settings.currentPassword")}
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder={t("settings.enterCurrentPassword")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    {t("settings.newPassword")}
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={t("settings.enterNewPassword")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    {t("settings.confirmPassword")}
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={t("settings.confirmNewPassword")}
                  />
                </div>
                <Button>{t("settings.updatePassword")}</Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
