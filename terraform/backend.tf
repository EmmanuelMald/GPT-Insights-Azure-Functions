terraform {
  backend "azurerm" {
    resource_group_name  = "eamadormresourcegroup"
    storage_account_name  = "eamadormstorageacc"
    container_name        = "eamadormcontainertfstate"
    key                   = "terraform.tfstate"
  }
}