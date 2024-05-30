output "vpc_id" {
  value = aws_vpc.s3_storage_vpc.id
}
output "subnet_id" {
  value = aws_subnet.s3_storage_subnet.id
}
output "security_group_id" {
  value = aws_security_group.s3_storage_sec_group.id
}