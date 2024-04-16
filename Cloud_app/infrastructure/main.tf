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

# Create the instance using some specific AMI, type t2.micro is perfectly fine for our needs
# Attach the subnet, security group, (optionally ssh key name)
# User data contains the script that will initially install docker and docker-compose on our instance
resource "aws_instance" "tic_tac_toe" {
  ami                      = "ami-0cf43e890af9e3351"
  instance_type            = "t2.micro"
  subnet_id              = aws_subnet.ttt_subnet.id
  vpc_security_group_ids = [aws_security_group.ttt_sec_group.id]
  key_name               = var.ssh_key

  tags = {
    Name = "tic_tac_toe"
  }

  user_data = <<-EOF
    #!/bin/bash

    # Install Docker
    sudo amazon-linux-extras install docker -y
    sudo service docker start
    sudo usermod -a -G docker ec2-user

    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    cd /home/ec2-user
    EOF
}

# Create Virtual Private Cloud and enable DNS and hostnames services inside it
resource "aws_vpc" "ttt_vpc" {
  cidr_block           = "10.0.0.0/24"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "ttt_vpc"
  }
}

# Attach an Internet gateway to make the instance visible from outside
resource "aws_internet_gateway" "ttt_gateway" {
  vpc_id = aws_vpc.ttt_vpc.id
  tags = {
    Name = "ttt_gateway"
  }
}

# Create a public subnet inside the instance
resource "aws_subnet" "ttt_subnet" {
  vpc_id                  = aws_vpc.ttt_vpc.id
  cidr_block              = "10.0.0.0/26"
  map_public_ip_on_launch = true 
  tags = {
    Name = "ttt_subnet"
  }
}

# Create a routing table, attach it to the instance's VPC and add a default route through the gateway
resource "aws_route_table" "ttt_rt" { 
  vpc_id = aws_vpc.ttt_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ttt_gateway.id
  }

  tags = {
    Name = "ttt_rt"
  }
}

# Associate the routing table to the subnet to apply routing rules to that subnet
resource "aws_route_table_association" "ttt_rt_assoc" {
  subnet_id      = aws_subnet.ttt_subnet.id
  route_table_id = aws_route_table.ttt_rt.id
}

# Create a security group defining incoming and outcoming rules for the network
# That way we define and enable only the necessary ports for our application
# This security group is then attached to the VPC
resource "aws_security_group" "ttt_sec_group" {
  name        = "ttt_sec_group"
  vpc_id      = aws_vpc.ttt_vpc.id
  description = "Security group for accessing application and ec2 via SSH"

  # HTTP rule
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS rule
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

  # backend rule - port 8080
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

  # frontend rule - port 3000
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

  # ssh - enable ssh connection
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # enable whole outcoming traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ttt_sec_group"
  }
}