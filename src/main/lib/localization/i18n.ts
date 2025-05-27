import i18n from "i18next";
import backend from "i18next-fs-backend"
import config from "../../../../resources/i18n.config.json"

export interface i18nConfig {
  preferredLanguage: string
}


i18n
  .use(backend)
  .init({
    backend: {
      loadPath: "resources/locales/{{lng}}/{{ns}}.json",
      addPath: "resources/locales/{{lng}}/{{ns}}.missing.json",
    },
    // other options you might configure
    debug: false,
    saveMissing: true,
    saveMissingTo: "current",
    lng: config.preferredLanguage,
    fallbackLng: ['en'], // i18n.languages returns this instead of supportedLngs, which is pretty cool
    // supportedLngs: ['en'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
