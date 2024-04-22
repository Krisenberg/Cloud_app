output "public_address" {
  # value = aws_elastic_beanstalk_environment.l3-ttt-env.cname
  value = "http://${aws_elastic_beanstalk_environment.l3-ttt-env.cname}"
}