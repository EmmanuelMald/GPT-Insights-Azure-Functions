STORAGE_ACCOUNT_NAME='eamadormstorageaccount'
STORAGE_CONTAINER_NAME='gpt-insight-container'
JSON_PAYLOAD='{"data": [{"product": "Laptop", "sales": 150, "region": "North"}, \
				  {"product": "Keyboard", "sales": 300, "region": "North"}, \
				  {"product": "Mouse", "sales": 850, "region": "South"}]}'

# login to azure
az-login:
	az login

install-nodejs-dependencies:
	cd gpt_insight_function && \
	npm install

start-azure-function:
	cd gpt_insight_function && \
	func start

trigger-azure-function:

	curl -X POST -H "Content-Type: application/json" \
	-d ${JSON_PAYLOAD} \
	http://localhost:7071/api/HttpTrigger

zip-azure-function:
	cd gpt_insight_function && \
	zip -r gpt-insight-function.zip .

upload-azure-function:
	az storage blob upload \
		--account-name ${STORAGE_ACCOUNT_NAME} \
		--container-name ${STORAGE_CONTAINER_NAME} \
		--file gpt_insight_function/gpt-insight-function.zip \
		--auth-mode login
