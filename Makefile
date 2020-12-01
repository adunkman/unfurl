.DEFAULT_GOAL := help

# Run docker-compose including one-off tasks as well as containers used to run
# locally. Should generally be used to avoid potentially confusing notices about
# pruning the task containers.
DOCKER_COMPOSE_ALL = docker-compose -f docker-compose.yml -f docker-compose.tasks.yml

BOOTSTRAP_LIST := npm-install docker-build
.PHONY: bootstrap
bootstrap: | $(BOOTSTRAP_LIST) ## Runs tasks needed to setup a development environment (🥾)
	@echo "\n\033[92m🎉 You’re all set! To start the application, run:\033[0m\n\n\tmake start"

.PHONY: start
start: ## Runs the full application stack locally
	@docker-compose up

.PHONY: test
test: ## Run automated tests
	@$(DOCKER_COMPOSE_ALL) run api run test

.PHONY: test-watch
test-watch: ## Run automated tests in watch mode
	@$(DOCKER_COMPOSE_ALL) run api run test -- --watchAll

.PHONY: lint
lint: ## Check files for adherence style rules
	@./node_modules/.bin/prettier --check .

.PHONY: lint-fix
lint-fix: ## Automatically fix any style rule violations
	@./node_modules/.bin/prettier --write .

.PHONY: build
build: ## Generate compiled application files to prepare for a deployment
	@$(DOCKER_COMPOSE_ALL) run api run build

.PHONY: npm-install
npm-install: ## 🥾 Installs development npm packages
	@npm install

.PHONY: docker-build
docker-build: ## 🥾 Builds docker images used to run the application locally
	@$(DOCKER_COMPOSE_ALL) build

.PHONY: db-create
db-create: ## 🥾 Creates the test database for running locally
	@docker-compose up -d dynamodb
	@$(DOCKER_COMPOSE_ALL) run -w /terraform/db terraform init
	@$(DOCKER_COMPOSE_ALL) run -w /terraform/db terraform apply
	@docker-compose stop dynamodb

.PHONY: terraform-lint
terraform-lint: ## Check terraform for adherence style rules
	@$(DOCKER_COMPOSE_ALL) run tflint

.PHONY: terraform-scan
terraform-scan: ## Check terraform for common security issues
	@$(DOCKER_COMPOSE_ALL) run tfsec

.PHONY: terraform-init
terraform-init: ## 🔒 Runs terraform init
	@$(DOCKER_COMPOSE_ALL) run terraform init

.PHONY: terraform-plan
terraform-plan: ## 🔒 Runs terraform plan
	@$(DOCKER_COMPOSE_ALL) run terraform plan

.PHONY: terraform-apply
terraform-apply: ## 🔒 Runs terraform apply
	@$(DOCKER_COMPOSE_ALL) run terraform apply

.PHONY: secrets-edit
secrets-edit: ## 🔒 Edits secrets passed to Terraform
	@$(DOCKER_COMPOSE_ALL) run --entrypoint sops terraform variables.enc.yml

.PHONY: help
help:
	@echo "Usage: make [task]\n\nAvailable tasks:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo "\n\033[33m(🔒) These tasks require AWS credentials configured via environment variables.\033[0m"
	@echo "\033[33m(🥾) These tasks are included in the bootstrap task.\033[0m"
