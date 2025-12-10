import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Load translation resources (Vite will bundle JSON imports)
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import ta from "./locales/ta.json";
import te from "./locales/te.json";
import ml from "./locales/ml.json";
import orLang from "./locales/or.json";
import mr from "./locales/mr.json";
import kn from "./locales/kn.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  ta: { translation: ta },
  te: { translation: te },
  ml: { translation: ml },
  or: { translation: orLang },
  mr: { translation: mr },
  kn: { translation: kn },
};

const storedLang =
  (typeof window !== "undefined" && localStorage.getItem("language")) || "en";

i18n.use(initReactI18next).init({
  resources,
  lng: storedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  returnEmptyString: false,
});

export default i18n;
