const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    experimentalModifyObstructiveThirdPartyCode: true,
    env: {
      GOOGLE_LOGIN: process.env.GOOGLE_LOGIN,
      GOOGLE_PASSWORD: process.env.GOOGLE_PASSWORD,
      WP_USERNAME: process.env.WP_USERNAME,
    }
  },
});
