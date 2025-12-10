import React from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

const LANGS = [
  { code: "en", name: "EN" },
  { code: "hi", name: "HI" },
  { code: "ta", name: "TA" },
  { code: "te", name: "TE" },
  { code: "ml", name: "ML" },
  { code: "or", name: "OR" },
  { code: "mr", name: "MR" },
  { code: "kn", name: "KN" },
];

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage || i18n.language || "en";

  const onChange = (val) => {
    i18n.changeLanguage(val);
    try {
      localStorage.setItem("language", val);
    } catch {}
  };

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger
        className={`w-32 bg-background/80 backdrop-blur-sm border-border/50 ${className}`}
      >
        <Globe className="w-4 h-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGS.map((l) => (
          <SelectItem key={l.code} value={l.code}>
            {l.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
