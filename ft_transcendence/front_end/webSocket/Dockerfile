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
COPY ./ssl ./src/ssl

# Install websocket
RUN npm init -y && \
	npm install -y ws axios

# Install oauth2-wrapper
RUN npm install --save simple-oauth2

# Open port
EXPOSE	5555

# Start web socket
CMD	["node", "./src/js/webSocket/webSocket.js"]
