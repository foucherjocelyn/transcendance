FROM    node:bookworm

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

# Install THREE + AXIOS
RUN	npm init -y && \
	npm install -y three axios

# Make certificate SSL
RUN mkdir ./ssl && \
	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./ssl/private.key -out ./ssl/certificate.crt -subj "/CN=localhost" && \
	mv ./ssl ./webServer

# Update OrbitControls.js
RUN	cp -rf ./web/js/game/OrbitControls.js ./node_modules/three/examples/jsm/controls/

# Open port
EXPOSE	5500

# Start web server
CMD	["node", "./webServer/js/webServer.js"]

