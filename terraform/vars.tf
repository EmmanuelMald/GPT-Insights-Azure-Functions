variable "resource_group_location" {
  type        = string
  default     = "eastus"
  description = "Location of the resource group."
}

variable "resource_group_name_prefix" {
  type        = string
  default     = "rg"
  description = "Prefix of the resource group name that's combined with a random ID so name is unique in your Azure subscription."
}

variable "azure_subscription_id" {
  type        = string
  description = "Azure subscription ID where the resources will be created."
  default     = "712d1d9f-637c-4b8a-8a56-e6e65d6af82e"
}