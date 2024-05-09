# Create the docker-compose file
cat <<DOCKER_EOF > docker-compose.yml
version: '3'
services:
  backend:
    image: krisenberg/backend:latest
    container_name: backend
    ports:
      - "8080:80"
    environment:
      - FRONTEND_IP=http://glowacz-ttt.us-east-1.elasticbeanstalk.com:3000
  frontend:
    image: krisenberg/frontend:latest
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_IP=http://glowacz-ttt.us-east-1.elasticbeanstalk.com:8080
      - REACT_APP_COGNITO_REGION=us-east-1
      - REACT_APP_COGNITO_USER_POOL_CLIENT_ID=1rssfhmi8dt861nadiu9hapd73
      - REACT_APP_COGNITO_USER_POOL_ID=us-east-1_1gAfKOgyx
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d