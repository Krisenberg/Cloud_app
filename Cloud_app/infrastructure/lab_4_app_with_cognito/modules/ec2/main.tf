resource "local_file" "deployment_compose" {
  content = templatefile("${path.module}/docker-compose-template.yml",
    {
      region=var.cognito_region
      user_pool_client_id=var.cognito_user_pool_client_id
      user_pool_id=var.cognito_user_pool_id
      app_url="http://${aws_instance.tic_tac_toe.public_ip}"
    }
  )
  filename = "${path.module}/docker-compose.yml"
  depends_on = [aws_instance.tic_tac_toe]
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

    sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

    cd /home/ec2-user
    EOF
}