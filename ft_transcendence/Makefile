all: up

#ssh:
#	openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ssl/private.key -out ssl/certificate.crt -subj "/C=FR/ST=Paris/L=Paris/O=42/CN=ft_transcendence"

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

websocket_logs:
	docker compose logs -f websocket

webserver_logs:
	docker compose logs -f webserver

nginxback_logs:
	docker compose logs -f nginx-back

status:
	docker compose ps

clean:
	docker compose down --rmi all --volumes --remove-orphans
	docker system prune -f -a --volumes

re : clean all

.PHONY: all up down start stop restart logs status clean
