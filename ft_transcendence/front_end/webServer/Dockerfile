FROM	debian:buster

LABEL	maintainer="xuluu <xuluu@student.42.fr>"

# Install npm, openssl
RUN	apt-get update -y && \
	apt-get install -y npm openssl

# Create webServer directory
RUN	mkdir ./webServer

# Move to ./webServer
WORKDIR	./webServer

# Add the files configuration
COPY	./web ./web
COPY	./webServer ./webServer
COPY	./conf ./ssl

# Install THREE
RUN	npm init -y && \
	npm install -y three

# Make certificate SSL
RUN	openssl genrsa -out ./ssl/private.key 2048 && \
	openssl req -new -key ./ssl/private.key -out ./ssl/certificate.csr -config ./ssl/csr_config.cnf && \
	openssl x509 -req -in ./ssl/certificate.csr -signkey ./ssl/private.key -out ./ssl/certificate.crt

RUN	mv ./ssl ./webServer

# Update OrbitControls.js
RUN	cp -rf ./web/js/game/OrbitControls.js ./node_modules/three/examples/jsm/controls/

# Open port
EXPOSE	5500

# Start web server
CMD	["node", "./webServer/js/webServer.js"]
