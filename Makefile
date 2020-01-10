APP_NAME = lawtigers

fetch:
	# image pull

build:
	docker build -t ${APP_NAME} .

push:
	# docker push image

deploy:
	# deploy image

clean:
	rm -rf node_modules
	docker rmi ${APP_NAME}

clean-local-deploy: clean fetch build
