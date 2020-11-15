locals {
  function_name = "api-unfurl-page"
}

resource "aws_lambda_function" "api_lambda" {
  function_name = local.function_name
  role = aws_iam_role.api_lambda.arn

  handler = "api/dist/run-in-lambda.handler"
  runtime = "nodejs12.x"
  timeout = 10

  # built by api docker image, path set through docker-compose volume
  filename = "../dist/api.zip"
  source_code_hash = filebase64sha256("../dist/api.zip")

  environment {
    variables = {
      NODE_ENV = "production"
      NODE_OPTIONS = "--enable-source-maps"
      HOST = "api.unfurl.page"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.api_lambda_logs,
    aws_cloudwatch_log_group.api_lambda
  ]
}

resource "aws_cloudwatch_log_group" "api_lambda" {
  name = "/aws/lambda/${local.function_name}"
  retention_in_days = 30
}

resource "aws_iam_role" "api_lambda" {
  name = "api_lambda"
  assume_role_policy = data.aws_iam_policy_document.api_lambda_assume_role_policy.json
}

data "aws_iam_policy_document" "api_lambda_assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "api_lambda_logs" {
  role = aws_iam_role.api_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_permission" "api_lambda_allow_apigateway" {
  action = "lambda:InvokeFunction"
  function_name = aws_lambda_function.api_lambda.arn
  principal = "apigateway.amazonaws.com"
  source_arn = "${aws_apigatewayv2_api.primary.execution_arn}/*/$default"
}
