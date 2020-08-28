resource "aws_route53_zone" "primary" {
  name = "unfurl.page"
}

resource "aws_route53_record" "apex" {
  zone_id = aws_route53_zone.primary.zone_id
  name = aws_route53_zone.primary.name
  type = "A"

  alias {
    name = aws_cloudfront_distribution.primary.domain_name
    zone_id = aws_cloudfront_distribution.primary.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = aws_route53_zone.primary.zone_id
  name = "www.${aws_route53_zone.primary.name}"
  type = "A"

  alias {
    name = aws_cloudfront_distribution.primary.domain_name
    zone_id = aws_cloudfront_distribution.primary.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "api" {
  zone_id = aws_route53_zone.primary.zone_id
  name = aws_apigatewayv2_domain_name.primary.domain_name
  type = "A"

  alias {
    name = aws_apigatewayv2_domain_name.primary.domain_name_configuration[0].target_domain_name
    zone_id = aws_apigatewayv2_domain_name.primary.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}
