terraform {
  backend "s3" {
    bucket = "unfurl-terraform"
    key = "state"
    region = "us-east-1"
    dynamodb_table = "terraform"
  }

  required_providers {
    aws = {
      source = "aws"
      version = "3.14.1"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "db" {
  source = "./db"
  dynamodb_endpoint = var.dynamodb_endpoint
}
