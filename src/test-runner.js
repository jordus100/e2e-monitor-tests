import cypress from 'cypress';
import { sendSlackMessage } from './slack.js';
import dns from 'node:dns';
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
const dateFilePath = path.join(__dirname, 'lastReportedDate.txt');

function isTodayAlreadyReported() {
  try {
    const lastReportedDate = fs.readFileSync(dateFilePath, 'utf-8');
    const today = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format
    return lastReportedDate === today;
  } catch (error) {
    // If the file doesn't exist or an error occurs, assume it's not reported yet
    return false;
  }
}

function markTodayAsReported() {
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(dateFilePath, today, 'utf-8');
}

dns.resolve('www.google.com', function (err) {
  if (err) {
    console.log("No internet connection, will not run tests");
  } else {
    cypress.run({
      reporter: 'junit',
      browser: 'firefox',
    }).then(async (results) => {
      if (results.totalPassed !== results.totalTests) {
        await sendSlackMessage('Google login on smartdust.me test failed!', process.env.SLACK_CHANNEL_ID)
          .catch(e => console.error(e));
        if (!isTodayAlreadyReported()) {
          markTodayAsReported();
        }
      } else {
        console.log('All tests passed');
        if (!isTodayAlreadyReported()) {
          await sendSlackMessage('Wordpress E2E tests passed', process.env.SLACK_CHANNEL_ID);
          markTodayAsReported();
        } else {
          console.log('Slack message already sent today.');
        }
      }
    })
  }
})
