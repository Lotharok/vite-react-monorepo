# React + Lerna + Vite + mswjs

## Lerna Initial Setup

El Primer paso es configurar el proyecto de lerna, crear el folder del
proyecto y dentro del folder correr el siguiente comando:

```BASH
npx lerna init
```

Esto va a crear la estructua esencial para lerna, con los siguientes
archivos `lerna.json, package.json` y se debe de tener una carpeta vacia
llamada `packages` si no esta crearla.

Se debe modificar el archivo **lerna.json** debe de quedar similar a esto:

```JSON
{
  "$schema": "node_modules/lerna/schemas/lerna-schema.json",
  "packages": ["packages/*"],
  "npmClient": "yarn",
  "version": "independent"
}
```

## Vite Initial Setup

Una vez teniendo esto nos posicionamos en la carpeta `packages` y empezamos a crear
nuestros proyectos, para este ejemplo crearemos dos uno que se pueda exportar como libreria
y otro para poder utilizarlo.

Ejecutamos el siguiente comando:

```BASH
npx create-vite pt-common --template react
```

Donde `pt-common` es el nombre de tu proyecto y `react` indica que va a ser un proyecto de React.

Esto nos va a crear la siguiente estructura:

```
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   └── react.svg
│   ├── index.css
│   └── main.jsx
└── vite.config.js
```

Para los proyectos que van a funcionar como librerias solo vamos a dejar la siguiente estructura:

```
├── package.json
├── src
│   ├── components
│   │   └── index.js
│   └── index.js
├── tsconfig.json
└── vite.config.js
```

<span id="packageConfigLib"></span>
La configuracion de las **dependencies** generales y las **devDependencies** se deben de bajar al `package.json`
que nos creo **lerna**, hay que modificar el `package.json` de los proyectos que sean librerias agregando la
siguiente seccion:

```JSON
"files": [
    "dist"
  ],
  "main": "./dist/pt-common.umd.js",
  "module": "./dist/pt-common.es.js",
  "exports": {
    ".": {
      "import": "./dist/pt-common.es.js",
      "require": "./dist/pt-common.umd.js"
    }
  },
```

lo cual va a indicar como va a ser exportado al momento de compilarlo.

Asi mismo editamos el script `dev`, para permitir generar el componente sin minificar en modo desarrollo.

```JSON
 "scripts": {
      "dev": "vite build --mode development",
      "build": "vite build",
      "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
      "preview": "vite preview",
      "storybook": "storybook dev -p 6006",
      "build-storybook": "storybook build"
   },
```

## Storybook Initial Setup

En los proyectos que van a funcionar como librerias de componentes vamos a instalar Storybook.
Ejecutamos el siguiente comando:

```BASH
npx storybook@latest init
```

Nos va a generar el folder `.storybook` con los archivos de configuracion y la carpeta `stories` en
`src`, la cual vamos a eliminar por que vamos a compilar nuestros propios componentes.

Posteriormente vamos a ejecutar el siguiente comando, para poder compilar con Vite los componentes:

```BASH
npx sb init --builder @storybook/builder-vite
```

Se deben de mover todas las dependencias que se hayan agregado al `package.json` global. Podemos
ejecutando simplemente con el comando `yarn storybook`.

La primera vez que vamos a habitar `storybook` en el proyecto general, debemos de ejecutar el comando:

```BASH
npx storybook@latest init
```

En la raiz del proyecto y vamos a modificar el archivo `.storybook\main.js` con lo siguiente:

```JS
stories: [
  "../packages/*/src/**/*..mdx",
  "../packages/*/src/**/*.stories.@(js|jsx|ts|tsx)"
],
```

Y vamos a remover del `package.json` global los scripts:

```JSON
"storybook": "storybook dev -p 6006",
"build-storybook": "storybook build"
```

## Global Setup

### Common Vite

Se debe de agregar un archivo `vite.config.js` en la raiz del proyecto lerna. Quedando de la siguiente forma:

```JS
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
```

<span id="viteConfigLib"></span>
Y dentro de los proyectos que estan en packages tenemos que modificar su archivo `vite.config.js` para
que herede del general, quedando de la siguiente manera:

```JS
import * as path from "path";
import { getBaseConfig } from "../../vite.config";

export default getBaseConfig({
  lib: {
    entry: path.resolve(__dirname, "src/index.js"),
    name: "PtCommon",
    formats: ["es", "umd"],
    fileName: (format) => `pt-common.${format}.js`,
  },
});
```

De igual forma para la configuracion de **ESLint** se debe de colocar el archivo `.eslintrc.cjs`
en la raiz del proyecto lerna, y en dado que existan en cada proyecto se deben de eliminar.

### Common Storybook

Para cada proyecto de tipo libreria de componentes vamos a ejecutar los archivos dentro de
`.storybook`.

Para `main.js` quedaria de la siguiente manera:

```JS
import commonConfigs from "../../../.storybook/main";

const config = {
  ...commonConfigs,
  stories: ["../src/**/*..mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
};

export default config;
```

Para `preview.js` quedaria de la siguiente manera:

```JS
import preview from "../../../.storybook/preview";

export default preview;
```

Por ultimo agregamos el archivo `preview-head.html`.

```HTML
<script>
  window.global = window;
</script>
```

## Componentes JavaScript para uso general

Para poder agregar componentes o librerias para uso general nos posicionamos nuevamente en la
`packages` y creamos una nuevo proyecto con el siguiente comando:

```BASH
npx create-vite pt-common-js --template vanilla
```

Una vez creado el proyecto ejecutamos la [configuracion](#packageConfigLib) en el archivo `package.json`
y la [configuracion](#viteConfigLib).

De igual forma hay que eliminar los archivos que se han configurado de forma global como el `.gitignore`
y los archivos no necesarios como `index.html` o lo que esta en al carpeta `public`.

## Mock Api

Se va a utilizar mswjs para poder probar nuestro front sin necesidad del backend. Lo primero es instalar como
devDependencies `msw`, lo hacemos en el `package.json` global.

Una vez instalado el paquete ejecutamos proseguimos a configurar el worker de msw en la raiz de cada proyecto
del tipo demo, ejecutando el siguiente comando:

```BASH
npx msw init public
```

Lo siguiente seria configurar el mock service, crearemos una nueva carpeta llamada `mocks`, y dentro de esta dos carpetas mas
`data` donde estaran las respustas mockeadas y `handlers` donde se configurara los request intercepatados.

Vamos a agregar los siguientes archivos:

1. `./mocks/browser.js` el cual tendra la configuracion general del mock service.

```JS
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers/index.js";

export const worker = setupWorker(...handlers);
```

2. `./handlers/index.js` el cual tendra el exportado de todos los servicios a mockear

```JS
import { service1 } from "./service1.js";
import { service2 } from "./service2.js";

export const handlers = [...service1, ...service2];
```

3. `./handlers/serviceXX.js` es la definicion del servicio a mockear [Documentacion](https://mswjs.io/docs/basics/intercepting-requests)

```JS
import { http, HttpResponse } from "msw";
import { jsonActivities } from "../data/activities.js";

export const service1 = [
   http.get("https://activity.com.mx/v2/rates", () => {
      return HttpResponse.json(jsonActivities);
   }),
];
```

4. `./data/XXX.js` seria los datos que van a regresar los servicios mockeados.

```JS
export const jsonActivities = [
   {
      id: 1,
      uri: "uri-ejemplo",
      name: "Catamarán a Isla Mujeres con barra libre y snorkel",
   },
];
```

Al final vamos a tener una estructura similar:

```
├── .storybook
├── mocks
│   ├── data
│   │   └── data1.js
│   ├── handlers
│   │   ├── service1.js
│   │   └── index.js
│   └── browser.js
├── packages
├── .eslintrc.cjs
├── .gitignore
├── lerna.json
├── package.json
└── vite.config.js
```

Por ultimo para configurar nuestra aplicacion para ocupar el mock tenemos que modificar el archivo
`main.jsx` de nuestro proyecto.

```JS
async function deferRender() {
  if (import.meta.env.VITE_USE_MOCKS !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser.js");
  return worker.start();
}

deferRender().then(() => {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

## Internationalization con i18next

Para manejar diferentes idiomas de nuestra aplicacion vamos a utilizar [react-i18next](https://react.i18next.com/).
Vamos a instalar lo siguiente;

```BASH
yarn add react-i18next
yarn add i18next
yarn add i18next-http-backend
```

Una vez instalado esto, creamos el archivo `i18n.js` junto a nuestro `main.jsx` minimo con el siguiente contenido:

```JS
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
```

La configuracion de `backend` nos permite tener los archivos locales o bien en algun cdn publico,
para desarrollo, es conveniente manejarlos locales y una vez que se sube a produccion manejarlos desde una cdn.

Los archivos para configurar las traducciones son de tipo `JSON` y debe de quedar en una estructura de carpetas
como la siguiente:

```
└── public
    └── locales
        ├── es-MX
        │   └── translation.json
        ├── es-CO
        │   └── translation.json
        └── en-US
            └── translation.json
```

Para poder empezar a utilizar el servicio hay que importar el archivo `i18n.js` en nuestro `main.tsx` de la
siguiente forma:

```JS
import "./i18n.js";
```

Por ultimo para ya utilizarlo en nuestros componentes quedaria de la siguiente manera:

```JSX
...
import { useTranslation } from "react-i18next";
...

function App() {
  const { t } = useTranslation();
  ...
  <button ref={myContainer} type="button">{t("home.label_librery")}</button>
  ...
}

export default App;

```
