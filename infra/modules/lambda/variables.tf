variable "function_name" {
  type = string
}

variable "role_arn" {
  type = string
}

variable "handler" {
  type    = string
  default = "lambda_handler.handler"
}

variable "zip_path" {
  type = string
}

variable "timeout" {
  type    = number
  default = 20
}

variable "memory_size" {
  type    = number
  default = 512
}

variable "environment_variables" {
  type = map(string)
}

variable "tags" {
  type    = map(string)
  default = {}
}
