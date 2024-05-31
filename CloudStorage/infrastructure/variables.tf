variable "port_database" {
  description = "Please provide the database's port"
  type        = number
  default     = 1433
}

variable "port_backend" {
  description = "Please provide the backend's port"
  type        = number
  default     = 8080
}

variable "port_frontend" {
  description = "Please provide the frontend's port"
  type        = number
  default     = 3000
}

variable "credentials_profile" {
  description = "Please provide the credentials profile's name. Default = default"
  type        = string
  default     = "krzysztof.glowacz"
}

variable "ssh_key" {
  description = "Key used for SSH connections with EC2 instances"
  type        = string
  default     = "s3-storage-key"
}

variable "mssql_sa_password" {
  description = "Password used when logging to the MS SQL database"
  type        = string
  default     = "A&VeryComplex123Password"
}

variable "s3_bucket_name" {
  description = "Name of the AWS S3 bucket"
  type        = string
  default     = "cloud-storage-bucket"
}