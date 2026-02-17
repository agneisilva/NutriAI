variable "role_name" {
  type = string
}

variable "dynamodb_table_arn" {
  type = string
}

variable "secret_arn" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}
