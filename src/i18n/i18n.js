import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { supportedLangs } from "./supportedLngs";

const rtlLanguages = ["ar", "he"];

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "fr",
    supportedLngs: supportedLangs.map(e => e.code),
    debug: import.meta.env.DEV,
    ns: ["errors"],   
    defaultNS: "errors",
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/app/locales/{{lng}}.json", 
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      lookupQuerystring: "lng",
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

const initializeLanguageAndDirection = () => {
  const savedLanguage = localStorage.getItem("i18nextLng") || "fr";
  const savedDirection = localStorage.getItem("direction");
  
  if (savedDirection) {
    document.documentElement.dir = savedDirection;
  } else {
    const initialIsRTL = rtlLanguages.includes(savedLanguage);
    const initialDirection = initialIsRTL ? "rtl" : "ltr";
    document.documentElement.dir = initialDirection;
    localStorage.setItem("direction", initialDirection);
  }
  
  document.documentElement.lang = savedLanguage;
};

// Initialize on load
if (typeof window !== "undefined") {
  initializeLanguageAndDirection();
}

i18n.on("languageChanged", (lng) => {
  const isRTL = rtlLanguages.includes(lng);
  const direction = isRTL ? "rtl" : "ltr";
  
  if (typeof window !== "undefined") {
    localStorage.setItem("direction", direction);
    document.documentElement.dir = direction;
    document.documentElement.lang = lng;
  }
});

export default i18n;