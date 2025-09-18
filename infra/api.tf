resource "aws_apigatewayv2_api" "http" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["content-type", "authorization"]
    allow_methods     = ["GET", "POST", "OPTIONS"]
    allow_origins     = ["*"]
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.contact.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "contact" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /contact"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# PHASE 2 - Booking endpoint
resource "aws_apigatewayv2_route" "booking" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /booking"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# PHASE 2 - Availability check endpoint  
resource "aws_apigatewayv2_route" "availability" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /availability"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

# CMS Data endpoint - proxy to Webiny/DynamoDB
resource "aws_apigatewayv2_route" "cms_data" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /cms-data"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}


