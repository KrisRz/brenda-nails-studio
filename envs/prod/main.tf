terraform {
  required_version = ">= 1.6.0"

  backend "s3" {
    bucket         = "brenda-nails-terraform-state"
    key            = "envs/prod/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "brenda-nails-terraform-locks"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.common_tags
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = local.common_tags
  }
}

locals {
  common_tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Repository  = "brenda-nails-studio"
  }
}

# Data sources for external resources
data "aws_ssm_parameter" "webiny_admin_url" {
  name = "/brenda/webiny/admin_url"
}

data "aws_ssm_parameter" "webiny_read_api_url" {
  name = "/brenda/webiny/read_api_url"
}

data "aws_ssm_parameter" "webiny_preview_api_url" {
  name = "/brenda/webiny/preview_api_url"
}

data "aws_ssm_parameter" "webiny_manage_api_url" {
  name = "/brenda/webiny/manage_api_url"
}

# ACM Certificate for CloudFront (must be in us-east-1)
resource "aws_acm_certificate" "cloudfront" {
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  subject_alternative_names = ["www.${var.domain_name}"]
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = local.common_tags
}

# Route53 zone and certificate validation
data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.cloudfront.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.main.zone_id
}

resource "aws_acm_certificate_validation" "cloudfront" {
  provider        = aws.us_east_1
  certificate_arn = aws_acm_certificate.cloudfront.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}

# Lambda package preparation
resource "null_resource" "lambda_build" {
  triggers = {
    lambda_code = filemd5("${path.root}/../../lambda/index.mjs")
    lambda_deps = filemd5("${path.root}/../../lambda/package.json")
  }

  provisioner "local-exec" {
    working_dir = "${path.root}/../../lambda"
    command     = "npm install --omit=dev --no-audit --no-fund"
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.root}/../../lambda"
  output_path = "${path.root}/lambda.zip"
  depends_on  = [null_resource.lambda_build]
}

# Main application module
module "brenda_app" {
  source = "../../modules/brenda-app"

  project     = var.project_name
  environment = var.environment
  domain_name = var.domain_name

  acm_certificate_arn = aws_acm_certificate_validation.cloudfront.certificate_arn
  lambda_zip_path     = data.archive_file.lambda_zip.output_path

  from_email   = var.from_email
  to_email     = var.to_email
  brenda_phone = var.brenda_phone

  webiny_read_api_url     = data.aws_ssm_parameter.webiny_read_api_url.value
  webiny_manage_api_url   = data.aws_ssm_parameter.webiny_manage_api_url.value
  webiny_dynamodb_table   = "wby-webiny-8a9ac4d"
  webiny_api_key          = "adb873f12aaa8e649f2b0516dab3068b61c2f144f98d5159"

  tags = local.common_tags
}

# Route53 records for the domain
resource "aws_route53_record" "apex" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = module.brenda_app.cloudfront_domain
    zone_id                = "Z2FDTNDATAQYW2" # CloudFront hosted zone ID
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = module.brenda_app.cloudfront_domain
    zone_id                = "Z2FDTNDATAQYW2" # CloudFront hosted zone ID
    evaluate_target_health = false
  }
}
