.PHONY: help db-up db-down migrate seed api score frontend test ci lint

DB_URL ?= postgres://layak:layak@localhost:5432/layak?sslmode=disable

help:
	@echo "LAYAK — local dev commands"
	@echo ""
	@echo "  make db-up       Start Postgres via Docker Compose"
	@echo "  make db-down     Stop and remove Postgres container"
	@echo "  make migrate     Run all SQL migrations against DB_URL"
	@echo "  make seed        Ingest seed data (requires seed/workers.json + seed/transactions.json)"
	@echo "  make api         Run Go API (port 8080)"
	@echo "  make score       Run FastAPI score service (port 8001)"
	@echo "  make frontend    Run Vite dev server (port 5173)"
	@echo "  make test        Run all tests (Go + Python)"
	@echo "  make ci          Full CI check (lint + build + test)"
	@echo "  make lint        Lint Go + Python"
	@echo ""
	@echo "  make up          docker-compose up --build (all services)"
	@echo "  make down        docker-compose down"

# ── Docker ───────────────────────────────────────────────────────────────────

db-up:
	docker compose up -d db
	@echo "Waiting for Postgres to be ready..."
	@until docker compose exec db pg_isready -U layak -d layak > /dev/null 2>&1; do sleep 1; done
	@echo "Postgres is ready."

db-down:
	docker compose stop db
	docker compose rm -f db

up:
	docker compose up --build

down:
	docker compose down

# ── Migrations ───────────────────────────────────────────────────────────────

migrate:
	@echo "Running migrations against $(DB_URL)..."
	@for f in migrations/*.sql; do \
		echo "  Applying $$f..."; \
		psql "$(DB_URL)" -f "$$f"; \
	done
	@echo "Migrations done."

migrate-docker:
	@echo "Running migrations inside db container..."
	@for f in migrations/*.sql; do \
		echo "  Applying $$f..."; \
		docker compose exec -T db psql -U layak -d layak < "$$f"; \
	done
	@echo "Migrations done."

# ── Seed ─────────────────────────────────────────────────────────────────────

seed:
	@echo "Ingesting seed data..."
	cd backend/api && go run ./cmd/seed/main.go

# ── Local dev ────────────────────────────────────────────────────────────────

api:
	cd backend/api && go run ./main.go

score:
	cd backend/score && uvicorn main:app --reload --port 8001

frontend:
	cd frontend && npm run dev

# ── Tests ─────────────────────────────────────────────────────────────────────

test: test-go test-python

test-go:
	cd backend/api && go test ./...

test-python:
	cd backend/score && python -m pytest test_score.py -v

# ── CI ────────────────────────────────────────────────────────────────────────

lint:
	cd backend/api && go vet ./...
	cd backend/score && python -m flake8 . --max-line-length=100 --exclude=.venv,venv
	cd frontend && npm run lint

ci: lint
	cd backend/api && go build ./...
	cd backend/score && python -m pytest test_score.py -v
	cd frontend && npm run build
	@echo "CI passed."
