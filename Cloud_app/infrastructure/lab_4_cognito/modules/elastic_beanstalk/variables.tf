variable "cname_prefix" {
  type = string
}

variable "method" {
    type = string
}

variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "port_frontend" {
  type = number
}

variable "port_backend" {
  type = number
}

variable "cognito_region" {
  type = string
}

variable "cognito_user_pool_client_id" {
  type = string
}

variable "cognito_user_pool_id" {
  type = string
}

# locals {
#   env_vars = {
#     REACT_APP_COGNITO_REGION              = var.cognito_region
#     REACT_APP_COGNITO_USER_POOL_CLIENT_ID = var.cognito_user_pool_client_id
#     REACT_APP_COGNITO_USER_POOL_ID        = var.cognito_user_pool_id
#   }
# }