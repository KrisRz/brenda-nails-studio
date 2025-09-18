output "api_url" {
  description = "HTTP endpoint for contact form"
  value       = "${aws_apigatewayv2_api.http.api_endpoint}/contact"
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = aws_cloudfront_distribution.site.domain_name
}

output "site_domain" {
  description = "Primary site domain (apex)"
  value       = var.primary_domain
}

# Webiny URLs from SSM Parameter Store
output "webiny_admin_url" {
  description = "Webiny Admin Panel URL"
  value       = data.aws_ssm_parameter.webiny_admin_url.value
  sensitive   = true
}

output "webiny_read_api_url" {
  description = "Webiny Read API URL for frontend"
  value       = data.aws_ssm_parameter.webiny_read_api_url.value
  sensitive   = true
}

output "webiny_preview_api_url" {
  description = "Webiny Preview API URL"
  value       = data.aws_ssm_parameter.webiny_preview_api_url.value
  sensitive   = true
}

output "webiny_manage_api_url" {
  description = "Webiny Manage API URL"
  value       = data.aws_ssm_parameter.webiny_manage_api_url.value
  sensitive   = true
}

