resource "aws_dynamodb_table" "api_keys" {
  name = "api_keys"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "api_key"

  attribute {
    name = "api_key"
    type = "S"
  }

  global_secondary_index {
    name = "owner_email_index"
    hash_key = "owner_email"
    projection_type = "ALL"
  }

  attribute {
    name = "owner_email"
    type = "S"
  }

  lifecycle {
    ignore_changes = [
      read_capacity,
      write_capacity
    ]
  }
}
