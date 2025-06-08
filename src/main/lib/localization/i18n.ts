import i18n from "i18next";
import backend from "i18next-fs-backend"
import config from "../../../../resources/i18n.config.json"
import path from "node:path";
import { app } from "electron/main";
import { existsSync } from "node:fs";

export interface i18nConfig {
  preferredLanguage: string
}


/*  TODO: See if we can do this without hardcoding the app.asar.unpacked
 * */
let basePath = path.join(app.getAppPath(), "resources/locales")

// this is for production builds where we need to look into the asar.unPack instead
if (!existsSync(basePath)) {
  basePath = path.join(app.getAppPath(), "resources/app.asar.unpacked/resources")
}

i18n
  .use(backend)
  .init({
    backend: {
      loadPath: basePath + "/{{lng}}/{{ns}}.json",
      addPath: basePath + "/{{lng}}/{{ns}}.missing.json",
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
