import i18n from "i18next";
import backend from "i18next-fs-backend"
import config from "./i18n.config.json"

i18n
  .use(backend)
  .init({
    backend: {
      loadPath: "src/main/lib/localization/locales/{{lng}}/{{ns}}.json",
      addPath: "src/main/lib/localization/locales/{{lng}}/{{ns}}.missing.json",
      contextBridgeApiKey: "api" // needs to match first parameter of contextBridge.exposeInMainWorld in preload file; defaults to "api"
    },

    // other options you might configure
    debug: false,
    saveMissing: true,
    saveMissingTo: "current",
    lng: config.preferredLanguage
  });

export default i18n;
