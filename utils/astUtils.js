/* eslint-disable prettier/prettier */
const recast = require("recast");
const builder = recast.types.builders;

const createRegex = (pattern) => {
  return builder.regExpLiteral(pattern, "");
};

const createArray = (items) => {
  console.log(`ARRAY TYPE: ${typeof items[0]}`);
  if (typeof items[0] === "string") {
    const strLiteralArr = items.map(item => builder.stringLiteral(item));
    return builder.arrayExpression(strLiteralArr);
  }

  return builder.arrayExpression(items);

};

// const updateArrayExpression()

const createObjectProperty = (key, value) => {
  console.log(`Creating object property -> key: [${key}], value: [${value}]`);
  const id = builder.identifier(key);
  return builder.objectProperty(id, value);
};

const createObjectExpression = (props) => {
  return builder.objectExpression(props)
};

module.exports = {
  createObjectProperty,
  createArray,
  createRegex,
  createObjectExpression
};
