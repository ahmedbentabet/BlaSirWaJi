.PHONY: init reqs install run debug clean

# 1. Bootstrap the project with pyproject.toml and dependencies
init:
	uv init
	uv add google-genai

# 2. Export pyproject.toml into a standard requirements.txt
reqs:
	uv export --format requirements-txt > requirements.txt
	@echo "=> requirements.txt generated successfully."

# 3. Sync the virtual environment with pyproject.toml
install:
	uv sync

# 4. Run the main application
run:
	uv run python -m src

# 5. Run the interactive debugger
debug:
	uv run python -m pdb -m src

# 6. Nuke all cached files, virtual environments, and generated requirements
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	rm -rf .venv
	rm -f requirements.txt