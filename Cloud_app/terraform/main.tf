terraform {
    required_providers {
      aws = {
        source = "hashicorp/aws"
        version = "~> 4.16"
        # version = "~> 5.43"
      }
    }

    required_version = ">= 1.2.0"    
}

resource "tls_private_key" "rsa_4096" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

variable "key_name" {
  description = "Name of the SSH key pair"
  default     = "labsuser.pem"
}

resource "aws_key_pair" "key_pair" {
  key_name   = var.key_name
  public_key = tls_private_key.rsa_4096.public_key_openssh
}

resource "local_file" "private_key" {
  content  = tls_private_key.rsa_4096.private_key_pem
  filename = var.key_name
}

provider "aws"{
    region = "us-east-1"
    profile = "krzysztof.glowacz"
}

resource "aws_instance" "ttt_instance" {
    ami                         = "ami-0c101f26f147fa7fd"
    instance_type               = "t3.medium"

    subnet_id = aws_subnet.ttt_subnet_public_1.id
    vpc_security_group_ids = [aws_security_group.ttt_security_group.id]
    associate_public_ip_address = true
    key_name = aws_key_pair.key_pair.key_name

    tags = {
        Name = "ttt_instance"
    }

    connection {
        type        = "ssh"
        user        = "ec2-user"
        private_key = file("${path.module}/ssh/${var.key_name}")
        host        = self.public_ip
    }

    user_data = <<-EOF
        #!/bin/bash
        
        cd /usr
        mkdir tic-tac-toe
        cd /tic-tac-toe

        # Pull the Docker images
        sudo docker pull krisenberg/client:v1.0
        sudo docker pull krisenberg/server:v1.0

        # Create the docker-compose file
        cat <<DOCKER_EOF > docker-compose.yml
        version: '3'
        services:
        backend:
            image: krisenberg/server:v1.0
            ports:
            - "5244:80"
        frontend:
            image: krisenberg/client:v1.0
            ports:
            - "3000:3000"
        DOCKER_EOF

        # Start the Docker containers using docker-compose
        sudo docker-compose up -d

        echo "Docker containers started successfully."
    EOF
}

resource "aws_vpc" "ttt_vpc" {
    cidr_block           = "10.0.0.0/24"
    # Has to be set to 'true' because default value is 'false'
    enable_dns_hostnames = true
    tags = {
        Name = "ttt_vpc"
    }
}

resource "aws_internet_gateway" "ttt_gateway" {
    vpc_id = aws_vpc.ttt_vpc.id

    tags = {
        Name = "ttt_gateway"
    }
}

resource "aws_subnet" "ttt_subnet_public_1" {
    vpc_id = aws_vpc.ttt_vpc.id
    cidr_block = "10.0.0.0/26"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = true 
    tags = {
        Name = "ttt_subnet_public_1"
    }
}

resource "aws_subnet" "ttt_subnet_public_2" {
    vpc_id = aws_vpc.ttt_vpc.id
    cidr_block = "10.0.0.64/26"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = true 
    tags = {
        Name = "ttt_subnet_public_2"
    }
}

resource "aws_subnet" "ttt_subnet_private_1" {
    vpc_id = aws_vpc.ttt_vpc.id
    cidr_block = "10.0.0.128/26"
    availability_zone = "us-east-1a"
    map_public_ip_on_launch = false
    tags = {
        Name = "ttt_subnet_private_1"
    }
}

resource "aws_subnet" "ttt_subnet_private_2" {
    vpc_id = aws_vpc.ttt_vpc.id
    cidr_block = "10.0.0.192/26"
    availability_zone = "us-east-1b"
    map_public_ip_on_launch = true
    tags = {
        Name = "ttt_subnet_private_2"
    }
}

resource "aws_route_table" "ttt_public_route_table" { 
    vpc_id = aws_vpc.ttt_vpc.id

    route {
        cidr_block = "0.0.0.0/0"
        gateway_id = aws_internet_gateway.ttt_gateway.id
    }

    tags = {
        Name = "ttt_public_route_table"
    }
}

resource "aws_route_table" "ttt_private_route_table" { 
    vpc_id = aws_vpc.ttt_vpc.id

    tags = {
        Name = "ttt_private_route_table"
    }
}

resource "aws_route_table_association" "ttt_route_table_assoc_public_1" {
    subnet_id = aws_subnet.ttt_subnet_public_1.id
    route_table_id = aws_route_table.ttt_public_route_table.id
}

resource "aws_route_table_association" "ttt_route_table_assoc_public_2" {
    subnet_id = aws_subnet.ttt_subnet_public_2.id
    route_table_id = aws_route_table.ttt_public_route_table.id
}

resource "aws_route_table_association" "ttt_route_table_assoc_private_1" {
    subnet_id = aws_subnet.ttt_subnet_private_1.id
    route_table_id = aws_route_table.ttt_private_route_table.id
}

resource "aws_route_table_association" "ttt_route_table_assoc_private_2" {
    subnet_id = aws_subnet.ttt_subnet_private_2.id
    route_table_id = aws_route_table.ttt_private_route_table.id
}

resource "aws_security_group" "ttt_security_group" {
    name        = "ttt_security_group"
    vpc_id      = aws_vpc.ttt_vpc.id
    description = "Security group of the app"

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
        from_port   = 5244
        to_port     = 5244
        protocol    = "tcp" 
        cidr_blocks = ["0.0.0.0/0"]
    }

    # front
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

    # Traffic going out
    egress {
        from_port   = 0
        to_port     = 0
        protocol    = "-1"
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "ttt_security_group"
    }
}

resource "null_resource" "change_key_permissions" {
  provisioner "local-exec" {
    command = "icacls \"${path.module}\\ssh\\${var.key_name}\" /inheritance:r /grant \"%USERNAME%\":R"
    interpreter = ["PowerShell", "-Command"]
  }

  triggers = {
    key_name = aws_key_pair.key_pair.key_name
  }
}

output "instance_public_ip" {
    value = aws_instance.ttt_instance.public_ip
}

# resource "aws_eip" "ttt_eip" {
#   domain     = "vpc"
#   depends_on = [aws_vpc.ttt_vpc]
# }

# resource "aws_eip_association" "ttt_eip_alloc" {
#   instance_id   = aws_instance.ttt_instance.id
#   allocation_id = aws_eip.ttt_eip.id
# }