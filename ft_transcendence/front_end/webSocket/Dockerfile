FROM	debian:buster

LABEL	maintainer="xuluu <xuluu@student.42.fr>"

# Install npm
RUN apt-get update -y && \
	apt-get install -y npm openssl

# Create webSocket directory
RUN	mkdir ./webSocket && \
    mkdir ./webSocket/src

# Move to ./webSocket
WORKDIR	./webSocket

# Add src
COPY ./js ./src/js
COPY ./conf ./ssl

# Install websocket
RUN npm init -y && \
    npm install -y ws

# Make certificate SSL
RUN	openssl genrsa -out ./ssl/private.key 2048 && \
	openssl req -new -key ./ssl/private.key -out ./ssl/certificate.csr -config ./ssl/csr_config.cnf && \
	openssl x509 -req -in ./ssl/certificate.csr -signkey ./ssl/private.key -out ./ssl/certificate.crt

RUN	mv ./ssl ./src

# Open port
EXPOSE	5555

# Start web socket
CMD	["node", "./src/js/webSocket/webSocket.js"]