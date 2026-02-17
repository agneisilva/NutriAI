output "api_base_url" {
  value = module.apigw_http.api_base_url
}

output "dynamodb_table_name" {
  value = module.ddb.table_name
}

output "lambda_function_name" {
  value = module.lambda.function_name
}

output "secret_arn" {
  value = aws_secretsmanager_secret.gemini_api_key.arn
}
