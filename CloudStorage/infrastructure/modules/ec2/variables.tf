variable "vpc_id" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "port_database" {
  type = number
}

variable "port_backend" {
  type = number
}

variable "port_frontend" {
  type = number
}

variable "ssh_key" {
  type = string
}

variable "mssql_sa_password" {
    type = string
}

# locals {
#   env_vars = {
#     REACT_APP_COGNITO_REGION              = var.cognito_region
#     REACT_APP_COGNITO_USER_POOL_CLIENT_ID = var.cognito_user_pool_client_id
#     REACT_APP_COGNITO_USER_POOL_ID        = var.cognito_user_pool_id
#   }
# }