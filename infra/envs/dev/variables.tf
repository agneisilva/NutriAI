variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_prefix" {
  type    = string
  default = "nutriai"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "auth_enabled" {
  type    = bool
  default = false
}

variable "gemini_model" {
  type    = string
  default = "gemini-2.5-flash-lite"
}

variable "gemini_api_key" {
  type      = string
  sensitive = true
}
