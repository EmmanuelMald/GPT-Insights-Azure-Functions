# Create a random name for the resource group using random_pet
# random_pet is a resource that generates a random name with a prefix
# This is useful for creating unique resource names in Azure
# resource "random_pet" "rg_name" {
#   prefix = var.resource_group_name_prefix
# }
 
# Create a resource group
resource "azurerm_resource_group" "main_resource_group" {
  location = var.resources_location
  name     = var.main_resource_group_name
}

resource "azurerm_storage_account" "main_storage_account" {
  name                     = var.main_storage_account_name
  resource_group_name      = azurerm_resource_group.main_resource_group.name
  location                 = azurerm_resource_group.main_resource_group.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
  is_hns_enabled           = "true"
}

resource "azurerm_storage_data_lake_gen2_filesystem" "main_filesystem" {
  name               = var.main_filesystem_name
  storage_account_id = azurerm_storage_account.main_storage_account.id

}

## Creation of a storage container for the Azure Function
resource "azurerm_storage_container" "gpt_insight_app_container" {
  name                  = var.storage_container_gpt_insight_name
  storage_account_id    = azurerm_storage_account.main_storage_account.id
  container_access_type = "blob"
}

## Azure Function App Configuration
resource "azurerm_service_plan" "gpt_insight_service_plan" {
  name                = var.gpt_insight_service_plan_name
  resource_group_name = azurerm_resource_group.main_resource_group.name
  location            = azurerm_resource_group.main_resource_group.location
  os_type             = "Windows"
  sku_name            = "Y1"
}


resource "azurerm_windows_function_app" "gpt_insight_function_app" {
  name                = var.azure_function_app_name
  resource_group_name = azurerm_resource_group.main_resource_group.name
  location            = azurerm_resource_group.main_resource_group.location

  storage_account_name       = azurerm_storage_account.main_storage_account.name
  storage_account_access_key = azurerm_storage_account.main_storage_account.primary_access_key
  service_plan_id            = azurerm_service_plan.gpt_insight_service_plan.id

  site_config {
    application_stack {
      node_version = "~22"
    }
  }

  app_settings = {
    "FUNCTIONS_WORKER_RUNTIME" = "node"
    "AzureWebJobsStorage"      = azurerm_storage_account.main_storage_account.primary_connection_string
    "WEBSITE_NODE_DEFAULT_VERSION" = "~22"
    "OPENAI_API_KEY" = var.OPENAI_API_KEY
    "WEBSITE_RUN_FROM_PACKAGE" = "https://${azurerm_storage_account.main_storage_account.name}.blob.core.windows.net/${azurerm_storage_container.gpt_insight_app_container.name}/gpt-insight-function.zip"
  }
}
