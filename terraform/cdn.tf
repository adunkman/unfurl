locals {
  s3_origin_id = "ui"
}

resource "aws_cloudfront_distribution" "primary" {
  enabled = true
  is_ipv6_enabled = true
  web_acl_id = aws_wafv2_web_acl.primary.arn

  aliases = [ "unfurl.page" ]
  default_root_object = "index.html"

  custom_error_response {
    error_caching_min_ttl = 3600
    error_code = 404
    response_code = 404
    response_page_path = "/404.html"
  }

  origin {
    domain_name = aws_s3_bucket.ui.bucket_regional_domain_name
    origin_id = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.ui_oai.cloudfront_access_identity_path
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


resource "aws_cloudfront_origin_access_identity" "ui_oai" {
  comment = "ui_oai"
}

resource "aws_wafv2_web_acl" "primary" {
  name = "primary"
  scope = "CLOUDFRONT"

  default_action {
    block {}
  }

  rule {
    name = "AWS-AWSManagedRulesAmazonIpReputationList"
    priority = 0

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name = "AWS-AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled = true
    }
  }

  rule {
    name = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name = "AWS-AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled = true
    }
  }

  rule {
    name = "AWS-AWSManagedRulesCommonRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name = "AWS-AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled = true
    }
  }

  rule {
    name = "standard-rate-limit"
    priority = 3

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
      cloudwatch_metrics_enabled = true
      metric_name = "standard-rate-limit"
      sampled_requests_enabled = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = false
    metric_name = "primary"
    sampled_requests_enabled   = false
  }
}
