import cypress from 'cypress';
import { sendSlackMessage } from './slack.js';
import dns from 'node:dns';
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const logFilePath = path.join(__dirname, 'e2e-tests.log');

function isTodayAlreadyReported() {
  try {
    const lastReportedDate = fs.readFileSync(logFilePath, 'utf-8').split(" ")[0]
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    return lastReportedDate === today;
  } catch (error) {
    // If the file doesn't exist or an error occurs, assume it's not reported yet
    return false;
  }
}

function hasLastTestFailed() {
  try {
    const passInfo = fs.readFileSync(logFilePath, 'utf-8').split(" ")[1].trim()
    console.log(passInfo)
    return passInfo === 'failed'.trim();
  } catch (error) {
    console.error(error);
    // If the file doesn't exist or an error occurs, assume it's not reported yet
    return false;
  }
}

function logTestRun(passed) {
  const today = new Date().toISOString().slice(0, 10);
  const passInfo = passed ? 'passed' : 'failed';
  const logMessage = `${today} ${passInfo}`;
  fs.writeFileSync(logFilePath, logMessage, 'utf-8');
}

dns.resolve('www.google.com', function (err) {
  if (err) {
    console.log("No internet connection, will not run tests");
  } else {
    cypress.run({
      reporter: 'junit',
      browser: 'electron',
    }).then(async (results) => {
      if (results.totalPassed !== results.totalTests) {
        await sendSlackMessage('Google login on smartdust.me test failed!', process.env.SLACK_CHANNEL_ID)
          .catch(e => console.error(e));
        logTestRun(false);
      } else {
        console.log('All tests passed');
        if (!isTodayAlreadyReported() || hasLastTestFailed()) {
          await sendSlackMessage('Wordpress E2E tests passed', process.env.SLACK_CHANNEL_ID);
        } else {
          console.log('Slack message already sent today.');
        }
        logTestRun(true);
      }
    })
  }
})
