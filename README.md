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


## Requirements to run this repo

### 1. NodeJS

To install NodeJS for Windows using Chocolately with npm, please, follow the instructions [here](https://nodejs.org/en/download) ((There are also instructions to install chocolately - Is a free and open-source package manager for Windows)


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

Having these 4 requirements, you will be ready to test the Azure Function locally.

## How to Start Azure Functions locally

Open a terminal in the root of this repository and write the command:

    make start-azure-function

Then, you can test the azure function writing the command:

    make trigger-azure-function
