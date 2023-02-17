const unitConfigs = require("../../../jest.config.js");

module.exports = {
  ...unitConfigs,
  rootDir: ".",
  testRegex: "\\.*\\.e2e-spec\\.ts$",
  setupFilesAfterEnv: ["../../../jest.setup.js"],
  maxWorkers: 1
};
