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
