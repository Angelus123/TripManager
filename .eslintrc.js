module.exports = {
  extends: ["airbnb-base"],
  parser: "babel-eslint",
  env: {
    mocha: true,
  },
  rules: {
    "linebreak-style": [
      "error",
      process.env.NODE_ENV === "prod" ? "unix" : "windows",
    ],
    "no-restricted-globals": "off",
    "consistent-return": "off",
    "import/prefer-default-export": "off",
    "import/prefer-default-export": "off",
    "prefer-const": "off",
    "no-underscore-dangle": "off",
    "array-bracket-spacing": "off",
    "no-console": "warn",
    "prefer-destructuring": ["error", { object: true, array: false }],
    "no-unused-vars": ["error", { argsIgnorePattern: "req|res|next|val|err" }],
  },
};
