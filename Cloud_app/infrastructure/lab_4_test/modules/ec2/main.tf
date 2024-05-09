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
  source = "${path.module}/docker-compose.yml"
  key    = "docker-compose.yml"
  depends_on = [local_file.deployment_compose]
}

# Create the instance using some specific AMI, type t2.micro is perfectly fine for our needs
# Attach the subnet, security group, (optionally ssh key name)
# User data contains the script that will initially install docker and docker-compose on our instance
resource "aws_instance" "tic_tac_toe" {
  ami                      = "ami-0cf43e890af9e3351"
  instance_type            = "t2.micro"
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
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

    # Download Docker Compose YAML file from S3
    sudo yum install -y aws-cli
    aws s3 cp "${aws_s3_object.l3-ttt-s3-object.id}" /home/ec2-user/docker-compose.yml

    # Change directory to where the YAML file is located
    cd /home/ec2-user

    sudo chmod +x docker-compose.yml

    # Run docker-compose up with the downloaded YAML file
    sudo docker-compose up -d
  EOF
}