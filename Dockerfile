FROM cypress/included:cypress-13.13.2-node-20.16.0-chrome-127.0.6533.88-1-ff-128.0.3-edge-127.0.2651.74-1
RUN apt update
RUN apt install -y cron vim
COPY crontab /var/spool/cron/crontabs/root
RUN chmod 600 /var/spool/cron/crontabs/root
RUN chown root:crontab /var/spool/cron/crontabs/root
# copy whole src folder to /
COPY src /src
# set working directory
WORKDIR /src
# install dependencies
RUN npm install
ENTRYPOINT service cron restart && sleep infinity