import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(Backend).use(LanguageDetector).use(initReactI18next);
i18n.init({
  backend: {
    loadPath: "/locales/{{lng}}/{{ns}}.json",
  },
  fallbackLng: "en",
  ns: [
    "grc",
    "vendor",
    "risk",
    "compliance",
    "survey",
    "audits",
    "loss",
    "issue",
    "businessresilience",
    "documentpolicy",
    "common",
  ],
  interpolation: {
    escapeValue: false,
  },
});

i18n.services.formatter = {
  ...i18n.services.formatter,
  translate: (key, options = {}) => {
    const { formId } = options; 

    const namespaces = [
      "grc",
      "vendor",
      "risk",
      "compliance",
      "survey",
      "audits",
      "loss",
      "issue",
      "businessresilience",
      "documentpolicy",
      "common", // Fallback to common if translation is not found elsewhere
    ];

    if (formId) {
      const translation = i18n.t(`${namespaces[0]}:${formId}.${key}`, options);
      if (translation !== `${formId}.${key}`) {
        return translation; 
      }
    }

    for (const ns of namespaces) {
      const translation = i18n.t(`${ns}:${key}`, options);
      if (translation !== key) {
        return translation;
      }
    }

    return i18n.t(`issue:${key}`, options); 
  },
};

export default i18n;
