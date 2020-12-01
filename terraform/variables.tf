variable "dynamodb_endpoint" {
  type = string
  default = "https://dynamodb.us-east-1.amazonaws.com"
}

variable "github_client_id" {
  type = string
}

variable "github_client_secret" {
  type = string
}

variable "admin_emails_csv" {
  type = string
}

variable "cookie_encryption_secret" {
  type = string
}
