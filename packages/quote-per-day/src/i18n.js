import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

const options = {
   debug: true,
   fallbackLng: "es-mx",
   load: "currentOnly",
   interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
   },
   backend: {
      loadPath: (lng, ns) => {
         return `/locales/${lng}/${ns}.json`;
         //return ` https://your.cloudfront.net/i18n/addons/${lng}/${ns}.json`;
      },
      crossDomain: true,
   },
};

i18n.use(Backend).use(initReactI18next).init(options);

export default i18n;
