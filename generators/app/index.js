/* eslint-disable capitalized-comments, no-warning-comments */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const prompts = require("./prompts");
const utils = require("../../utils/utils");
const mkdirp = require("mkdirp");

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
      if (this.language === "typescript") {
        this.main = utils.packageJsonConfig.typescript.main;
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
    // TODO - Find way to template webpack.config.js modules propery to only need one template file

    // Copy base package.json
    this.fs.copyTpl(
      this.templatePath("_package.json"),
      this.destinationPath(`${this.appName}/package.json`),
      {
        appName: this.appName,
        main: this.main
      }
    );

    /* Update configuration for typescript:
        1. Update package.json with new dependencies
        2. Update webpack.config.js
        3. Write tsconfig.tsx file */
    if (this.language === "typescript") {
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

    // Create empty components folder
    mkdirp.sync(this.destinationPath(`${this.appName}/app/components`));
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
