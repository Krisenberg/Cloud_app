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