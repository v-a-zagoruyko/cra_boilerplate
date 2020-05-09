const path = require("path");

module.exports = {
  components: "src/components/**/*.tsx",
  exampleMode: "hide",
  require: ["babel-polyfill", path.join(__dirname, "src/styles/style.scss")],
  usageMode: "expand",
  showSidebar: false,
  skipComponentsWithoutExample: true,
};
