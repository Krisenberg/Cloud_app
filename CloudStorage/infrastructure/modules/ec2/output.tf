output "public_address" {
  value = aws_instance.s3_storage.public_ip
}