import { http, HttpResponse } from "msw";
import { jsonActivities } from "../data/activities.js";

export const service1 = [
   http.get("https://activity-rates.priceres.com.mx/v2/rates", () => {
      return HttpResponse.json(jsonActivities);
   }),
];
