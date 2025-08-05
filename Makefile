STORAGE_ACCOUNT_NAME='eamadormstorageaccount'
STORAGE_CONTAINER_NAME='gpt-insight-container'

# login to azure
az-login:
	az login

install-nodejs-dependencies:
	cd gpt_insight_function && \
	npm install

start-azure-function:
	cd gpt_insight_function && \
	func start

trigger-local-azure-function:

	curl -X POST -H "Content-Type: application/json" \
	-d ${JSON_PAYLOAD} \
	http://localhost:7071/api/HttpTrigger

zip-azure-function:
	cd gpt_insight_function && \
	rm gpt-insight-function.zip || true && \
	zip -r gpt-insight-function.zip .

upload-azure-function:
	az storage blob upload \
		--account-name ${STORAGE_ACCOUNT_NAME} \
		--container-name ${STORAGE_CONTAINER_NAME} \
		--file gpt_insight_function/gpt-insight-function.zip \
		--auth-mode login \
		--overwrite
