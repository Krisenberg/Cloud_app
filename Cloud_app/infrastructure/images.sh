# Pull the Docker images
    sudo docker pull krisenberg/frontend:aws
    sudo docker pull krisenberg/last:latest

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
    networks:
        app-network:
            driver: bridge
    DOCKER_EOF

    sudo chmod +x docker-compose.yml

    # Start the Docker containers using docker-compose
    sudo docker-compose up -d

    echo "Docker containers started successfully."