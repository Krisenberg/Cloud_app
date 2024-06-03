# Create Virtual Private Cloud and enable DNS and hostnames services inside it
resource "aws_vpc" "s3_storage_vpc" {
  cidr_block           = "10.0.0.0/24"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "s3_storage_vpc"
  }
}

# Attach an Internet gateway to make the instance visible from outside
resource "aws_internet_gateway" "s3_storage_gateway" {
  vpc_id = aws_vpc.s3_storage_vpc.id
  tags   = {
    Name = "s3_storage_gateway"
  }
}

# Create a public subnet inside the instance
resource "aws_subnet" "s3_storage_subnet" {
  vpc_id                  = aws_vpc.s3_storage_vpc.id
  cidr_block              = "10.0.0.0/26"
  map_public_ip_on_launch = true 
  tags = {
    Name = "s3_storage_subnet"
  }
}

# Create a routing table, attach it to the instance's VPC and add a default route through the gateway
resource "aws_route_table" "s3_storage_rt" { 
  vpc_id = aws_vpc.s3_storage_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.s3_storage_gateway.id
  }

  tags = {
    Name = "s3_storage_rt"
  }
}

# Associate the routing table to the subnet to apply routing rules to that subnet
resource "aws_route_table_association" "s3_storage_rt_assoc" {
  subnet_id      = aws_subnet.s3_storage_subnet.id
  route_table_id = aws_route_table.s3_storage_rt.id
}

# Create a security group defining incoming and outcoming rules for the network
# That way we define and enable only the necessary ports for our application
# This security group is then attached to the VPC
resource "aws_security_group" "s3_storage_sec_group" {
  name        = "s3_storage_sec_group"
  vpc_id      = aws_vpc.s3_storage_vpc.id
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

  # database rule - port var.port_database
  ingress {
    from_port   = var.port_database
    to_port     = var.port_database
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

  # backend rule - port var.port_backend
  ingress {
    from_port   = var.port_backend
    to_port     = var.port_backend
    protocol    = "tcp" 
    cidr_blocks = ["0.0.0.0/0"]
  }

  # frontend rule - port var.port_frontend
  ingress {
    from_port   = var.port_frontend
    to_port     = var.port_frontend
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
    Name = "s3_storage_sec_group"
  }
}