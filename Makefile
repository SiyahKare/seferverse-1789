SHELL := /bin/bash

.PHONY: up up-deploy down logs backend-logs frontend-logs hh-logs deploy-local

up:
	cd infra && docker compose up -d

up-deploy:
	cd infra && docker compose --profile deploy up -d

down:
	cd infra && docker compose down -v

logs:
	cd infra && docker compose logs -f --tail=200

backend-logs:
	cd infra && docker compose logs -f --tail=200 backend

frontend-logs:
	cd infra && docker compose logs -f --tail=200 frontend

hh-logs:
	cd infra && docker compose logs -f --tail=200 hardhat-node

deploy-local:
	cd seferverse-blockchain && npx hardhat run scripts/deployAndVerify.js --network localhost


