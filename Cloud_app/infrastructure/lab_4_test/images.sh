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
      - FRONTEND_IP=http://54.167.66.197:3000
  frontend:
    image: krisenberg/frontend:new-cognito
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_IP=http://54.167.66.197:8080
      - REACT_APP_COGNITO_REGION=us-east-1
      - REACT_APP_COGNITO_USER_POOL_CLIENT_ID=1r9dp75gp13ucq6c4i8evk8e8n
      - REACT_APP_COGNITO_USER_POOL_ID=us-east-1_35e7FMdJl
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d