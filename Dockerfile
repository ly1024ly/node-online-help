FROM keymetrics/pm2:latest-alpine

RUN npm i body-parser config-lite connect-mongo cookie-parser cors \
	debug ejs express express-session mongolass morgan mqtt \
	request static-favicon multer md5 --save


COPY .  .


# Install app dependencies
#RUN npm i --save



CMD [ "pm2-runtime", "start", "pm2_process.json", "--env", "production" ]

