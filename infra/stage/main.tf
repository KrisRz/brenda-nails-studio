terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    # Configure this with your S3 bucket for Terraform state
    # bucket = "your-terraform-state-bucket"
    # key    = "brenda-nails/stage/terraform.tfstate"
    # region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "brenda-nails-studio"
      Environment = "stage"
      ManagedBy   = "terraform"
    }
  }
}

locals {
  project_name = "brenda-nails"
  environment  = "stage"
  domain_name  = var.domain_name
}

# DynamoDB Table for appointments
resource "aws_dynamodb_table" "appointments" {
  name           = "${local.project_name}-${local.environment}-appointments"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  attribute {
    name = "email"
    type = "S"
  }
  
  global_secondary_index {
    name     = "email-index"
    hash_key = "email"
  }

  tags = {
    Name = "${local.project_name}-${local.environment}-appointments"
  }
}

# S3 Bucket for static site hosting
resource "aws_s3_bucket" "website" {
  bucket = "${local.project_name}-${local.environment}-website"
}

resource "aws_s3_bucket_versioning" "website" {
  bucket = aws_s3_bucket.website.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "website" {
  bucket = aws_s3_bucket.website.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "website" {
  bucket = aws_s3_bucket.website.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
