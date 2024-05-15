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
      - FRONTEND_IP=http://44.222.172.98:3000
      - COGNITO_REGION=us-east-1
      - COGNITO_USER_POOL_ID=us-east-1_2CtVVLBiG
  frontend:
    image: krisenberg/frontend:dev
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_IP=http://44.222.172.98:8080
      - REACT_APP_COGNITO_REGION=us-east-1
      - REACT_APP_COGNITO_USER_POOL_CLIENT_ID=ice2p1fqu9fj45uicsumdt09q
      - REACT_APP_COGNITO_USER_POOL_ID=us-east-1_2CtVVLBiG
      - REACT_APP_LOCAL_STORAGE_AUTH_TOKEN=tic_tac_toe_access_token
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d