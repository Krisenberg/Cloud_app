output "vpc_id" {
  value = aws_vpc.ttt_vpc.id
}
output "subnet_id" {
  value = aws_subnet.ttt_subnet.id
}
output "security_group_id" {
  value = aws_security_group.ttt_sec_group.id
}