locals {
  s3_origin_id = "ui"
}

resource "aws_cloudfront_distribution" "primary" {
  enabled = true
  is_ipv6_enabled = true
  web_acl_id = aws_wafv2_web_acl.primary.id

  aliases = [ "unfurl.page" ]

  custom_error_response {
    error_caching_min_ttl = 3600
    error_code = 404
    response_code = 404
    response_page_path = "/404.html"
  }

  origin {
    domain_name = aws_s3_bucket.ui.website_endpoint
    origin_id = local.s3_origin_id

    custom_header {
      name = "Referer"
      value = module.vault.ui_bucket_shared_secret
    }

    custom_origin_config {
      http_port = 80
      https_port = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD", "OPTIONS"]
    cached_methods = ["GET", "HEAD", "OPTIONS"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    compress = true
  }

  viewer_certificate {
    acm_certificate_arn = aws_acm_certificate.primary.arn
    minimum_protocol_version = "TLSv1.2_2019"
    ssl_support_method = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_wafv2_web_acl" "primary" {
  name = "primary"
  scope = "REGIONAL"

  default_action {
    block {}
  }

  rule {
    name = "standard-rate-limit"
    priority = 1

    action {
      count {}
    }

    statement {
      rate_based_statement {
        limit = 10000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      metric_name = "standard-rate-limit"
      sampled_requests_enabled = false
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name = "primary"
    sampled_requests_enabled   = false
  }
}
