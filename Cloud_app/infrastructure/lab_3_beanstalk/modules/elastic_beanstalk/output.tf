output "public_dns" {
  value = aws_elastic_beanstalk_environment.l3-ttt-env.cname
}