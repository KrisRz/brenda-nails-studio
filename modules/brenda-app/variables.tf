variable "project" {
  description = "Project name for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (prod, stage, dev)"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the website"
  type        = string
}

variable "acm_certificate_arn" {
  description = "ARN of the ACM certificate for CloudFront"
  type        = string
}

variable "lambda_zip_path" {
  description = "Path to the Lambda function ZIP file"
  type        = string
}

variable "from_email" {
  description = "Email address for sending notifications"
  type        = string
}

variable "to_email" {
  description = "Email address for receiving notifications"
  type        = string
}

variable "brenda_phone" {
  description = "Brenda's phone number for SMS notifications"
  type        = string
}

variable "webiny_read_api_url" {
  description = "Webiny Read API URL"
  type        = string
}

variable "webiny_manage_api_url" {
  description = "Webiny Manage API URL"
  type        = string
}

variable "webiny_dynamodb_table" {
  description = "Webiny DynamoDB table name"
  type        = string
}

variable "webiny_api_key" {
  description = "Webiny API key"
  type        = string
  sensitive   = true
}

variable "tags" {
  description = "Common tags for all resources"
  type        = map(string)
  default     = {}
}
