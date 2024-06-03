# Define the provider (here - AWS) and its version
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

# Define the region in which AWS resources will 'physically' be created,
# optionally add a profile name (from the file .aws/credentials)
provider "aws" {
  region = "us-east-1"
  profile = var.credentials_profile
}

# Attach the network using `network` module
module "network" {
  source            = "./modules/network/"
  port_database      = var.port_database
  port_backend      = var.port_backend
  port_frontend     = var.port_frontend
}

# Attach the s3 bucket using `s3` module
module "s3" {
  source            = "./modules/s3/"
  s3_bucket_name    = var.s3_bucket
}

# Attach the whole instance config using Elastic Beanstalk (configuration defined in the `elastic_beanstalk` module)
module "ec2" {
  source                      = "./modules/ec2/"
  subnet_id                   = module.network.subnet_id
  security_group_id           = module.network.security_group_id
  port_database               = var.port_database
  mssql_sa_password           = var.mssql_sa_password
  port_backend                = var.port_backend
  port_frontend               = var.port_frontend
  aws_access_key_id           = var.aws_access_key_id
  aws_secret_access_key       = var.aws_secret_access_key
  aws_session_token           = var.aws_session_token
  s3_bucket                   = var.s3_bucket
  ssh_key                     = var.ssh_key
}