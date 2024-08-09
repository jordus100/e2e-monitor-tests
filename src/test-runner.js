import cypress from 'cypress';
import { sendSlackMessage } from './slack.js';

cypress.run({
  reporter: 'junit',
  browser: 'firefox',
}).then((results) => {
  if (results.totalPassed !== results.totalTests) {
    sendSlackMessage('Google login on smartdust.me test failed!', process.env.SLACK_CHANNEL_ID)
      .catch(e => console.error(e));
  } else {
    console.log('All tests passed');
  }
})