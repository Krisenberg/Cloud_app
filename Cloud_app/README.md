# Tic Tac Toe - multiplayer game hosted in AWS Cloud

## Components
Application consists of 3 components:
- client - frontend [React]
- server - backend [ASP .NET]
- infrastructure - modules that create needed cloud resources [Terraform]

## Usage
You can run the application locally or in the cloud.

### Localhost
1. Configure AWS CLI, paste credentials into `~/.aws/credentials`
2. Configure Terraform
3. Navigate to `infrastructure/lab_4_only_cognito_user_pool`
4. Run `terraform init`, `terraform plan`, `terraform apply`.
   Set the `var.credentials_profile` accordingly to your credentials'
   profile name (default = 'default')
5. Wait for the AWS Cognito user pool. Copy the outputs (`user_pool_id` and
   `user_pool_client_id`) and paste them to the `.env` files inside both
   client and server directories.  
   `client/.env`:
   ```
    REACT_APP_BACKEND_IP=<backend_ip_from_dotnet_app>
    REACT_APP_COGNITO_REGION=us-east-1
    REACT_APP_COGNITO_USER_POOL_CLIENT_ID=<user_pool_client_id>
    REACT_APP_COGNITO_USER_POOL_ID=<user_pool_id>
    REACT_APP_LOCAL_STORAGE_AUTH_TOKEN=tic_tac_toe_access_token
   ```
   `server/.env`:
   ```
    FRONTEND_IP=http://localhost:3000
    COGNITO_REGION=us-east-1
    COGNITO_USER_POOL_ID=<user_pool_id>
   ```
6. Navigate to `client/` and run `npm start`
7. Navigate to `server/` and run `dotnet run`

### AWS Cloud
1. Configure AWS CLI, paste credentials into `~/.aws/credentials`
2. Configure Terraform
3. Navigate to `infrastructure/lab_4_app_with_cognito`
4. Run `terraform init`, `terraform plan`, `terraform apply`.
   Set the `var.credentials_profile` accordingly to your credentials'
   profile name (default = 'default')
   Set the `var.ssh_key` accordingly to your ssh key's name that you obtained
   from AWS to connect with EC2 instances.
5. Wait and let Terraform create the whole infrastructure.
6. Take the instance's IP address from the output.
7. Establish a connection with your instance by calling:
   `ssh -i <path_to_your_ssh_key> ec2-user@<instance_ip_address>`
8. On your machine navigate to `infrastructure/lab_4_app_with_cognito/modules/ec2`
   and copy newly created `docker-compose.yml` file content, then paste it into
   `infrastructure/lab_4_app_with_cognito/images.sh` file (override the existing content).
9. Copy each of all 3 instructions from the `images.sh` file into EC2 instance terminal.
10. Wait for two Docker containers and check the address obtained from Terraform (HTTP not HTTPS !!!)
    at port 3000.