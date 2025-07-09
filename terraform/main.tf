# Create a random name for the resource group using random_pet
# random_pet is a resource that generates a random name with a prefix
# This is useful for creating unique resource names in Azure
resource "random_pet" "rg_name" {
  prefix = var.resource_group_name_prefix
}

# Create a resource group using the generated random name
resource "azurerm_resource_group" "example" {
  location = var.resource_group_location
  name     = random_pet.rg_name.id
}