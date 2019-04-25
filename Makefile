#!/usr/bin/make

include .env

docker_bin := $(shell command -v docker 2> /dev/null)
docker_compose_bin := $(shell command -v docker-compose 2> /dev/null)

up:
	$(docker_compose_bin) up --no-recreate -d

start_up:
	$(docker_compose_bin) up --build -d

clear_up:
	- rm -rf app/node_modules
	- rm -rf app/public/storage
	$(docker_compose_bin) up --build -d

restart:
	$(docker_compose_bin) restart

migrate: up
	$(docker_compose_bin) exec app yarn migrate

seed:
	$(docker_compose_bin) exec app yarn seed

pull_app: up
	cd app && git pull
	$(docker_compose_bin) restart app