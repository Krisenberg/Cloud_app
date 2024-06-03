variable "port_database" {
  type = number
}

variable "mssql_sa_password" {
    type = string
}

variable "port_backend" {
  type = number
}

variable "port_frontend" {
  type = number
}

variable "aws_access_key_id" {
  type = string
}

variable "aws_secret_access_key" {
  type = string
}

variable "aws_session_token" {
  type = string
}

variable "s3_bucket" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "ssh_key" {
  type = string
}