output "public_address" {
  value = "http://${module.ec2.public_address}:${var.port_frontend}"
}

output "app_domain" {
  value = module.ec2.public_address
}