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

# Attach the whole instance config using Elastic Beanstalk (configuration defined in the `elastic_beanstalk` module)
module "ec2" {
  source                      = "./modules/ec2/"
  vpc_id                      = module.network.vpc_id
  subnet_id                   = module.network.subnet_id
  security_group_id           = module.network.security_group_id
  port_database               = var.port_database
  port_backend                = var.port_backend
  port_frontend               = var.port_frontend
  mssql_sa_password           = var.mssql_sa_password
  ssh_key                     = var.ssh_key
}