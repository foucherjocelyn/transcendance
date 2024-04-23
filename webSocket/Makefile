all: start

start:
	@clear && node ./src/js/webSocket/server.js &
	@clear && node ./src/js/webServer/webServer.js

install:
	@sudo apt install -y npm
	@sudo npm install -g parcel-bundler
	@sudo npm install websocket

clean:
	@sudo rm -rf node_modules package-lock.json package.json dist .cache

