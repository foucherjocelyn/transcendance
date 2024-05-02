FROM	debian:buster

LABEL	maintainer="xuluu <xuluu@student.42.fr>"

# Install npm
RUN apt-get update -y && \
	apt-get install -y npm

# Create webSocket directory
RUN	mkdir ./webSocket && \
    mkdir ./webSocket/src

# Add src
COPY ./js ./webSocket/src/js

# Move to ./webSocket
WORKDIR	./webSocket

# Install websocket
RUN npm init -y && \
    npm install -y websocket

# Open port
EXPOSE	4242

# Start web socket
CMD	["node", "./src/js/webSocket/webSocket.js"]
