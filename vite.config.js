import path from "path";
import { defineConfig } from "vite";
import pluginReact from "@vitejs/plugin-react";

const isExternal = (id) => !id.startsWith(".") && !path.isAbsolute(id);

export const getBaseConfig = ({ plugins = [], lib }) =>
   defineConfig(({ mode }) => {
      if (mode === "development") {
         return {
            plugins: [pluginReact(), ...plugins],
            build: {
               minify: false,
               lib,
               rollupOptions: {
                  external: isExternal,
                  output: {
                     globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                        "styled-components": "styled",
                     },
                  },
               },
            },
         };
      } else {
         return {
            plugins: [pluginReact(), ...plugins],
            build: {
               lib,
               rollupOptions: {
                  external: isExternal,
                  output: {
                     globals: {
                        react: "React",
                        "react-dom": "ReactDOM",
                        "styled-components": "styled",
                     },
                  },
               },
            },
         };
      }
   });
