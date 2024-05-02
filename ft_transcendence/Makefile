all: up

up:
	docker compose up -d --build

down:
	docker compose down

start:
	docker compose start

stop:
	docker compose stop

restart:
	docker compose restart

logs:
	docker compose logs -f

back_logs:
	docker compose logs -f backend

db_logs:
	docker compose logs -f db

socket_logs:
	docker compose logs -f websocket

web_logs:
	docker compose logs -f webserver

status:
	docker compose ps

clean:
	docker compose down --rmi all --volumes --remove-orphans
	docker system prune -f -a --volumes

re : clean all

.PHONY: all up down start stop restart logs status clean
