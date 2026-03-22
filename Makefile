# Convert to Unix format if needed: dos2unix Makefile
SHELL := bash
.SHELLFLAGS := -eu -o pipefail -c
.ONESHELL:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules


ENV ?= local


.PHONY: help
help: ## View help information
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: bootstrap
bootstrap: ## Bootstrap project
	@bash bootstrap.sh

.PHONY: env
env: ## Generate .env file with ENV=local|test|staging|prod
	cp -f env/.env.$(ENV) .env
