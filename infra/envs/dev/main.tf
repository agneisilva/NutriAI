locals {
  app_name            = "nutriai-anamnese"
  ddb_table_name      = "nutriai_anamnese_sessions_dev"
  lambda_function_name = "${var.project_prefix}-${var.environment}-anamnese"
  api_name            = "${var.project_prefix}-${var.environment}-http-api"
  lambda_role_name    = "${var.project_prefix}-${var.environment}-lambda-role"
  log_group_name      = "/aws/lambda/${local.lambda_function_name}"

  tags = {
    project = var.project_prefix
    env     = var.environment
    managed = "terraform"
  }
}

resource "aws_secretsmanager_secret" "gemini_api_key" {
  name                    = "${var.project_prefix}/${var.environment}/GEMINI_API_KEY"
  recovery_window_in_days = 0
  tags                    = local.tags
}

resource "aws_secretsmanager_secret_version" "gemini_api_key" {
  secret_id     = aws_secretsmanager_secret.gemini_api_key.id
  secret_string = var.gemini_api_key
}

module "ddb" {
  source     = "../../modules/ddb"
  table_name = local.ddb_table_name
  tags       = local.tags
}

module "logs" {
  source            = "../../modules/logs"
  log_group_name    = local.log_group_name
  retention_in_days = 14
  tags              = local.tags
}

module "iam" {
  source             = "../../modules/iam"
  role_name          = local.lambda_role_name
  dynamodb_table_arn = module.ddb.table_arn
  secret_arn         = aws_secretsmanager_secret.gemini_api_key.arn
  tags               = local.tags
}

module "lambda" {
  source        = "../../modules/lambda"
  function_name = local.lambda_function_name
  role_arn      = module.iam.role_arn
  zip_path      = "../../../backend/dist/lambda.zip"
  handler       = "lambda_handler.handler"
  timeout       = 25
  memory_size   = 512
  environment_variables = {
    APP_NAME                   = local.app_name
    APP_ENV                    = var.environment
    DDB_TABLE_NAME             = module.ddb.table_name
    AUTH_ENABLED               = tostring(var.auth_enabled)
    GEMINI_MODEL               = var.gemini_model
    GEMINI_TIMEOUT_SECONDS     = "8"
    GEMINI_MAX_OUTPUT_TOKENS   = "120"
    GEMINI_API_KEY_SECRET_ARN  = aws_secretsmanager_secret.gemini_api_key.arn
  }
  tags = local.tags

  depends_on = [module.logs]
}

module "apigw_http" {
  source               = "../../modules/apigw_http"
  api_name             = local.api_name
  lambda_invoke_arn    = module.lambda.invoke_arn
  lambda_function_name = module.lambda.function_name
  cors_allow_origins   = ["*"]
  tags                 = local.tags
}
