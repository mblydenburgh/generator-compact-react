const LANGUAGE_ENUM = {
  typescript: "typescript",
  javascript: "javascript"
};

const DEPENDENCIES = {
  "react": "^16.12.0",
  "react-dom": "^16.12.0"
};

const DEV_DEPENDENCIES = {
  "@babel/core": "^7.7.4",
  "@babel/plugin-proposal-class-properties": "^7.7.4",
  "@babel/preset-env": "^7.7.4",
  "@babel/preset-react": "^7.7.4",
  "babel-loader": "^8.0.6",
  "eslint-plugin-react-hooks": "^2.3.0",
  "html-webpack-plugin": "^3.2.0",
  "webpack": "^4.41.2",
  "webpack-cli": "^3.3.10",
  "webpack-dev-server": "^3.9.0",
  "css-loader": "^3.2.1",
  "style-loader": "^1.0.1",
  "file-loader": "^5.0.2"
};

const WEBPACK_MODULES = [
  { test: /\.(js)$/, use: "babel-loader" },
  { test: /\.(css)$/, use: ["css-loader", "style-loader"] },
  { test: /\.(jpg|png|jpeg|gif)$/, use: ["file-loader"] }
];

const TS_WEBPACK_MODULE = {
  test: /\.tsx?$/,
  use: ["awesome-typescript-loader"]
};

const MAIN = "./app/index.js";
const TS_MAIN = "./app/index.tsx";

module.exports = {
  LANGUAGE_ENUM,
  DEPENDENCIES,
  DEV_DEPENDENCIES,
  MAIN,
  TS_MAIN,
  WEBPACK_MODULES,
  TS_WEBPACK_MODULE
};
