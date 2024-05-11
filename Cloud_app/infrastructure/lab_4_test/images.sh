# Create the docker-compose file
cat <<DOCKER_EOF > docker-compose.yml
version: '3'
services:
  backend:
    image: krisenberg/backend:dev
    container_name: backend
    ports:
      - "8080:80"
    environment:
      - FRONTEND_IP=http://54.89.117.237:3000
      - COGNITO_REGION=us-east-1
      - COGNITO_USER_POOL_ID=us-east-1_c3oDfbKUf
  frontend:
    image: krisenberg/frontend:dev
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_IP=http://54.89.117.237:8080
      - REACT_APP_COGNITO_REGION=us-east-1
      - REACT_APP_COGNITO_USER_POOL_CLIENT_ID=1emncu0qnp2mnes7eeuc2ss1od
      - REACT_APP_COGNITO_USER_POOL_ID=us-east-1_c3oDfbKUf
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d