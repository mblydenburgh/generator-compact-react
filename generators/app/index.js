/* eslint-disable capitalized-comments, no-warning-comments, default-case */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const prompts = require("./prompts");
const utils = require("./utils/utils");
const mkdirp = require("mkdirp");

const JAVASCRIPT = utils.constants.LANGUAGE_ENUM.JAVASCRIPT;
const TYPESCRIPT = utils.constants.LANGUAGE_ENUM.TYPESCRIPT;
const CSS = utils.constants.STYLE_ENUM.CSS;
const SASS = utils.constants.STYLE_ENUM.SASS;
const SCSS = utils.constants.STYLE_ENUM.SCSS;
const LESS = utils.constants.STYLE_ENUM.LESS;
const STYLED_COMPONENTS = utils.constants.STYLE_ENUM.STYLED_COMPONETS;

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the gnarly ${chalk.yellow(
          "generator-compact-react"
        )} generator!`
      )
    );

    return this.prompt(prompts).then(answers => {
      this.appName = answers.appName;
      this.language = answers.language;
      if (this.language === TYPESCRIPT) {
        this.main = utils.constants.TS_MAIN;
        // this.webpackModules = [
        //   ...utils.constants.WEBPACK_MODULES,
        //   utils.constants.TS_WEBPACK_MODULE
        // ];
      } else {
        this.main = utils.constants.MAIN;
        // this.webpackModules = utils.constants.WEBPACK_MODULES;
      }

      this.api = answers.api;
      this.style = answers.style;

      this.config.set("appName", this.appName);
      this.config.set("language", this.language);
      this.config.set("api", this.api);
      this.config.set("style", this.style);
      this.config.set("main", this.main);
      // this.config.set("webpackModules", this.webpackModules);

      console.log(`Selected config:`);
      console.log(`Name: ${this.appName}`);
      console.log(`Language: ${this.language}`);
      console.log(`Api: ${this.api}`);
      console.log(`Styling: ${this.style}`);
    });
  }

  writing() {
    // TODO - Find way to template webpack.config.js modules property to only need one template file

    // Copy base package.json
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath(`${this.appName}/package.json`),
      {
        appName: this.appName,
        main: this.main
      }
    );

    // Create empty components folder & write HTML template file
    mkdirp.sync(this.destinationPath(`${this.appName}/app/components`));
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath(`${this.appName}/app/index.html`),
      { appName: this.appName }
    );

    /* Update configuration for typescript:
        1. Update package.json with new dependencies
        2. Update webpack.config.js
        3. Write tsconfig.tsx file */
    if (this.language === TYPESCRIPT) {
      let packageJson = {
        dependencies: utils.packageJsonConfig.typescript.dependencies,
        devDependencies: utils.packageJsonConfig.typescript.devDependencies
      };
      this.fs.extendJSON(
        this.destinationPath(`${this.appName}/package.json`),
        packageJson
      );
      this.fs.copy(
        this.templatePath("_index.tsx"),
        this.destinationPath(`${this.appName}/app/index.tsx`)
      );
      this.fs.copy(
        this.templatePath("_tsconfig.json"),
        this.destinationPath(`${this.appName}/tsconfig.json`)
      );
      this.fs.copyTpl(
        this.templatePath("_tswebpack.config.js"),
        this.destinationPath(`${this.appName}/webpack.config.js`),
        { main: this.main }
      );
    } else {
      // Use Javascript base config
      this.fs.copy(
        this.templatePath("_index.js"),
        this.destinationPath(`${this.appName}/app/index.js`)
      );
      this.fs.copyTpl(
        this.templatePath("_webpack.config.js"),
        this.destinationPath(`${this.appName}/webpack.config.js`),
        { main: this.main }
      );
    }

    /* Update configuration for GraphQL:
         1. Update package.json
         2. Add graphql.config.js */
    if (this.api === "GraphQL") {
      let packageJson = {
        dependencies: utils.packageJsonConfig.graphql.dependencies,
        devDependencies: utils.packageJsonConfig.graphql.devDependencies
      };
      this.fs.extendJSON(
        this.destinationPath(`${this.appName}/package.json`),
        packageJson
      );
      this.fs.copyTpl(
        this.templatePath("_.graphqlconfig"),
        this.destinationPath(`${this.appName}/.graphqlconfig`),
        { appName: this.appName }
      );
    }

    /* Update configuration for styling:
       1. Set package.json dependencies
       2. Set the styling suffix for style file
       3. Set template path for webpack config updates
       4. Update files once config variables set */
    let packageJson;
    let styleSuffix;
    let templatePath;
    switch (this.style) {
      case CSS: {
        packageJson = {
          dependencies: utils.packageJsonConfig.css.dependencies
        };
        styleSuffix = CSS;
        break;
      }

      case SASS: {
        packageJson = {
          devDependencies: utils.packageJsonConfig.sass.devDependencies
        };
        styleSuffix = SASS;
        templatePath = "sasswebpack.config.js";
        break;
      }

      case SCSS: {
        packageJson = {
          devDependencies: utils.packageJsonConfig.scss.devDependencies
        };
        styleSuffix = SCSS;
        templatePath = "sasswebpack.config.js";
        break;
      }

      case LESS: {
        packageJson = {
          devDependencies: utils.packageJsonConfig.less.devDependencies
        };
        styleSuffix = LESS;
        templatePath = "lesswebpack.config.js";
        break;
      }

      case STYLED_COMPONENTS: {
        packageJson = {
          devDependencies:
            utils.packageJsonConfig["styled-components"].dependencies
        };
        break;
      }
    }

    // Update package.json, webpack.config.js, write base style file after styling chosen
    this.fs.extendJSON(
      this.destinationPath(`${this.appName}/package.json`),
      packageJson
    );
    this.fs.write(`${this.appName}/style.${styleSuffix}`, "");
    if (this.language === JAVASCRIPT && this.style !== CSS) {
      this.fs.copyTpl(
        this.templatePath(`_${templatePath}`),
        this.destinationPath(`${this.appName}/webpack.config.js`),
        { main: this.main }
      );
    } else if (this.language === TYPESCRIPT && this.style !== CSS) {
      this.fs.copyTpl(
        this.templatePath(`_ts${templatePath}`),
        this.destinationPath(`${this.appName}/webpack.config.js`),
        { main: this.main }
      );
    }
  }

  install() {
    // Set the working directory for the npm install command to the set appName, run npm install
    process.chdir(`${process.cwd()}/${this.appName}`);
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    }).then(() => {
      console.log("Dependencies installed - have fun!");
      console.log(
        `To begin, run the following commands:
      ${chalk.yellow(`cd ${this.appName}`)}
      ${chalk.yellow(`npm run start`)}
      `.trim()
      );
    });
  }
};
