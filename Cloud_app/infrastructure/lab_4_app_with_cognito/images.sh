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
      - FRONTEND_IP=http://3.90.144.110:3000
      - COGNITO_REGION=us-east-1
      - COGNITO_USER_POOL_ID=us-east-1_b8evmGMG8
  frontend:
    image: krisenberg/frontend:dev
    container_name: frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_BACKEND_IP=http://3.90.144.110:8080
      - REACT_APP_COGNITO_REGION=us-east-1
      - REACT_APP_COGNITO_USER_POOL_CLIENT_ID=2eph6h9vimo1jag3k1m1f9u8cl
      - REACT_APP_COGNITO_USER_POOL_ID=us-east-1_b8evmGMG8
      - REACT_APP_LOCAL_STORAGE_AUTH_TOKEN=tic_tac_toe_access_token
DOCKER_EOF

# make the docker-compose file executable
sudo chmod +x docker-compose.yml

# run docker compose in a detached mode
sudo docker-compose up -d