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
  profile = "krzysztof.glowacz"
}

resource "aws_cognito_user_pool_client" "client" {
  name = "client"

  user_pool_id = aws_cognito_user_pool.pool.id
}

resource "aws_cognito_user_pool" "pool" {
  name = "pool"
}