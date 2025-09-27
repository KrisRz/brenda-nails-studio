terraform {
  required_version = ">= 1.6.0"
  
  required_providers {
    aws     = { source = "hashicorp/aws", version = "~> 5.60" }
    archive = { source = "hashicorp/archive", version = "~> 2.5" }
    null    = { source = "hashicorp/null", version = "~> 3.2" }
  }
}

locals {
  name_prefix = "${var.project}-${var.environment}"
}

# S3 bucket for static website
resource "aws_s3_bucket" "site" {
  bucket = var.domain_name
}

resource "aws_s3_bucket_ownership_controls" "site" {
  bucket = aws_s3_bucket.site.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "site" {
  bucket                  = aws_s3_bucket.site.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# CloudFront distribution
resource "aws_cloudfront_origin_access_control" "oac" {
  name                              = "${local.name_prefix}-oac"
  description                       = "OAC for ${aws_s3_bucket.site.bucket}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_iam_policy_document" "s3_policy" {
  statement {
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    actions = [
      "s3:GetObject"
    ]
    resources = [
      "${aws_s3_bucket.site.arn}/*"
    ]
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.site.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site" {
  bucket = aws_s3_bucket.site.id
  policy = data.aws_iam_policy_document.s3_policy.json
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

resource "aws_cloudfront_function" "url_rewrite" {
  name    = "${local.name_prefix}-url-rewrite"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrite URLs to append /index.html for directory-style routing"
  publish = true
  code    = <<-EOT
function handler(event) {
    var request = event.request;
    var uri = request.uri;
    
    // If URI ends with /, append index.html
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // If URI doesn't have a file extension and doesn't end with /, append /index.html
    else if (!uri.includes('.') && !uri.endsWith('/')) {
        request.uri += '/index.html';
    }
    
    return request;
}
EOT
}

resource "aws_cloudfront_distribution" "site" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = local.name_prefix
  default_root_object = "index.html"

  aliases = [
    var.domain_name,
    "www.${var.domain_name}"
  ]

  origin {
    domain_name              = aws_s3_bucket.site.bucket_regional_domain_name
    origin_id                = "s3-site"
    origin_access_control_id = aws_cloudfront_origin_access_control.oac.id

    s3_origin_config {
      origin_access_identity = ""
    }
  }

  default_cache_behavior {
    target_origin_id         = "s3-site"
    viewer_protocol_policy   = "redirect-to-https"
    allowed_methods          = ["GET", "HEAD"]
    cached_methods           = ["GET", "HEAD"]
    compress                 = true
    cache_policy_id          = data.aws_cloudfront_cache_policy.caching_optimized.id
    origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer.id
    
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.url_rewrite.arn
    }
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }

  tags = var.tags
}

# Lambda function for contact form
resource "aws_lambda_function" "contact" {
  function_name    = "${local.name_prefix}-contact"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  architectures    = ["arm64"]
  timeout          = 10
  memory_size      = 256
  filename         = var.lambda_zip_path
  source_code_hash = filebase64sha256(var.lambda_zip_path)

  environment {
    variables = {
      FROM_EMAIL                          = var.from_email
      TO_EMAIL                            = var.to_email
      ALLOWED_ORIGIN                      = "https://${var.domain_name}"
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
      SNS_TOPIC_ARN                       = aws_sns_topic.booking_notifications.arn
      BRENDA_PHONE                        = var.brenda_phone
      WEBINY_READ_API_URL                 = var.webiny_read_api_url
      WEBINY_MANAGE_API_URL               = var.webiny_manage_api_url
      WEBINY_DYNAMODB_TABLE               = var.webiny_dynamodb_table
      WEBINY_API_KEY                      = var.webiny_api_key
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda]

  tags = var.tags
}

resource "aws_iam_role" "lambda_role" {
  name               = "${local.name_prefix}-contact-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
  tags               = var.tags
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "lambda_permissions" {
  statement {
    effect    = "Allow"
    actions   = ["ses:SendEmail", "ses:SendRawEmail"]
    resources = ["*"]
  }
  statement {
    effect    = "Allow"
    actions   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "sns:Publish"
    ]
    resources = [
      aws_sns_topic.booking_notifications.arn
    ]
  }
}

resource "aws_iam_policy" "lambda_policy" {
  name   = "${local.name_prefix}-lambda-policy"
  policy = data.aws_iam_policy_document.lambda_permissions.json
  tags   = var.tags
}

resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.name_prefix}-contact"
  retention_in_days = 14
  tags              = var.tags
}

# API Gateway
resource "aws_apigatewayv2_api" "http" {
  name          = "${local.name_prefix}-api"
  protocol_type = "HTTP"
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["content-type", "authorization"]
    allow_methods     = ["GET", "POST", "OPTIONS"]
    allow_origins     = ["*"]
  }
  tags = var.tags
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

resource "aws_apigatewayv2_route" "cms_data" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /cms-data"
  target    = "integrations/${aws_apigatewayv2_integration.lambda.id}"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
  tags        = var.tags
}

resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.contact.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}

# SNS topic for notifications
resource "aws_sns_topic" "booking_notifications" {
  name = "${local.name_prefix}-booking-notifications"
  tags = var.tags
}
