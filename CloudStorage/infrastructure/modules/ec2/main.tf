resource "local_file" "deployment_compose" {
  content = templatefile("${path.module}/deployment_template.sh",
    {
      mssql_sa_password=var.mssql_sa_password
      database_url=aws_instance.s3_storage.public_ip
    }
  )
  filename = "${path.module}/deployment.sh"
  depends_on = [aws_instance.s3_storage]
}

# Create the instance using some specific AMI, type t2.micro is perfectly fine for our needs
# Attach the subnet, security group, (optionally ssh key name)
# User data contains the script that will initially install docker and docker-compose on our instance
resource "aws_instance" "s3_storage" {
  ami                      = "ami-0cf43e890af9e3351"
  instance_type            = "t2.medium"
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.ssh_key

  tags = {
    Name = "s3_storage"
  }
}