import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Shield, User, Lock, Globe } from "lucide-react";
import { useTranslation } from "../../node_modules/react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const languages = [
  { code: "en", name: "EN" },
  { code: "hi", name: "HI" },
  { code: "ta", name: "TA" },
  { code: "or", name: "OR" },
  { code: "te", name: "TE" },
  { code: "mr", name: "MR" },
  { code: "ml", name: "ML" },
  { code: "kn", name: "KN" },
];

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [language, setLanguage] = useState(i18n.resolvedLanguage || "en");
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (language && language !== i18n.language) {
      i18n.changeLanguage(language);
      try {
        localStorage.setItem("language", language);
      } catch {}
    }
  }, [language, i18n]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (username === "admin" && password === "123456" && captcha === "A7X9K") {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      navigate("/dashboard");
    } else {
      setIsLoading(false);
      setMsg("Login failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF9933]/60 via-white to-[#138808]/60 flex items-center justify-center p-4">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-1000">
        {/* Government Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center animate-in zoom-in-0 duration-700 delay-300">
              <img src="/logo3.png" alt="Logo" className="w-18 h-18" />
            </div>
          </div>
          <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
            <h1 className="text-2xl font-bold text-foreground text-balance">
              {t("gov.name")}
            </h1>
            <p className="text-lg text-muted-foreground text-balance">
              {t("dept.agri.short")}
            </p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-700 shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center text-card-foreground">
              {t("login.signin")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("login.signin.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  {t("login.username")}
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("login.enterUsername")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("login.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={t("login.enterPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="captcha" className="text-sm font-medium">
                  {t("login.securityCode")}
                </Label>
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      id="captcha"
                      type="text"
                      placeholder={t("login.enterCaptcha")}
                      value={captcha}
                      onChange={(e) => setCaptcha(e.target.value)}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  <div className="w-24 h-10 bg-muted rounded border flex items-center justify-center text-sm font-mono">
                    A7X9K
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    <span>{t("login.signingIn")}</span>
                  </div>
                ) : (
                  t("login.signIn")
                )}
              </Button>
              <div className="text-red-600 ml-1">{msg}</div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                {t("login.copyright")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
