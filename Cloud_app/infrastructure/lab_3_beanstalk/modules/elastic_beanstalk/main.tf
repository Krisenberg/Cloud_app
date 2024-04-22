# Create a local .env file dynamically - doesn't work
# resource "local_file" "env_file" {
#   content = <<-EOT
#     TF_VAR_PORT_BACKEND=${var.port_backend}
#     TF_VAR_PORT_FRONTEND=${var.port_frontend}
#     TF_VAR_CNAME_PREFIX=${var.cname_prefix}
#   EOT

#   filename = "${path.module}/.env"
# }

resource "aws_s3_bucket" "l3-ttt-s3-bucket" {
  bucket = "l3-ttt-s3-bucket"
  tags   = {
    Name = "l3-ttt-s3-bucket"
  }
}

resource "aws_s3_object" "l3-ttt-s3-object" {
  bucket = aws_s3_bucket.l3-ttt-s3-bucket.bucket
  source = "${path.module}/docker-compose.yml"
  key    = "docker-compose.yml"
}

resource "aws_elastic_beanstalk_application" "l3-ttt-app" {
  name        = "lab-3-tic-tac-toe-app"
  description = "Tic tac toe game running in the cloud infrastructure (using AWS Elastic Beanstalk)"
}

resource "aws_iam_instance_profile" "instance-profile" {
  name = "instance-profile" # Instance profile name
  role = "LabRole" # Existing IAM role to associate with the instance profile
}

resource "aws_elastic_beanstalk_application_version" "l3-ttt-app-version" {
  name        = "v1"
  application = aws_elastic_beanstalk_application.l3-ttt-app.name
  description = "Tic tac toe game running in the cloud infrastructure (using AWS Elastic Beanstalk)"
  bucket      = aws_s3_bucket.l3-ttt-s3-bucket.bucket
  key         = aws_s3_object.l3-ttt-s3-object.key
}

resource "aws_elastic_beanstalk_environment" "l3-ttt-env" {
  name                = "lab-3-tic-tac-toe-environment"
  application         = aws_elastic_beanstalk_application.l3-ttt-app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.0 running Docker"
  # tier value is not needed since default one (e.g. "WebServer") is fine
  version_label       = aws_elastic_beanstalk_application_version.l3-ttt-app-version.name
  cname_prefix        = var.cname_prefix

  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance" # Environment type, could be LoadBalanced or SingleInstance
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.instance-profile.name
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = var.subnet_id
  }

  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = var.security_group_id
  }
}