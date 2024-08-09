const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    env: {
      GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
    }
  },
});
