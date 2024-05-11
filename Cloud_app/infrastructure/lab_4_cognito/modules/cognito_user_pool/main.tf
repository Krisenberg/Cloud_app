resource "aws_cognito_user_pool_client" "client" {
  name = "ttt_user-pool_client"

  user_pool_id = aws_cognito_user_pool.user_pool.id
}

resource "aws_cognito_user_pool" "user_pool" {
  name = "tic-tac-toe_user-pool"
  
  password_policy {
    minimum_length    = 6
    require_numbers   = true
    require_symbols   = false
    require_lowercase = false
    require_uppercase = false
    temporary_password_validity_days = 7
  }

  mfa_configuration = "OFF"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  auto_verified_attributes = ["email"]
}
