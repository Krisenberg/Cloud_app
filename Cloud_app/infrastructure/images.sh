# Pull the Docker images
    sudo docker pull krisenberg/backend:latest
    sudo docker pull krisenberg/frontend:latest

# Create the docker-compose file
    cat <<DOCKER_EOF > docker-compose.yml
    version: '3'
    services:
    backend:
        image: krisenberg/backend:latest
        ports:
        - "8080:80"
        environment:
        - FRONTEND_IP=http://3.227.254.227:3000
    frontend:
        image: krisenberg/frontend:latest
        ports:
        - "3000:3000"
        environment:
        - REACT_APP_BACKEND_IP=http://3.227.254.227:8080
    DOCKER_EOF

    sudo chmod +x docker-compose.yml

    # Start the Docker containers using docker-compose
    sudo docker-compose up -d

    echo "Docker containers started successfully."