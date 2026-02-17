terraform {
  backend "s3" {
    bucket         = "nutriai-tfstate-us-east-1"
    key            = "nutriai/dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "nutriai-terraform-locks"
    encrypt        = true
  }
}
