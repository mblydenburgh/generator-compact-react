/* eslint-disable capitalized-comments, no-warning-comments, prettier/prettier */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const prompts = require("./prompts");
const utils = require("../../utils/utils");
const mkdirp = require("mkdirp");
const parser = require("@babel/parser");
// const traverse = require("babel-traverse");
const recast = require("recast");
const { parse, print } = require("recast");

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
    this.fs.copyTpl(
      this.templatePath("_webpack.config.js"),
      this.destinationPath(`${this.appName}/webpack.config.js`),
      { main: this.main }
    );
    // Create empty components folder
    mkdirp.sync(this.destinationPath(`${this.appName}/app/components`));

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
      // Parse and update webpack config
      // console.log(
      //   this.fs
      //     .read(this.destinationPath(`${this.appName}/webpack.config.js`))
      //     .toString()
      // );


      const webpackAst = parser.parse(
        this.fs
          .read(this.destinationPath(`${this.appName}/webpack.config.js`))
          .toString()
      );
      // AST Path to webpack module rules array
      console.log(webpackAst.program.body[2].expression.right.properties[2].value.properties[0].value);
      console.log("*********************");
      webpackAst.program.body[2].expression.right.properties[2].value.properties[0].value.elements.forEach(item => {
        console.log("PRINTING ELEMENTS")
        console.log(item.properties)
        item.properties.forEach(prop => {
          console.log("PRINTING ELEMENT PROPERTIES")
          console.log(prop.value)
          if(prop.value.type === "ArrayExpression"){
            console.log("Printing element property array elements:")
            console.log(prop.value.elements);
          }
        })
      });

      // const builder = recast.types.builders;

      // Build new module rule to insert using AST Traversing
      // Construct { test: /\.tsx?$/, "use": ["awesome-typescript-loader"] }
      const testRegex = utils.astUtils.createRegex("/\\.tsx?$/");
      const useArray = utils.astUtils.createArray(["awesome-typescript-loader"]);
      const testProperty = utils.astUtils.createObjectProperty("test", testRegex);
      const useProperty = utils.astUtils.createObjectProperty("use", useArray);

      const newRule = utils.astUtils.createObjectExpression([testProperty, useProperty]);
      console.log("NEW RULE:");
      console.log(newRule);
      const updatedRules = [...webpackAst.program.body[2].expression.right.properties[2].value.properties[0].value.elements, newRule];
      console.log("Updated rules:");
      console.log(updatedRules);
      // const ruleArr = utils.astUtils.createArray(updatedRules);
      const elements = webpackAst.program.body[2].expression.right.properties[2].value.properties[0].value;
      console.log("Elements:");
      console.log(elements);
      webpackAst.program.body[2].expression.right.properties[2].value.properties[0].value.elements = updatedRules;
      // const webpackModules = webpackAst.program.body[2].expression.right.properties[2].value.properties[0].value;
      // traverse(webpackModules, {
      //   enter(path) {
      //     if(path.)
      //   }
      // });
    } else {
      // Use Javascript base config
      this.fs.copy(
        this.templatePath("_index.js"),
        this.destinationPath(`${this.appName}/app/index.js`)
      );
      // this.fs.copyTpl(
      //   this.templatePath("_webpack.config.js"),
      //   this.destinationPath(`${this.appName}/webpack.config.js`),
      //   { main: this.main }
      // );
    }

    /* Update configuration for GraphQL:
         1. Update package.json
         2. Add graphql.config.js */
    if (this.api === "GraphQL") {
      let packageJson = {
        dependencies: utils.packageJsonConfig.graphql.dependencies,
        devDependencies: utils.packageJsonConfig.graphql.devDependencies
      };
      this.fs.extendJSON(this.destinationPath(`${this.appName}/package.json`), packageJson);
      this.fs.copyTpl(
        this.templatePath("_.graphqlconfig"),
        this.destinationPath(`${this.appName}/.graphqlconfig`), { appName: this.appName });
    }

    /* Apply Styling Configurations */
    // switch (this.style) {
    //   case ""
    // }
  }

  install() {
    this.installDependencies({
      npm: true,
      bower: false,
      yarn: false
    });
  }
};
