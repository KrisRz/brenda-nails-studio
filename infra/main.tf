terraform {
  required_version = ">= 1.6.0"
  
  backend "local" {
    path = "terraform-brenda.tfstate"
  }
  
  required_providers {
    aws     = { source = "hashicorp/aws", version = "~> 5.60" }
    archive = { source = "hashicorp/archive", version = "~> 2.5" }
    null    = { source = "hashicorp/null", version = "~> 3.2" }
  }
}

provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "use1"
  region = "us-east-1"
}

locals {
  name_prefix      = "${var.project}-${var.env}"
  apex_domain      = var.primary_domain
  www_domain       = "www.${var.primary_domain}"
  site_bucket_name = var.primary_domain
}

# Data sources to read Webiny URLs from SSM Parameter Store
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



