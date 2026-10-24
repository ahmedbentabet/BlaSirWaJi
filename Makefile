SHELL := /bin/bash
.PHONY: help setup check-uv check-env install run run-backend run-frontend dev build clean reqs

# Colors for terminal output
CYAN   := \033[36m
GREEN  := \033[32m
YELLOW := \033[33m
RESET  := \033[0m

help:
	@echo -e "${CYAN}================================================================${RESET}"
	@echo -e "${GREEN}🏛️  BlaSirWaJi - Developer & Automation Commands${RESET}"
	@echo -e "${CYAN}================================================================${RESET}"
	@echo -e "  ${YELLOW}make setup${RESET}        Complete automated project setup (uv + python + npm)"
	@echo -e "  ${YELLOW}make dev${RESET}          Run both Backend (8000) and Frontend (5173)"
	@echo -e "  ${YELLOW}make run${RESET}          Run the FastAPI Backend server with hot reload"
	@echo -e "  ${YELLOW}make run-frontend${RESET} Run the Vite Frontend dev server"
	@echo -e "  ${YELLOW}make build${RESET}        Build frontend production bundle & sync uv"
	@echo -e "  ${YELLOW}make clean${RESET}        Remove cache directories, build artifacts, and venv"
	@echo -e "${CYAN}================================================================${RESET}"

# 1. Ensure `uv` is installed; if not found, automatically install it
check-uv:
	@if command -v uv >/dev/null 2>&1; then \
		echo -e "${GREEN}✓ uv is already installed ($$(uv --version))${RESET}"; \
	elif [ -f "$$HOME/.local/bin/uv" ]; then \
		export PATH="$$HOME/.local/bin:$$PATH"; \
		echo -e "${GREEN}✓ Found uv in ~/.local/bin ($$($$HOME/.local/bin/uv --version))${RESET}"; \
	else \
		echo -e "${YELLOW}⚡ uv not found. Installing uv automatically via Astral installer...${RESET}"; \
		curl -LsSf https://astral.sh/uv/install.sh | sh; \
		export PATH="$$HOME/.local/bin:$$PATH"; \
		echo -e "${GREEN}✓ uv installed successfully ($$($$HOME/.local/bin/uv --version))${RESET}"; \
	fi

# 2. Ensure `.env` exists; if not, create it from `.env.example`
check-env:
	@if [ ! -f .env ]; then \
		echo -e "${YELLOW}⚡ .env not found. Copying from .env.example...${RESET}"; \
		cp .env.example .env; \
		echo -e "${GREEN}✓ Created .env file. Please add your GEMINI_API_KEY if needed.${RESET}"; \
	else \
		echo -e "${GREEN}✓ .env file exists.${RESET}"; \
	fi

# 3. One-command automated setup
setup: check-uv check-env
	@echo -e "${CYAN}==> Syncing Python dependencies with uv...${RESET}"
	@export PATH="$$HOME/.local/bin:$$PATH"; uv sync
	@echo -e "${CYAN}==> Installing Frontend npm dependencies...${RESET}"
	@if command -v npm >/dev/null 2>&1; then \
		cd frontend && npm install; \
		echo -e "${GREEN}✓ Frontend dependencies installed.${RESET}"; \
	else \
		echo -e "${YELLOW}⚠️ npm not detected. Please ensure Node.js is installed to run the frontend.${RESET}"; \
	fi
	@echo -e "${GREEN}================================================================${RESET}"
	@echo -e "${GREEN}🎉 BlaSirWaJi is ready! Run 'make dev' to start the application.${RESET}"
	@echo -e "${GREEN}================================================================${RESET}"

# Alias for setup
install: setup

# 4. Run Backend with hot-reloading using `uv run`
run-backend: check-uv check-env
	@export PATH="$$HOME/.local/bin:$$PATH"; \
	echo -e "${GREEN}🚀 Starting FastAPI backend on http://localhost:8000...${RESET}"; \
	uv run blasirwaji

run: run-backend

# 5. Run Frontend development server
run-frontend:
	@echo -e "${GREEN}⚛️  Starting Vite frontend on http://localhost:5173...${RESET}"
	@cd frontend && npm run dev -- --host 0.0.0.0 --port 5173

# 6. Run both servers concurrently
dev: check-uv check-env
	@export PATH="$$HOME/.local/bin:$$PATH"; \
	echo -e "${GREEN}🚀 Launching BlaSirWaJi Backend & Frontend...${RESET}"; \
	trap 'kill 0' SIGINT SIGTERM EXIT; \
	uv run blasirwaji & \
	(cd frontend && npm run dev -- --host 0.0.0.0 --port 5173) & \
	wait

# 7. Production build
build: check-uv
	@export PATH="$$HOME/.local/bin:$$PATH"; uv sync
	@cd frontend && npm run build
	@echo -e "${GREEN}✓ Production build complete in frontend/dist/${RESET}"

# 8. Export standard requirements.txt if needed
reqs: check-uv
	@export PATH="$$HOME/.local/bin:$$PATH"; uv export --format requirements-txt > requirements.txt
	@echo -e "${GREEN}✓ Generated requirements.txt${RESET}"

# 9. Clean artifacts
clean:
	@echo -e "${YELLOW}Cleaning cache and build artifacts...${RESET}"
	@find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	@find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	@rm -rf .venv frontend/dist frontend/.vite
	@echo -e "${GREEN}✓ Cleaned!${RESET}"