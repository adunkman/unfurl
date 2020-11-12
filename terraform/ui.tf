# Logging is not needed for the web host bucket. (AWS002)
# Encryption is not needed for these public files. (AWS017)
# tfsec:ignore:AWS002 tfsec:ignore:AWS017
resource "aws_s3_bucket" "ui" {
  bucket = "unfurl.page"
  acl = "private"

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  versioning {
    enabled = true
  }
}

resource "aws_s3_bucket_policy" "ui" {
  bucket = aws_s3_bucket.ui.id
  policy = data.aws_iam_policy_document.allow_cloudfront_read.json
}

data "aws_iam_policy_document" "allow_cloudfront_read" {
  statement {
    actions = ["s3:GetObject","s3:GetObjectVersion"]
    resources = ["${aws_s3_bucket.ui.arn}/*"]
    principals {
      type = "*"
      identifiers = ["*"]
    }
    condition {
      test = "StringLike"
      variable = "aws:Referer"
      values = [module.vault.ui_bucket_shared_secret]
    }
  }
}
