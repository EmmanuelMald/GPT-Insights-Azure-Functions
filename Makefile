JSON_PAYLOAD = '{"data": [{"product": "Laptop", "sales": 150, "region": "North"}, \
				  {"product": "Keyboard", "sales": 300, "region": "North"}, \
				  {"product": "Mouse", "sales": 850, "region": "South"}]}'

# login to azure
az-login:
	az login

install-nodejs-dependencies:
	cd open-ai-function && \
	npm install

start-azure-function:
	cd open-ai-function && \
	func start

trigger-azure-function:

	curl -X POST -H "Content-Type: application/json" \
	-d ${JSON_PAYLOAD} \
	http://localhost:7071/api/HttpTrigger
