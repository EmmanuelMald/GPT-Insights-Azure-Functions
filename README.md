# AzureExamples
This repo is to tests how to deploy services in Microsoft Azure. 

For this project, we will call the OpenAI API using NodeJS and ***Azure Functions*** to execute the code in the cloud.

## What is an Azure Function?

Is a serverless service that executes code in response to events. The main advantage over containers is simplicity, due to you only take care of your code, and not the container infrastructure.

Some events that triggers the Azure function are:

- HTTP request
- New file in blob storage
- A scheduler

For this case, we will be using an HTTP request.

## Repository Structure

- *open-ai-function/* -> Contains the whole logic that the Azure Function will execute

- *terraform/* -> Contains all the code related to the necessary infrastructure in Microsoft Azure

## Requirements to run this repo

### 1. NodeJS

To install NodeJS for Windows using Chocolately with npm, please, follow the instructions [here](https://nodejs.org/en/download) (There are also instructions to install chocolately - Is a free and open-source package manager for Windows)


### 2. Azure Functions Core Tools

If you already have installed NodeJS, the easiest and fastest way to install them is through npm (similar to pip in Python):

        npm install -g azure-functions-core-tools@4

### 3. Make

Make is a build automation tool, it reads instructions from a file called Makefile to automatically compile source code. You can install it using chocolately:

        choco install make

### 4. Installing NodeJS dependencies

After installing make, you can open a terminal in the base of this repository, and write the command:

        make install-nodejs-dependencies

Or, you can execute:

        cd open-ai-function
        npm install

### 5. Generate a valid API KEY in OpenAI

If you have a free account, even if you generate an API KEY, you will need to add some credits to use the API. I recommend add 5 USD. Nevertheless, the calls to the API costs a lot less than that.

You can create the API KEY [here](https://platform.openai.com/account/api-keys).

After generating the API KEY, create a .env file in the open-ai-functions folder, and write the environment variable:

        OPENAI_API_KEY="your_api_key"

*.env files are not (and should not) commited in this repository.*

Having these 5 requirements, you will be ready to test the Azure Function locally.

## How to Start Azure Functions locally

Open a terminal in the root of this repository and write the command:

        make start-azure-function

Then, you can test the azure function writing the command:

        make trigger-azure-function

## Azure Function - Deployment 

To deploy the Azure Function, please check this [doc](/terraform/README.md)