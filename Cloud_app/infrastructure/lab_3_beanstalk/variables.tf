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