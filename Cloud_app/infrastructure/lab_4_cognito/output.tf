# output "public_address" {
#   value = module.beanstalk.public_address
# }

output "user_pool_client_id" {
  value = module.cognito.user_pool_client_id
}
output "user_pool_id" {
  value = module.cognito.user_pool_id
}