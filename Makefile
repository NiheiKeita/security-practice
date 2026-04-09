
up: 
	docker compose up -d
	
bash: 
	docker compose exec app bash
	
stop: 
	docker compose stop

ps: 
	docker compose ps