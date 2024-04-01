all: start

start:
	@clear && node ./src/js/server.js &
	@clear && parcel ./src/index.html

install:
	@sudo apt install -y npm
	@sudo npm install -g parcel-bundler
	@sudo npm install websocket

clean:
	@sudo rm -rf node_modules package-lock.json package.json dist .cache

