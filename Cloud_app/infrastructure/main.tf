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

# Define the region in which AWS resources will 'physically' be created
provider "aws" {
  region = "us-east-1"
  profile = "krzysztof.glowacz"
}

# Tworzy Virtual Private Cloud, które pozwala na DNS i nazwy hostów.
# Włącza wsparcie dla DNS i nazw hostów DNS wewnątrz VPC
resource "aws_vpc" "ttt_vpc" {
  cidr_block           = "10.0.0.0/24"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "ttt_vpc"
  }
}

# Brama umożliwiające łączenie się VPC z Internetem
resource "aws_internet_gateway" "ttt_gateway" {
  vpc_id = aws_vpc.ttt_vpc.id
  tags = {
    Name = "ttt_gateway"
  }
}

# Tworzy podsieć w VPC z automatycznym przydzielaniem IP publicznych oraz dla EC2
resource "aws_subnet" "ttt_subnet" {
  vpc_id                  = aws_vpc.ttt_vpc.id
  cidr_block              = "10.0.0.0/26"
  map_public_ip_on_launch = true 
  tags = {
    Name = "ttt_subnet"
  }
}

# Tworzy tabelę routingu dla VPC, dodając trasę domyślną przez bramę 
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

# Wiąże tabelę routingu z podsiecią, umożliwiając jej dostęp do internetu.
resource "aws_route_table_association" "ttt_rt_assoc" {
  subnet_id      = aws_subnet.ttt_subnet.id
  route_table_id = aws_route_table.ttt_rt.id
}

# Tworzy grupę bezpieczeństwa z regułami dla ruchu przychodzącego (ingress) i wychodzącego (egress), umożliwiając jedynie ruch na niezbędnych portach.
# Zapewnia to bezpieczeństwo przed atakami na wolne porty.
resource "aws_security_group" "ttt_sec_group" {
  name        = "ttt_sec_group"
  vpc_id      = aws_vpc.ttt_vpc.id
  description = "Security group for accessing application and ec2 via SSH"

# HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

# HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

# backend
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

# frontend (możnaby w sumie dawać front na port 80/443, ale zrobiłem inaczej)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

# ssh
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Reguła dla całego ruchu wychodzącego, która go nie ogranicza
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

# Tworzy instancję EC2 z określonym obrazem AMI, typem instancji i grupą bezpieczeństwa.
# AMI zostało znalezione dzięki stronie https://api.netcubed.de/latest/ami/lookup?platform=amzn2&fbclid=IwAR0BKcf3D28DiuvttUfKMZE0WtwgWRv0kW9_XCCJwHBntSRfG1LbcFyYK10_aem_AWHs8WBIRtX7NEjqT6j_cNuemLt6UmXLj0LJI1Zhp8B1CU_acHz7FYUNf_YAMdEoUpdU0QfAvXFSdC-_Ml61ic2E
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

# Definicja i powiązanie Elastic IP, które daje nam publiczny adres IP
# resource "aws_eip" "app_eip" {
#   domain     = "vpc"
#   depends_on = [aws_vpc.app_vpc]
# }

# resource "aws_eip_association" "eip_assoc" {
#   instance_id   = aws_instance.tic_tac_toe.id
#   allocation_id = aws_eip.app_eip.id
# }

# output "instance_public_ip" {
#     value = aws_instance.tic_tac_toe.public_ip
# }