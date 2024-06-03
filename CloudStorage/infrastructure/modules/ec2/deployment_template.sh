#!/bin/bash

# Install Docker
sudo amazon-linux-extras install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose

cd /home/ec2-user

# Create the docker-compose file
cat <<DOCKER_EOF > docker-compose.yml
version: '3'
services:
  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: sql-server-2022
    ports:
      -  "${port_database}:${port_database}"
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=${mssql_sa_password}
  backend:
    image: krisenberg/s3_backend:latest
    container_name: backend
    ports:
      - "${port_backend}:80"
    environment:
      - MSSQL_SA_PASSWORD=${mssql_sa_password}
      - AWS_ACCESS_KEY_ID=${aws_access_key_id}
      - AWS_SECRET_ACCESS_KEY=${aws_secret_access_key}
      - AWS_SESSION_TOKEN=${aws_session_token}
      - S3_BUCKET=${s3_bucket}
      - APP_DOMAIN=${app_domain}
  frontend:
    image: krisenberg/s3_frontend:latest
    container_name: frontend
    ports:
      - "${port_frontend}:${port_frontend}"
    environment:
      - REACT_APP_BACKEND=http://${app_domain}:${port_backend}
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d