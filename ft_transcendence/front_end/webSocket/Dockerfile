FROM	node:bookworm

LABEL	maintainer="xuluu <xuluu@student.42.fr>"

# Install npm
RUN apt-get update -y && apt-get upgrade -y && \
	apt-get install -y openssl

# Create webSocket directory
RUN	mkdir ./webSocket && \
	mkdir ./webSocket/src

# Move to ./webSocket
WORKDIR	./webSocket

# Add src
COPY ./js ./src/js

# Install websocket
RUN npm init -y && \
	npm install -y ws axios

# Install oauth2-wrapper
RUN npm install --save simple-oauth2

# Make certificate SSL
RUN mkdir ./ssl && \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/private.key -out ./ssl/certificate.crt -subj "/CN=localhost" && \
	mv ./ssl ./src

# Open port
EXPOSE	5555

# Start web socket
CMD	["node", "./src/js/webSocket/webSocket.js"]
