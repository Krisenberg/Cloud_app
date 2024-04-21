terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
  profile = "krzysztof.glowacz"
}

module "network" {
  source = "./modules/network/"
}

module "beanstalk" {
  source        = "./modules/elastic_beanstalk/"
  cname_prefix  = var.cname_prefix
  method        = var.method
  vpc_id        = module.network.vpc_id
  subnet_id     = module.network.subnet_id
  security_group_id = module.network.security_group_id
}