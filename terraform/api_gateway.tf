resource "aws_apigatewayv2_api" "primary" {
  name = "api.unfurl.page"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_domain_name" "primary" {
  domain_name = "api.unfurl.page"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.primary.arn
    endpoint_type = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_stage" "production" {
  api_id = aws_apigatewayv2_api.primary.id
  name = "production"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.production_proxy.arn
    format = jsonencode({
      account_id = "$context.accountId"
      api_id = "$context.apiId"
      aws_endpoint_request_id = "$context.awsEndpointRequestId"
      data_processed = "$context.dataProcessed"
      domain_name = "$context.domainName"
      domain_prefix = "$context.domainPrefix"
      error_message = "$context.error.message"
      error_response_type = "$context.error.responseType"
      extended_request_id = "$context.extendedRequestId"
      http_method = "$context.httpMethod"
      source_ip = "$context.identity.sourceIp"
      user_agent = "$context.identity.userAgent"
      path = "$context.path"
      protocol = "$context.protocol"
      request_id = "$context.requestId"
      request_time = "$context.requestTime"
      request_time_epoch = "$context.requestTimeEpoch"
      route_key = "$context.routeKey"
      stage = "$context.stage"
      integration_error_message = "$context.integrationErrorMessage"
      integration_latency = "$context.integrationLatency"
      integration_status = "$context.integrationStatus"
      response_latency = "$context.responseLatency"
      response_length = "$context.responseLength"
      status = "$context.status"
    })
  }
}

resource "aws_cloudwatch_log_group" "production_proxy" {
  name = "/aws/apigateway/${aws_apigatewayv2_api.primary.name}"
  retention_in_days = 30
}

resource "aws_apigatewayv2_api_mapping" "primary" {
  api_id = aws_apigatewayv2_api.primary.id
  domain_name = aws_apigatewayv2_domain_name.primary.id
  stage = aws_apigatewayv2_stage.production.id
}

resource "aws_apigatewayv2_route" "primary" {
  api_id = aws_apigatewayv2_api.primary.id
  route_key = "$default"
  target = "integrations/${aws_apigatewayv2_integration.primary.id}"
}

resource "aws_apigatewayv2_integration" "primary" {
  api_id = aws_apigatewayv2_api.primary.id
  integration_type = "AWS_PROXY"

  payload_format_version = "2.0"
  integration_method = "POST"
  integration_uri = aws_lambda_function.api_lambda.invoke_arn
}
