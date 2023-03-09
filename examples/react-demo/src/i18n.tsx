import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import common_de from "./modules/common/translations/de.json";
import common_en from "./modules/common/translations/en.json";
import failure_de from "./modules/failure/translations/de.json";
import failure_en from "./modules/failure/translations/en.json";
import faq_de from "./modules/faq/translations/de.json";
import faq_en from "./modules/faq/translations/en.json";
import notice_de from "./modules/notice/translations/de.json";
import notice_en from "./modules/notice/translations/en.json";
import start_de from "./modules/start/translations/de.json";
import start_en from "./modules/start/translations/en.json";
import success_de from "./modules/success/translations/de.json";
import success_en from "./modules/success/translations/en.json";
import swipe_de from "./modules/swipe/translations/de.json";
import swipe_en from "./modules/swipe/translations/en.json";
import touchSensitivity_de from "./modules/touchSensitivity/translations/de.json";
import touchSensitivity_en from "./modules/touchSensitivity/translations/en.json";
import SDKSingleton from "./modules/swipe/SDK";

const resources = {
  en: {
    common: common_en,
    failure: failure_en,
    faq: faq_en,
    notice: notice_en,
    start: start_en,
    success: success_en,
    swipe: swipe_en,
    touchSensitivity: touchSensitivity_en,
  },
  de: {
    common: common_de,
    failure: failure_de,
    faq: faq_de,
    notice: notice_de,
    start: start_de,
    success: success_de,
    swipe: swipe_de,
    touchSensitivity: touchSensitivity_de,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,

    supportedLngs: ["en", "de"],

    // FIXME: set language
    // lng: "de",
    lng: "en",
    fallbackLng: "en",

    fallbackNS: "common",

    debug: true,

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },

    react: {
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p", "sup", "u"],
    },
  });

// FIXME: set Languange if wanted
// try {
//   const sdk = SDKSingleton.getInstance().sdk;
//   i18n.changeLanguage(sdk.getFinalSDKLanguage());
// } catch (error) {}

export default i18n;
