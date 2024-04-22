variable "cname_prefix" {
  description = "Please provide the cname_prefix. Default = glowacz-ttt"
  type        = string
  default     = "glowacz-ttt"
}

variable "method" {
  description = "Specify protocol. Default = http"
  type        = string
  default     = "http"
}

variable "port_frontend" {
  description = "Please provide the frontend's port"
  type        = number
  default     = 3000
}

variable "port_backend" {
  description = "Please provide the backend's port"
  type        = number
  default     = 8080
}