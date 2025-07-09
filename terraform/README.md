# Terraform in Azure

## [Authenticate Terraform to Azure](https://learn.microsoft.com/en-us/azure/developer/terraform/authenticate-to-azure?tabs=bash)

First of all, you need an Azure subscription.

Terraform only supports authenticating to Azure with the Azure CLI. Authenticating using Azure Powershell isn't supported.


## Create an Azure Resource Group

1.- Create a file named providers.tf, and insert the code that is shown [here](https://learn.microsoft.com/en-us/azure/developer/terraform/create-resource-group?tabs=azure-cli#implement-the-terraform-code).

2.- Create a file called main.tf, where you will create a ***resource group***.

A **resource group** is a container that logically organizes related resources for an Azure solution. These resources can be anything from VM and storage accounts, to databases and web apps. 

Essentially, it's a way to group resources that are related to a specific application or project, making them easier to manage, deploy, update, and delete as a single unit.

Basically, its the same as a project in Google Cloud.