# Create a local .env file dynamically - doesn't work
# resource "local_file" "env_file" {
#   content = <<-EOT
#     TF_VAR_PORT_BACKEND=${var.port_backend}
#     TF_VAR_PORT_FRONTEND=${var.port_frontend}
#     TF_VAR_CNAME_PREFIX=${var.cname_prefix}
#   EOT

#   filename = "${path.module}/compose/docker.env"
# }

# Create a .zip archive with docker-compose and file with env variables - also doesn't work
# data "archive_file" "compose-env-archive" {
#   type        = "zip"
#   output_path = "${path.module}/compose.zip"
#   source_dir  = "${path.module}/compose/"
#   depends_on = [resource.local_file.env_file]
# }

# data "template_file" "docker_compose" {
#   template = file("${path.module}/docker-compose.tpl")

#   vars = {
#     REACT_APP_COGNITO_REGION              = var.cognito_region
#     REACT_APP_COGNITO_USER_POOL_CLIENT_ID = var.cognito_user_pool_client_id
#     REACT_APP_COGNITO_USER_POOL_ID        = var.cognito_user_pool_id
#   }
# }

resource "local_file" "deployment_compose" {
  content = templatefile("${path.module}/docker-compose-template.yml",
    {
      region=var.cognito_region
      user_pool_client_id=var.cognito_user_pool_client_id
      user_pool_id=var.cognito_user_pool_id
    }
  )
  filename = "${path.module}/docker-compose.yml"
}

# Create AWS S3 bucket which will be used for storing docker-compose.yml file
resource "aws_s3_bucket" "l3-ttt-s3-bucket" {
  bucket = "l3-ttt-s3-bucket"
  tags   = {
    Name = "l3-ttt-s3-bucket"
  }
}

# Create an object inside the S3 bucket - app's docker-compose file
resource "aws_s3_object" "l3-ttt-s3-object" {
  bucket = aws_s3_bucket.l3-ttt-s3-bucket.bucket
  # source = data.archive_file.compose-env-archive.output_path
  # key    = "compose.zip"
  # depends_on = [data.archive_file.compose-env-archive]
  source = "${path.module}/docker-compose.yml"
  # source = "${path.module}/docker-compose.yml"
  key    = "docker-compose.yml"
  depends_on = [local_file.deployment_compose]
}

# Create AWS Elastic Beanstalk application
resource "aws_elastic_beanstalk_application" "l3-ttt-app" {
  name        = "lab-3-tic-tac-toe-app"
  description = "Tic tac toe game running in the cloud infrastructure (using AWS Elastic Beanstalk)"
}

# Create AWS IAM Profile for the instance to get permissions
resource "aws_iam_instance_profile" "instance-profile" {
  name = "instance-profile"
  role = "LabRole"
}

# Create Elastic Beanstalk app'a version passing the reference to the S3 bucket with docker-compose.yml file
resource "aws_elastic_beanstalk_application_version" "l3-ttt-app-version" {
  name        = "v1"
  application = aws_elastic_beanstalk_application.l3-ttt-app.name
  description = "Tic tac toe game running in the cloud infrastructure (using AWS Elastic Beanstalk)"
  bucket      = aws_s3_bucket.l3-ttt-s3-bucket.bucket
  key         = aws_s3_object.l3-ttt-s3-object.key
}

# Create Elastic Beanstalk app'a environment with solution stack name tailored for Docker,
# attach the version defined above and cname_prefix from terraform variables
resource "aws_elastic_beanstalk_environment" "l3-ttt-env" {
  name                = "lab-3-tic-tac-toe-environment"
  application         = aws_elastic_beanstalk_application.l3-ttt-app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.3.0 running Docker"
  # tier value is not needed since the default one (e.g. "WebServer") is fine
  version_label       = aws_elastic_beanstalk_application_version.l3-ttt-app-version.name
  cname_prefix        = var.cname_prefix

  # Set environment type, choose from: LoadBalancer / SingleInstance.
  # SingleInstance is fine for our purpose
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "EnvironmentType"
    value     = "SingleInstance"
  }

  # Set IamInstanceProfile attaching the previously defined instance-profile
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.instance-profile.name
  }

  # Set InstanceType to t2.micro (the same one as we used before in the lab)
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t2.micro"
  }

  # Set VPCId to the one from terraform variables that will reference the VPC created from module
  # network (VPC has the same config as on the previous lab)
  setting {
    namespace = "aws:ec2:vpc"
    name      = "VPCId"
    value     = var.vpc_id
  }

  # Set Subnets using the ID provided by network module (Subnet has the same config as on the previous lab)
  setting {
    namespace = "aws:ec2:vpc"
    name      = "Subnets"
    value     = var.subnet_id
  }

  # Set SecurityGroups using the ID provided by network module
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "SecurityGroups"
    value     = var.security_group_id
  }

  # dynamic "setting" {
  #   for_each = local.env_vars
  #   content {
  #     namespace = "aws:elasticbeanstalk:application:environment"
  #     name      = setting.key
  #     value     = setting.value
  #   }
  # }
}