# Description
End-to-end tests using the Cypress framework to be run automatically in Docker as a monitoring tool.

# Tests
- Google social login on smartdust.me

# How to build and run the Docker image
- Clone the repository
- Enter the repository folder
- Create a .env file with the following content:
```
GOOGLE_LOGIN="google_email"
GOOGLE_PASSWORD="google_password"
WP_USERNAME="username_on_account_page"
SLACK_TOKEN="your_slack_token"
SLACK_CHANNEL_ID="your_slack_channel_id"
```
- Run the following command:
```
docker build -t e2e-tests .
```
- To run the tests, execute the following command:
```
docker run --restart=always -d e2e-tests
```
The container should keep running in the background and execute the tests according to the schedule in the `crontab` file.
Logs from the tests will be displayed in the Docker container logs.

# How to add more tests
You can add more tests in the `src/cypress/e2e`. For more details please refer to the [Cypress docs](https://docs.cypress.io/). 
