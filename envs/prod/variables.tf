variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-2"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "brenda-nails"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "domain_name" {
  description = "Primary domain name for the website"
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
