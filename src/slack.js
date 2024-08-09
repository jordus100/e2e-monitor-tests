import { WebClient } from '@slack/web-api';

const options = {};
const web = new WebClient(process.env.SLACK_TOKEN, options);

export const sendSlackMessage = async (message, channel) => {
    return await web.chat.postMessage({
        channel: channel,
        text: message,
    })
}