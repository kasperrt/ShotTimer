IMAGE_NAME ?= shottimer
CONTAINER_NAME ?= shottimer
ENV_FILE ?= .env
-include $(ENV_FILE)

PORT ?= 8080
VITE_HOST ?= http://localhost:8080
VITE_CORS ?= http://localhost:3000

.PHONY: docker-up docker-stop

docker-up:
	docker build \
		--build-arg VITE_HOST=$(VITE_HOST) \
		--build-arg VITE_CORS=$(VITE_CORS) \
		-t $(IMAGE_NAME) .
	@docker rm -f $(CONTAINER_NAME) >/dev/null 2>&1 || true
	docker run -d \
		--name $(CONTAINER_NAME) \
		--env-file $(ENV_FILE) \
		-p $(PORT):$(PORT) \
		$(IMAGE_NAME)

docker-stop:
	@docker stop $(CONTAINER_NAME) >/dev/null 2>&1 || true
	@docker rm -f $(CONTAINER_NAME) >/dev/null 2>&1 || true
