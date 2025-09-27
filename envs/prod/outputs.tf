output "api_url" {
  description = "HTTP endpoint for contact form"
  value       = module.brenda_app.api_url
}

output "cloudfront_domain" {
  description = "CloudFront distribution domain"
  value       = module.brenda_app.cloudfront_domain
}

output "site_domain" {
  description = "Primary site domain"
  value       = var.domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.brenda_app.cloudfront_distribution_id
}

output "site_bucket_name" {
  description = "S3 bucket name for static website"
  value       = module.brenda_app.site_bucket_name
}
