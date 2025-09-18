# Install lambda deps and build zip contents
resource "null_resource" "lambda_npm_ci" {
  triggers = {
    index_hash = filesha256("${path.module}/lambda/index.mjs")
    pkg_hash   = filesha256("${path.module}/lambda/package.json")
  }

  provisioner "local-exec" {
    working_dir = "${path.module}/lambda"
    command     = "npm install --omit=dev --no-audit --no-fund"
  }
}

# Archive entire lambda dir including node_modules
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
  depends_on  = [null_resource.lambda_npm_ci]
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

resource "aws_iam_role" "lambda_role" {
  name               = "${local.name_prefix}-contact-lambda-role"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
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
  # PHASE 2 - DynamoDB permissions
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:Scan"
    ]
    resources = [
      aws_dynamodb_table.data.arn,
      "${aws_dynamodb_table.data.arn}/*",
      "arn:aws:dynamodb:${var.region}:*:table/wby-webiny-*",
      "arn:aws:dynamodb:${var.region}:*:table/wby-webiny-*/index/*"
    ]
  }
  # PHASE 2 - SNS permissions for SMS notifications
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
}

resource "aws_iam_role_policy_attachment" "lambda_attach" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.name_prefix}-contact"
  retention_in_days = 14
}

resource "aws_lambda_function" "contact" {
  function_name    = "${local.name_prefix}-contact"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  architectures    = ["arm64"]
  timeout          = 10
  memory_size      = 256
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      FROM_EMAIL                          = var.from_email
      TO_EMAIL                            = var.to_email
      ALLOWED_ORIGIN                      = var.allowed_origin
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
      # PHASE 2 - DynamoDB table name
      DYNAMODB_TABLE = aws_dynamodb_table.data.name
      # PHASE 2 - SNS topic for notifications
      SNS_TOPIC_ARN = aws_sns_topic.booking_notifications.arn
      BRENDA_PHONE  = var.brenda_phone
      # Webiny API URLs
      WEBINY_READ_API_URL    = data.aws_ssm_parameter.webiny_read_api_url.value
      WEBINY_MANAGE_API_URL  = data.aws_ssm_parameter.webiny_manage_api_url.value
      WEBINY_DYNAMODB_TABLE  = "wby-webiny-8a9ac4d"
      WEBINY_API_KEY         = "adb873f12aaa8e649f2b0516dab3068b61c2f144f98d5159"
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda]
}


