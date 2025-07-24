variable "azure_subscription_id" {
  type        = string
  description = "Azure subscription ID where the resources will be created."
  default     = "712d1d9f-637c-4b8a-8a56-e6e65d6af82e"
}

variable "resources_location" {
  type        = string
  default     = "Mexico Central"
  description = "Location of the resources."
}

variable "main_resource_group_name" {
  type        = string
  description = "Name of the main resource group where resources will be created."
  default     = "rg-eamadorm"
}


variable "main_storage_account_name" {
  type        = string
  description = "Name of the main storage account."
  default     = "eamadormstorageaccount"
}

variable "main_filesystem_name" {
  type        = string
  description = "Name of the main filesystem in the storage account."
  default     = "eamadormfilesystem"
}

variable "storage_container_gpt_insight_name" {
  type        = string
  description = "Name of the storage container for the GPT Insight Azure Function App."
  default     = "gpt-insight-container"
}
