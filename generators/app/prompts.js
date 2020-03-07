const utils = require("../../utils/utils");

module.exports = [
  {
    name: "appName",
    type: "input",
    message: "Enter a project name",
    default: "compact-react"
  },
  {
    name: "language",
    type: "list",
    message: "What language to use?",
    choices: utils.config.getChoices("language"),
    default: utils.config.getDefaultChoice("language")
  },
  {
    name: "api",
    type: "list",
    message: "What API type to use?",
    choices: utils.config.getChoices("api"),
    default: utils.config.getDefaultChoice("api")
  },
  {
    name: "style",
    type: "list",
    message: "What type of styling to use?",
    choices: utils.config.getChoices("style"),
    default: utils.config.getDefaultChoice("style")
  }
];
