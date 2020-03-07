let options = require("./configoptions");

// Return the requested setting from configoptions.json
let getSetting = setting => {
  // eslint-disable-next-line no-negated-condition
  return options[setting] !== undefined ? options[setting] : null;
};

// Return the choices for a given setting
let getChoices = setting => {
  let config = getSetting(setting);
  return config && Array.isArray(config.options) ? config.options : null;
};

// Return the requested choice by key
let getChoiceByKey = (setting, key) => {
  let choices = getChoices(setting);
  if (!choices) return null;

  let result = null;

  for (let choice of choices) {
    if (choice.name === key) {
      result = choice;
      break;
    }
  }

  return result;
};

// Return the default choice for a setting
let getDefaultChoice = setting => {
  let config = getSetting(setting);
  return config && config.default !== undefined && config.default.length > 0
    ? config.default
    : null;
};

module.exports = {
  getSetting,
  getChoices,
  getChoiceByKey,
  getDefaultChoice
};
