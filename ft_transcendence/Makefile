all:
	@docker compose -f ./docker-compose.yml up -d --build

down:
	@docker compose -f ./docker-compose.yml down

status:
	@docker logs websocket
	@docker logs webserver

network:
	@docker network inspect ft_transcendence_my_network

clean:
	@docker stop $$(docker ps -qa)
	@docker rm $$(docker ps -qa)
	@docker rmi -f $$(docker images -qa)
	@docker network rm $$(docker network ls --filter type=custom -q)

re: clean all

.PHONY: all re down clean status network
