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
      -  "1433:1433"
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=${mssql_sa_password}
  backend:
    image: krisenberg/s3_backend:latest
    container_name: backend
    ports:
      - "8080:80"
    environment:
      - FRONTEND_IP=http://44.222.172.98:3000
      - DATABASE_URL=${database_url}
      - MSSQL_SA_PASSWORD=${mssql_sa_password}
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d