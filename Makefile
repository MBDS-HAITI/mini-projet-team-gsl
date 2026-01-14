.PHONY: help build up down logs restart clean deploy-aws test

help: ## Afficher l'aide
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# ===========================
# DÉVELOPPEMENT LOCAL
# ===========================

build: ## Construire les images Docker
	docker-compose build

up: ## Démarrer les conteneurs
	docker-compose up -d

down: ## Arrêter les conteneurs
	docker-compose down

logs: ## Voir les logs
	docker-compose logs -f

restart: ## Redémarrer les conteneurs
	docker-compose restart

clean: ## Nettoyer tout (conteneurs, volumes, images)
	docker-compose down -v
	docker system prune -af

# ===========================
# PRODUCTION
# ===========================

build-prod: ## Construire les images de production
	docker-compose -f docker-compose.prod.yml build

up-prod: ## Démarrer en production
	docker-compose -f docker-compose.prod.yml up -d

down-prod: ## Arrêter la production
	docker-compose -f docker-compose.prod.yml down

# ===========================
# AWS
# ===========================

setup-aws: ## Configurer l'infrastructure AWS
	./aws/setup-aws.sh

deploy-aws: ## Déployer sur AWS (via GitHub Actions)
	@echo "Push your code to trigger GitHub Actions deployment"
	git push origin main

# ===========================
# TESTS
# ===========================

test-backend: ## Tester le backend
	cd backend && npm test

test-frontend: ## Tester le frontend
	cd frontend && npm test

test: test-backend test-frontend ## Tester tout