output "public_address" {
  value = "http://${module.ec2.public_address}"
}