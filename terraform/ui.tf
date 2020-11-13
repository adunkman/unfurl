# Logging is not needed for the web host bucket. (AWS002)
# Encryption is not needed for these public files. (AWS017)
# tfsec:ignore:AWS002 tfsec:ignore:AWS017
resource "aws_s3_bucket" "ui" {
  bucket = "unfurl.page"
  acl = "private"

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "ui" {
  bucket = aws_s3_bucket.ui.id
  block_public_acls = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_policy" "ui" {
  bucket = aws_s3_bucket.ui.id
  policy = data.aws_iam_policy_document.allow_cloudfront_read.json
}

data "aws_iam_policy_document" "allow_cloudfront_read" {
  statement {
    actions = [
      "s3:GetObject",
      "s3:GetObjectVersion"
    ]

    resources = ["${aws_s3_bucket.ui.arn}/*"]

    principals {
      type = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.ui_oai.iam_arn]
    }
  }
}
