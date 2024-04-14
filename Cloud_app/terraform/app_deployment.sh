#!/bin/bash

# Pull the Docker images
sudo docker pull krisenberg/client:v1.0
sudo docker pull krisenberg/server:v1.0

# Create a directory for the docker-compose file
mkdir -p /home/ec2-user/docker_app
cd /home/ec2-user/docker_app

# Create the docker-compose file
cat <<EOF > docker-compose.yml
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
EOF

# Start the Docker containers using docker-compose
sudo docker-compose up -d

echo "Docker containers started successfully."