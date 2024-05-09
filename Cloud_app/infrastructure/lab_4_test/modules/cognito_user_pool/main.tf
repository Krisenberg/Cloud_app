resource "aws_cognito_user_pool_client" "client" {
  name = "ttt_user-pool_client"

  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "tic-tac-toe_user-pool"
}