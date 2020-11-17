terraform {
  required_providers {
    aws = {
      source = "aws"
      version = "3.14.1"
    }
  }
}

provider "aws" {
  region = "us-east-1"

  endpoints {
    dynamodb = var.dynamodb_endpoint
  }
}
