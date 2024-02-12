import * as path from "path";
import { getBaseConfig } from "../../vite.config";

export default getBaseConfig({
  lib: {
    // eslint-disable-next-line no-undef
    entry: path.resolve(__dirname, "src/index.js"),
    name: "activity-quotebyday",
    formats: ["es", "umd"],
    fileName: (format) => `activity-quotebyday.${format}.js`,
  },
});