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

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d